# IntervalQueue

### The reason
After reading about ```setInterval```, Ive realized how inacurate the interval is (due to browser throttle and other factors.) The goal with this was to reliably call a function after X amount of time despite the work load benchs. So lets say a xhr request took 30 seconds, the function would still start X time after those 30 seconds.

### How it work
I based it off c# semaphoreslim concept in which only X amount of instances can read/write while the semaphore is locked. Instead I use an event emitter and an array of one single byte to set the state of the queue (easier than using a bool, but slower). It support circular flow, sync and async callbacks and drain itself once objects are queued.(FIFO queue, using array.shift).

### Example
```javascript
var queue = new IntervalQueue();

// Queue sync callback..
queue.Queue(() => {
    console.log("ping from: 4.")
}, 1000);

// Queue async callback..
queue.QueueAsync(async () => {
    // Simulate some heavy task.
    await new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
    });
    console.log(`ping from: 1.`);
}, 2000);

// Nothing else is blocked aside callbacks within the queue ..
```
