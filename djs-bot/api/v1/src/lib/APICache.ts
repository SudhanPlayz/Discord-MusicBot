export interface APICacheOptions {
  invalidateTimeout?: number;
}

export default class APICache<K, T> {
  cache: Map<K, T>;
  timers: Map<K, NodeJS.Timeout>;
  invalidateTimeout: number;

  constructor({ invalidateTimeout = 0 }: APICacheOptions = {}) {
    this.cache = new Map();
    this.timers = new Map();
    this.invalidateTimeout = invalidateTimeout;
  }

  setTimer(key: K, cb: () => boolean, timeout: number) {
    this.timers.set(
      key,
      setTimeout(() => {
        const deleteTimer = cb();

        if (deleteTimer) this.cleanUpTimer(key);
      }, timeout),
    );
  }

  cleanUpTimer(key: K) {
    const exist = this.timers.get(key);
    if (exist) clearTimeout(exist);

    return this.timers.delete(key);
  }

  set(key: K, value: T) {
    const ret = this.cache.set(key, value);

    this.cleanUpTimer(key);

    if (this.invalidateTimeout > 0)
      this.setTimer(
        key,
        () => {
          return this.cache.delete(key);
        },
        this.invalidateTimeout,
      );

    return ret;
  }

  get(key: K) {
    return this.cache.get(key);
  }

  delete(key: K) {
    const deleted = this.cache.delete(key);

    if (deleted) this.cleanUpTimer(key);

    return deleted;
  }
}
