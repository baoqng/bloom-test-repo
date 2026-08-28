// bloom-deps:

function parseRetryDirective(directive: unknown): { maxAttempts: number; delayMs: number; backoffFactor: number } {
  if (typeof directive !== 'string') {
    throw new TypeError('directive must be a string');
  }

  if (!directive.trim()) {
    throw new RangeError('directive must not be empty');
  }

  const tokens = directive.split(',');

  const known = new Set(['max', 'delay', 'factor']);
  const result: Record<string, string> = {};

  let hasValidEntry = false;

  for (const rawToken of tokens) {
    const token = rawToken.trim();
    if (!token) {
      continue;
    }

    hasValidEntry = true;

    const eqIdx = token.indexOf('=');
    if (eqIdx === -1) {
      throw new RangeError('directive entry must be key=value');
    }

    const key = token.slice(0, eqIdx).trim();
    const value = token.slice(eqIdx + 1).trim();

    if (!key) {
      throw new RangeError('directive key must not be empty');
    }

    if (!known.has(key)) {
      throw new RangeError(`unknown directive key: ${key}`);
    }

    result[key] = value;
  }

  for (const req of ['max', 'delay', 'factor']) {
    if (!(req in result)) {
      throw new RangeError(`missing required key: ${req}`);
    }
  }

  // Parse max: must be a positive integer
  const maxStr = result['max'];
  const maxNum = Number(maxStr);
  if (
    !Number.isInteger(maxNum) ||
    maxNum <= 0 ||
    maxStr.trim() === '' ||
    /[^0-9\-]/.test(maxStr.trim()) === false && false // allow numeric check to proceed
  ) {
    // Re-check cleanly
    const cleanMax = maxStr.trim();
    if (
      !/^\d+$/.test(cleanMax) ||
      !Number.isInteger(maxNum) ||
      maxNum <= 0
    ) {
      throw new RangeError('max must be a positive integer');
    }
  }
  // Simplified clean check for max
  const cleanMax = maxStr.trim();
  if (!/^\d+$/.test(cleanMax) || !Number.isInteger(Number(cleanMax)) || Number(cleanMax) <= 0) {
    throw new RangeError('max must be a positive integer');
  }
  const maxAttempts = Number(cleanMax);

  // Parse delay: must be a non-negative integer
  const delayStr = result['delay'];
  const cleanDelay = delayStr.trim();
  if (!/^\d+$/.test(cleanDelay) || !Number.isInteger(Number(cleanDelay)) || Number(cleanDelay) < 0) {
    throw new RangeError('delay must be a non-negative integer');
  }
  const delayMs = Number(cleanDelay);

  // Parse factor: must be a finite number >= 1
  const factorStr = result['factor'];
  const cleanFactor = factorStr.trim();
  const factorNum = Number(cleanFactor);
  if (!isFinite(factorNum) || factorNum < 1 || cleanFactor === '') {
    throw new RangeError('factor must be a number >= 1');
  }
  const backoffFactor = factorNum;

  return { maxAttempts, delayMs, backoffFactor };
}

export { parseRetryDirective };