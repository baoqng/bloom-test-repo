// bloom-deps:

export function applyCircuitTransition(
  currentState: unknown,
  failureCount: unknown,
  successCount: unknown,
  failureThreshold: unknown,
  successThreshold: unknown
): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
  if (typeof currentState !== 'string') {
    throw new TypeError("currentState must be a string");
  }

  const trimmedState = currentState.trim();
  if (trimmedState !== 'CLOSED' && trimmedState !== 'OPEN' && trimmedState !== 'HALF_OPEN') {
    throw new RangeError("currentState must be 'CLOSED', 'OPEN', or 'HALF_OPEN'");
  }

  if (
    typeof failureCount !== 'number' ||
    !Number.isFinite(failureCount) ||
    !Number.isInteger(failureCount) ||
    failureCount < 0
  ) {
    throw new TypeError("failureCount must be a non-negative integer");
  }

  if (
    typeof successCount !== 'number' ||
    !Number.isFinite(successCount) ||
    !Number.isInteger(successCount) ||
    successCount < 0
  ) {
    throw new TypeError("successCount must be a non-negative integer");
  }

  if (
    typeof failureThreshold !== 'number' ||
    !Number.isFinite(failureThreshold) ||
    !Number.isInteger(failureThreshold) ||
    failureThreshold <= 0
  ) {
    throw new TypeError("failureThreshold must be a positive integer");
  }

  if (
    typeof successThreshold !== 'number' ||
    !Number.isFinite(successThreshold) ||
    !Number.isInteger(successThreshold) ||
    successThreshold <= 0
  ) {
    throw new TypeError("successThreshold must be a positive integer");
  }

  if (trimmedState === 'CLOSED' && failureCount >= failureThreshold) {
    return 'OPEN';
  }

  if (trimmedState === 'OPEN' && successCount > 0) {
    return 'HALF_OPEN';
  }

  if (trimmedState === 'HALF_OPEN' && successCount >= successThreshold) {
    return 'CLOSED';
  }

  if (trimmedState === 'HALF_OPEN' && failureCount > 0) {
    return 'OPEN';
  }

  return trimmedState as 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}