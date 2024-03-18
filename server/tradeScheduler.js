/*
The trade scheduler is an "Order Management System" for this electronic market.

This periodically polls the existing trades (order book) for buyers that can be 
matched with sellers according to a FIFO rule. Priority/premium customers may 
pay to be first.

Two things result in a completed trade that should be scheduled:
1. Trade is filled (max # of paying buyers is hit)
2. Trade reaches time limit (schedule whoever is there or nobody)
*/

function resolveTrades() {};
function schedulerException() {
    try {
        // check any flags, try to recover gracefully if needed
    } catch (error) {
        // log and give up, leave it to external processes
        return true;
    }
};

// Check trades and assign queues to sellers until an exception occurs.
async function start(pollingTime) {
    while (!schedulerException()) {
        await wait(pollingTime);
        await resolveTrades();
    }
}

function wait(pollingTime) {
    return new Promise(resolve => {
        setTimeout(resolve, pollingTime);
    });
}

module.exports = {
  start: start,
};
