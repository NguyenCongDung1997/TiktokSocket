//https://stackoverflow.com/a/63208885/2870399

class Queue {
  constructor() { this._items = []; }
  enqueue(item) { this._items.push(item); }

  dequeue() { return this._items.shift(); }
  size() { return this._items.length; }
  isEmpty() { return this._items.length == 0 }
  clean() { this._items = [] }
}

class AutoQueue extends Queue {
  constructor(options) {
    super();
    this._stop = false;
    this._pause = false;
    this.options = options
    this._pendingPromise = false;
  }

  stop() { // new
    this._stop = true;
    this.clean();
  }

  pause() { // new
    this._pause = true;
  }

  start() {
    this._stop = false;
    this._pause = false;
  }

  enqueue(action) {
    return new Promise((resolve, reject) => {
      super.enqueue({ action, resolve, reject });
      this.dequeue();
    });
  }

  async dequeue() {
    if (this._pause || this._pendingPromise) return false; // new

    if (this._stop) { // new
      this._items = [];
      this._stop = false;
      return false;
    }

    let item = super.dequeue();

    if (!item) return false;

    try {
      this._pendingPromise = true;

      let payload = await item.action(this);

      item.resolve(payload);
    } catch (e) {
      item.reject(e);
    } finally {
      if (!this.options || this.options.delay <= 0) {
        this._pendingPromise = false;
        this.dequeue();
      } else {
        setTimeout(() => {
          this._pendingPromise = false;
          this.dequeue();
        }, this.options.delay * 1000)
      }
    }

    return true;
  }
}

export default AutoQueue;