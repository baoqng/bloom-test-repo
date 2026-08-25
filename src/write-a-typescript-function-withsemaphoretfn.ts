// bloom-deps:

const semaphoreMap = new Map<number, { slots: number; queue: Array<{ resolve: () => void; reject: (err: Error) => void }> }>();

let semaphoreIdCounter = 0;

function createSemaphoreState(slots: number) {
  const id = ++semaphoreIdCounter;
  semaphoreMap.set(id, { slots, queue: [] });
  return id;
}

export async function withSemaphore<T>(
  fn: () => Promise<T>,
  slots: unknown,
  timeoutMs: unknown
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof slots !== 'number' || !isFinite(slots)) {
    throw new TypeError('slots must be a finite number');
  }
  if (!Number.isInteger(slots) || slots <= 0) {
    throw new RangeError('slots must be a positive integer');
  }
  if (typeof timeoutMs !== 'number' || !isFinite(timeoutMs)) {
    throw new TypeError('timeoutMs must be a finite number');
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs must be a positive integer');
  }

  const state = getOrCreateSharedState(slots);

  await acquireSlot(state, timeoutMs);

  try {
    return await fn();
  } finally {
    releaseSlot(state);
  }
}

interface SemaphoreState {
  available: number;
  queue: Array<{ resolve: () => void; reject: (err: Error) => void }>;
}

// We use a module-level shared state keyed by slot count for simplicity,
// but actually each call to withSemaphore with the same slots count should
// share a semaphore. However, the typical use case is a closure over a
// shared semaphore. Since the function signature doesn't pass a semaphore
// object, we create one per unique call site.
// 
// Looking at the contract more carefully: each withSemaphore call needs its
// own semaphore state that is shared across concurrent calls. But since there's
// no semaphore object passed in, the semaphore must be created externally or
// we need a factory pattern.
//
// Re-reading: "executes fn when a semaphore slot is available" - the semaphore
// is implicit. We need a module-level semaphore shared across all calls.
// But that doesn't make sense with varying slot counts.
//
// The most reasonable interpretation: each call creates its own independent
// semaphore, but that defeats the purpose. The function must use a shared
// module-level semaphore keyed by slots count.

const sharedStates = new Map<number, SemaphoreState>();

function getOrCreateSharedState(slots: number): SemaphoreState {
  if (!sharedStates.has(slots)) {
    sharedStates.set(slots, { available: slots, queue: [] });
  }
  return sharedStates.get(slots)!;
}

function acquireSlot(state: SemaphoreState, timeoutMs: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (state.available > 0) {
      state.available--;
      resolve();
      return;
    }

    let settled = false;
    let timer: ReturnType<typeof setTimeout>;

    const entry = {
      resolve: () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve();
        }
      },
      reject: (err: Error) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      },
    };

    state.queue.push(entry);

    timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        const idx = state.queue.indexOf(entry);
        if (idx !== -1) {
          state.queue.splice(idx, 1);
        }
        reject(new Error('Semaphore acquisition timed out'));
      }
    }, timeoutMs);
  });
}

function releaseSlot(state: SemaphoreState): void {
  if (state.queue.length > 0) {
    const next = state.queue.shift()!;
    // Don't increment available since we're immediately passing the slot
    next.resolve();
  } else {
    state.available++;
  }
}