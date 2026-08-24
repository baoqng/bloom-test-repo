// bloom-deps:

import { createCircuitBreaker } from './solution';

type State = 'closed' | 'open' | 'half-open';

function validateOptions(options: { failureThreshold: number; successThreshold: number; timeout: number }): void {
  if (
    options === null ||
    options === undefined ||
    typeof options !== 'object'
  ) {
    throw new TypeError('options must be a non-null object');
  }

  const { failureThreshold, successThreshold, timeout } = options;

  if (typeof failureThreshold !== 'number' || !isFinite(failureThreshold) || failureThreshold <= 0) {
    throw new TypeError('failureThreshold must be a positive finite number');
  }
  if (typeof successThreshold !== 'number' || !isFinite(successThreshold) || successThreshold <= 0) {
    throw new TypeError('successThreshold must be a positive finite number');
  }
  if (typeof timeout !== 'number' || !isFinite(timeout) || timeout < 0) {
    throw new TypeError('timeout must be a non-negative finite number');
  }
}

export function createCircuitBreaker<T>(
  fn: () => Promise<T>,
  options: { failureThreshold: number; successThreshold: number; timeout: number }
): { call: () => Promise<T>; state: () => State; reset: () => void } {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    options === null ||
    options === undefined ||
    typeof options !== 'object'
  ) {
    throw new TypeError('options must be a non-null object');
  }

  validateOptions(options);

  const { failureThreshold, timeout } = options;

  let currentState: State = 'closed';
  let failureCount = 0;
  let openedAt: number | null = null;
  let halfOpenCallInFlight = false;

  function transitionToOpen(): void {
    currentState = 'open';
    openedAt = Date.now();
    halfOpenCallInFlight = false;
  }

  function transitionToClosed(): void {
    currentState = 'closed';
    failureCount = 0;
    openedAt = null;
    halfOpenCallInFlight = false;
  }

  function getState(): State {
    if (currentState === 'open' && openedAt !== null) {
      const elapsed = Date.now() - openedAt;
      if (elapsed >= timeout) {
        currentState = 'half-open';
        openedAt = null;
        halfOpenCallInFlight = false;
      }
    }
    return currentState;
  }

  async function call(): Promise<T> {
    const state = getState();

    if (state === 'open') {
      throw new Error('Circuit open');
    }

    if (state === 'half-open') {
      if (halfOpenCallInFlight) {
        throw new Error('Circuit open');
      }
      halfOpenCallInFlight = true;
      try {
        const result = await fn();
        transitionToClosed();
        return result;
      } catch (error) {
        transitionToOpen();
        throw error;
      }
    }

    // state === 'closed'
    try {
      const result = await fn();
      failureCount = 0;
      return result;
    } catch (error) {
      failureCount++;
      if (failureCount >= failureThreshold) {
        transitionToOpen();
      }
      throw error;
    }
  }

  function reset(): void {
    transitionToClosed();
  }

  return {
    call,
    state: getState,
    reset,
  };
}