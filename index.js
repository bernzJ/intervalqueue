const EventEmitter = require('events');

class IntervalQueue {
    constructor({ circular = false } = {}) {
        this.queue = [];
        this.sem = new EventEmitter();
        this.free = [1];
        this.circular = circular;
        this.abort = false;
        this.id = null;

        this.drain = function () {
            if (this.queue.length > 0) {
                let lock = this.free.pop();
                if (lock && !this.abort) {
                    this.sem.emit('release');
                }
            }
        }
        this.resetlock = function ({ ret, item } = {}) {
            if (this.circular && item != undefined && !this.abort) {
                this.queue.push(item);
            }
            this.free.push(1);
            this.drain();
            return ret;
        }
        this.sem.on('release', () => {
            let item = this.queue.shift();
            let begining = new Date().getTime();
            if (!this.abort) {
                this.id = setTimeout(() => {
                    let elapsed = `Elapsed setTimeout ms: ${new Date().getTime() - begining}`;
                    //console.log(elapsed);
                    if (item.awaitable) {
                        item.callback(elapsed).then(() => this.resetlock({ item: this.circular ? item : undefined })).catch(err => this.resetlock({ ret: err, item: this.circular ? item : undefined }));
                    } else {
                        item.callback(elapsed);
                        this.resetlock();
                    }
                }, item.ms);
            }
        });
    }

    Queue(callback, ms, { awaitable = false } = {}) {
        this.queue.push({ callback, ms, awaitable });
        let lock = this.free.pop();
        if (lock) {
            this.sem.emit('release');
        }
    }

    QueueAsync(callback, ms) {
        this.Queue(callback, ms, { awaitable: true })
    }

    Cancel() {
        //let begining = new Date().getTime();
        this.abort = true;
        clearTimeout(this.id);
        this.queue = [];
        //console.log(`Elapsed Cancel ms: ${new Date().getTime() - begining}`);
    }
}

module.exports = IntervalQueue;
