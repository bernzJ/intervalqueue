const IntervalQueue = require('./index');

// circular mode will re-queue the items until cancel raised.
var queue = new IntervalQueue({ circular: true });


queue.QueueAsync(async () => {
    // Simulate some heavy task.
    await new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
    });
    console.log(`ping from: 1.`);
}, 2000);


queue.QueueAsync(async () => {
    // Simulate some heavy task.
    await new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
    });
    console.log(`ping from: 2.`);
}, 2000);

queue.QueueAsync(async () => {
    // Simulate some heavy task.
    await new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
    });
    console.log(`ping from: 3.`);
}, 2000);

queue.Queue(() => {
    console.log("ping from: 4.")
}, 1000);

queue.QueueAsync(async () => {
    let myFunc = async function (params) {
        await new Promise((resolve) => {
            setTimeout(() => resolve(), 5000);
        });
    }
    // or use await sugar.
    return myFunc().then(() => console.log("ping from: 5."));
}, 1500);

queue.QueueAsync(async () => {
    // Simulate some heavy task.
    await new Promise((resolve) => {
        setTimeout(() => resolve(), 100);
    });
    console.log(`ping from: 6.`);
}, 100);
/*setTimeout(() => {
    // Cancel circular mode.
    queue.Cancel();
}, 10000);*/
