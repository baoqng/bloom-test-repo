import { ServiceError } from './errors';

export class RateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private count: number;
  private windowStart: number;
  private timer: ReturnType<typeof setTimeout> | null;

  constructor(maxRequests: number, windowMs: number) {
    if (maxRequests <= 0) {
      throw new RangeError('maxRequests must be greater than 0');
    }
    if (windowMs <= 0) {
      throw new RangeError('windowMs must be greater than 0');
    }

    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.count = 0;
    this.windowStart = Date.now();
    this.timer = null;

    this.scheduleReset();
  }

  private scheduleReset(): void {
    this.timer = setTimeout(() => {
      this.reset();
    }, this.windowMs);

    if (this.timer !== null && typeof this.timer === 'object' && 'unref' in this.timer) {
      (this.timer as { unref: () => void }).unref();
    }
  }

  private reset(): void {
    this.count = 0;
    this.windowStart = Date.now();
    this.scheduleReset();
  }

  isAllowed(): boolean {
    if (this.count < this.maxRequests) {
      this.count += 1;
      return true;
    }
    return false;
  }

  destroy(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}