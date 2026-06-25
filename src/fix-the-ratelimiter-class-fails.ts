import { RangeError } from "./errors";

export class RateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private windowStart: number;
  private counter: number;

  constructor(maxRequests: number, windowMs: number) {
    if (maxRequests <= 0) {
      throw new RangeError("maxRequests must be greater than 0");
    }
    if (windowMs <= 0) {
      throw new RangeError("windowMs must be greater than 0");
    }
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.windowStart = Date.now();
    this.counter = 0;
  }

  isAllowed(): boolean {
    const now = Date.now();

    if (now >= this.windowStart + this.windowMs) {
      this.counter = 0;
      const elapsed = now - this.windowStart;
      const windowsElapsed = Math.floor(elapsed / this.windowMs);
      this.windowStart = this.windowStart + windowsElapsed * this.windowMs;
    }

    if (this.counter < this.maxRequests) {
      this.counter += 1;
      return true;
    }

    return false;
  }
}