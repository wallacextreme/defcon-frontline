/**
 * Strict pre-allocated object pool to eliminate per-frame GC allocations
 * for enemies, projectiles, particles, and floating combat telemetry.
 */
export class ObjectPool {
  /**
   * @param {() => object} factory
   * @param {number} initialSize
   * @param {number} maxSize
   */
  constructor(factory, initialSize = 64, maxSize = 1024) {
    this.factory = factory;
    this.maxSize = maxSize;
    this.free = [];
    this.active = [];
    for (let i = 0; i < initialSize; i++) {
      const obj = this.factory();
      obj._pooledActive = false;
      this.free.push(obj);
    }
  }

  acquire() {
    let obj;
    if (this.free.length > 0) {
      obj = this.free.pop();
    } else if (this.active.length < this.maxSize) {
      obj = this.factory();
    } else {
      // Recycle oldest active instance cleanly if hard cap is reached
      obj = this.active.shift();
      if (obj.onRelease) obj.onRelease();
    }
    obj._pooledActive = true;
    this.active.push(obj);
    return obj;
  }

  release(obj) {
    if (!obj._pooledActive) return;
    obj._pooledActive = false;
    if (obj.onRelease) obj.onRelease();
    const idx = this.active.indexOf(obj);
    if (idx !== -1) {
      // Swap-and-pop for O(1) removal
      const last = this.active.pop();
      if (idx < this.active.length) {
        this.active[idx] = last;
      }
    }
    this.free.push(obj);
  }

  forEachActive(fn) {
    // Iterate backwards so release() during iteration is safe
    for (let i = this.active.length - 1; i >= 0; i--) {
      fn(this.active[i], i);
    }
  }

  releaseAll() {
    while (this.active.length > 0) {
      const obj = this.active.pop();
      obj._pooledActive = false;
      if (obj.onRelease) obj.onRelease();
      this.free.push(obj);
    }
  }

  get activeCount() {
    return this.active.length;
  }
}
