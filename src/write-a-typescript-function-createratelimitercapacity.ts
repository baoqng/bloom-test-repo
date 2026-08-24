// bloom-deps:

function createRateLimiter(
  capacity: number,
  refillRatePerSecond: number
): { consume: (tokens?: number) => boolean; remaining: () => number } {
  if (
    typeof capacity !== 'number' ||
    !Number.isFinite(capacity) ||
    capacity <= 0
  ) {
    throw new TypeError(
      'capacity must be a finite positive number'
    );
  }

  if (
    typeof refillRatePerSecond !== 'number' ||
    !Number.isFinite(refillRatePerSecond) ||
    refillRatePerSecond <= 0
  ) {
    throw new TypeError(
      'refillRatePerSecond must be a finite positive number'
    );
  }

  let currentTokens: number = capacity;
  let lastRefillTime: number = Date.now();

  function refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - lastRefillTime) / 1000;
    const tokensToAdd = elapsedSeconds * refillRatePerSecond;
    currentTokens = Math.min(capacity, currentTokens + tokensToAdd);
    lastRefillTime = now;
  }

  function consume(tokens: number = 1): boolean {
    refill();

    if (currentTokens >= tokens) {
      currentTokens -= tokens;
      return true;
    }

    return false;
  }

  function remaining(): number {
    refill();
    return currentTokens;
  }

  return { consume, remaining };
}

export { createRateLimiter };