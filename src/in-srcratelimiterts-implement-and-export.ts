export class RateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private requestCount: number;
  private windowStart: number;

  constructor(maxRequests: number, windowMs: number) {
    if (maxRequests <= 0) {
      throw new RangeError("maxRequests must be greater than 0");
    }
    if (windowMs <= 0) {
      throw new RangeError("windowMs must be greater than 0");
    }

    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requestCount = 0;
    this.windowStart = Date.now();
  }

  isAllowed(): boolean {
    const now = Date.now();
    const elapsed = now - this.windowStart;

    if (elapsed >= this.windowMs) {
      this.requestCount = 0;
      this.windowStart = now;
    }

    if (this.requestCount < this.maxRequests) {
      this.requestCount += 1;
      return true;
    }

    return false;
  }
}