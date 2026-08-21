// bloom-deps:

async function withCircuitBreaker<T>(
  fn: () => Promise<T>,
  state: { isOpen: boolean; openedAt: number | null; halfOpenAfterMs: number }
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof state !== 'object' ||
    state === null ||
    Array.isArray(state) ||
    Object.getPrototypeOf(state) !== Object.prototype
  ) {
    throw new TypeError('state must be a plain object');
  }

  if (!state.isOpen) {
    return await fn();
  }

  if (state.openedAt === null) {
    throw new Error('Circuit is open');
  }

  if (typeof state.openedAt !== 'number' || !Number.isFinite(state.openedAt)) {
    throw new Error('Circuit is open');
  }

  const elapsed = Date.now() - state.openedAt;
  if (elapsed < state.halfOpenAfterMs) {
    throw new Error('Circuit is open');
  }

  try {
    const result = await fn();
    state.isOpen = false;
    state.openedAt = null;
    return result;
  } catch (error) {
    throw error;
  }
}

export { withCircuitBreaker };