// bloom-deps:

function computeRollingHash(data: unknown, windowSize: unknown): number[] {
  if (typeof data !== 'string' || data.length === 0) {
    throw new TypeError('data must be a non-empty string');
  }

  if (
    typeof windowSize !== 'number' ||
    !Number.isInteger(windowSize) ||
    windowSize <= 0
  ) {
    throw new TypeError('windowSize must be a positive integer');
  }

  if (windowSize > data.length) {
    throw new RangeError('windowSize must not exceed data length');
  }

  const BASE = 31n;
  const MOD = 1_000_000_007n;

  // Compute BASE^(windowSize-1) mod MOD
  let highPow = 1n;
  for (let i = 0; i < windowSize - 1; i++) {
    highPow = (highPow * BASE) % MOD;
  }

  // Compute hash of first window
  let currentHash = 0n;
  for (let i = 0; i < windowSize; i++) {
    currentHash = (currentHash * BASE + BigInt(data.charCodeAt(i))) % MOD;
  }

  const results: number[] = [];
  results.push(Number(currentHash));

  const numWindows = data.length - windowSize;

  for (let i = 0; i < numWindows; i++) {
    // Remove the leftmost character and add the new rightmost character
    const outChar = BigInt(data.charCodeAt(i));
    const inChar = BigInt(data.charCodeAt(i + windowSize));

    currentHash = (currentHash - outChar * highPow % MOD + MOD) % MOD;
    currentHash = (currentHash * BASE + inChar) % MOD;

    results.push(Number(currentHash));
  }

  return results;
}

export { computeRollingHash };