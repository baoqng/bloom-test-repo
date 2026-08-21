// bloom-deps:

async function withCircuitBreaker<T>(
  fn: () => Promise<T>,
  state: { isOpen: boolean; openedAt: number | null; halfOpenAfterMs: number }
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    state === null ||
    state === undefined ||
    typeof state !== 'object' ||
    Array.isArray(state) ||
    Object.getPrototypeOf(state) !== Object.prototype
  ) {
    throw new TypeError('state must be a plain object');
  }

  if (!state.isOpen) {
    return await fn();
  }

  // Circuit is open
  if (state.openedAt === null || state.openedAt === undefined) {
    throw new Error('Circuit is open');
  }

  if (typeof state.openedAt === 'number') {
    const elapsed = Date.now() - state.openedAt;
    if (elapsed < state.halfOpenAfterMs) {
      throw new Error('Circuit is open');
    }

    // Half-open window has elapsed — try the function
    try {
      const result = await fn();
      state.isOpen = false;
      state.openedAt = null;
      return result;
    } catch (err) {
      throw err;
    }
  }

  throw new Error('Circuit is open');
}

export { withCircuitBreaker };