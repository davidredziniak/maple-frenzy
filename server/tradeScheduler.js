/*
The trade scheduler is an "Order Management System" for this electronic market.

This periodically polls the existing trades (order book) for buyers that can be 
matched with sellers according to their order in a priority queue.
This is already handled by the database runtime, and is indexed on insertion 
order and premium status.

Only two things should "resolve" a trade:
1. Time settlement: Our system closes out the trade 5 minutes before tradeEnd.
Sellers/Buyers in effect agree on this transaction ("settlement"), the 
"delivery" happens in-game between the agreeing parties.

2. Cancellation by Seller for some reason (handled by Trade controller).

TODO [MF-14/MF-34]: Testing trade resolution and schedule exceptions. ACID 
guarantees theoretically should keep things well-behaved but really ought to 
make sure since this is running 24/7.
TODO [MF-22/MF-35]: Priority/premium customers may pay to dislodge non-payors 
from queue.
*/
const Trade = require("../models").trades;

// If settlement time is within 5 minutes of transaction, then update trades.
async function resolveTrades(minuteOffset) {
    return (req, res) => {
        const settleTime = new Date(Date.now() + (minuteOffset * 60000)).toISOString();
        Trade.update({ inProgress: true }, {
                where: {
                    timeStart: {[Op.le]: settleTime}
                },
            })
            .catch((error) => res.status(400).send(error));
    }
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
