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

// Settlement time is within 5 min. of transaction, mark as inProgress then.
// Also evict trades to finishedTrades table when they are past their timeEnd.
async function resolveTrades(minuteOffset) {
    const settleTime = new Date(Date.now() + (minuteOffset * 60000)).toISOString();
    Trade.update({ inProgress: true }, {
        where: {
            [db.Sequelize.Op.and]: [
                { timeStart: {[db.Sequelize.Op.lte]: settleTime} },
                { inProgress: {[db.Sequelize.Op.is]: false} }
            ]
        },
    })
    .catch();

    const currentTime = new Date().toISOString();
    const doneTrades = Trade.findAll({
        where: { timeEnd: {[db.sequelize.Op.lte]: currentTime} },
    }).catch();

    // Pending implementation of trade ID in Trade model/controller.
    // Can compress into a single query, but not a limiting factor for now.
    for (tradeRecord in doneTrades) {
        slotRecords = TradeSlot.findAll({
            where: {tradeId: tradeRecord.tradeId},
        }).catch();

        FinishedTrade.create({
            tradeId: 99,
            tradeData: tradeRecord.toJSON(),
            tradeSlotData: slotRecords.toJSON(),
        });
    }
    await doneTrades.destroy();
};

// Continually posting async promises that force await within start() context.
function wait(pollingTime) {
    return new Promise(resolve => {
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
};

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
