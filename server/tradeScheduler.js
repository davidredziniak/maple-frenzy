/*
The trade scheduler is an "Order Management System" for this electronic market.

This periodically polls the existing trades (order book) for buyers that can be 
matched with sellers according to their order in a priority queue.
This is already handled by the database runtime, and is indexed on insertion 
order and premium status.

Only two things should "resolve" a trade:
1. Time settlement: Our system closes out the trade 5 minutes before tradeStart.
Sellers/Buyers in effect agree on this transaction ("settlement"), the 
"delivery" happens in-game between the agreeing parties until tradeEnd.

2. Cancellation by Seller for some reason (handled by Trade controller).

TODO [MF-14/MF-34]: Testing trade resolution and schedule exceptions. ACID 
guarantees theoretically should keep things well-behaved but really ought to 
make sure since this is running 24/7.
TODO [MF-22/MF-35]: Priority/premium customers may pay to dislodge non-payors 
from queue.
*/

const db = require("./models");
const Trade = db.trades;
const TradeSlot = db.tradeSlots;
const FinishedTrade = db.finishedTrades;
const UserProfile = db.userProfiles;

// Settlement time is within 5 min. of transaction, mark as inProgress then.
// Also evict trades to finishedTrades table when they are past their timeEnd.
async function resolveTrades(minuteOffset) {
  const settleTime = new Date(Date.now() + minuteOffset * 60000).toISOString();
  Trade.update(
    { inProgress: true },
    {
      where: {
        [db.Sequelize.Op.and]: [
          { timeStart: { [db.Sequelize.Op.lte]: settleTime } },
          { inProgress: { [db.Sequelize.Op.is]: false } },
        ],
      },
    }
  ).catch();

  // Find if any trades have currently ended
  const currentTime = new Date().toISOString();
  const doneTrades = await Trade.findAll({
    where: { timeEnd: { [db.Sequelize.Op.lte]: currentTime } },
  });

  // Loop through finished trades and transfer data to `finished_trades`
  // Destroy the current table records after it's done
  doneTrades.forEach(async (trade) => {
    const slotRecords = await TradeSlot.findAll({
      where: { tradeId: trade.id },
    });

    let slotRecordsMap = await slotRecords.map((record) => record.toJSON());

    await FinishedTrade.create({
      tradeId: trade.id,
      tradeData: JSON.stringify(trade),
      tradeSlotData: JSON.stringify(slotRecordsMap),
    });


    // Update trade count of seller
    await UserProfile.findOne({ where: { userId: trade.sellerId }}).then(async (profile) => {
      await UserProfile.update(
        { tradeCount: profile.tradeCount + 1 },
        { where: { id: profile.id } }
      );
    });

    // Increment trade count of all buyers
    await slotRecords.forEach(async (record) => {
      // Increment trade count of user slots
      await UserProfile.findOne({ where: { userId: record.userId }}).then(async (profile) => {
        await UserProfile.update(
          { tradeCount: profile.tradeCount + 1 },
          { where: { id: profile.id } }
        );
      });
    });

    // Destroy trade slots
    await slotRecords.forEach((record) => {
      record.destroy();
    });

    await trade.destroy();
  });
}

// Continually posting async promises that force await within start() context.
function wait(pollingTime) {
  return new Promise((resolve) => {
    setTimeout(resolve, pollingTime);
  });
}

function schedulerException() {
  try {
    // check any flags, try to recover gracefully if needed
  } catch (error) {
    // log and give up, leave it to external processes
    return true;
  }
}

async function start(pollingTime) {
  const settleOffset = 5; // minutes
  while (!schedulerException()) {
    await resolveTrades(settleOffset);
    await wait(pollingTime);
  }
}

module.exports = {
  start: start,
};
