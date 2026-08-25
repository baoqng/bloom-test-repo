// bloom-deps:

const semaphoreMap = new Map<number, { current: number; queue: Array<() => void> }>();

let semaphoreCounter = 0;

function createSemaphore(slots: number) {
  const id = semaphoreCounter++;
  semaphoreMap.set(id, { current: 0, queue: [] });
  return id;
}

export async function withSemaphore<T>(
  fn: () => Promise<T>,
  slots: unknown,
  timeoutMs: unknown
): Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  if (typeof slots !== "number" || !Number.isFinite(slots)) {
    throw new TypeError("slots must be a finite number");
  }

  if (!Number.isInteger(slots) || slots < 1) {
    throw new RangeError("slots must be a positive integer");
  }

  if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) {
    throw new TypeError("timeoutMs must be a finite number");
  }

  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
    throw new RangeError("timeoutMs must be a positive integer");
  }

  const semSlots = slots as number;
  const semTimeout = timeoutMs as number;

  // Use a module-level semaphore state keyed by the slots count
  // But we need a shared semaphore across calls. We'll use a closure-based approach
  // with a shared state stored in a WeakMap or module-level map.
  // Since withSemaphore is a single function, the semaphore state needs to persist
  // across calls. We'll use a module-level map keyed by the slots value.

  return acquireAndRun(fn, semSlots, semTimeout);
}

// Module-level semaphore registry keyed by slot count
const registry = new Map<number, { active: number; queue: Array<() => void> }>();

function getState(slots: number) {
  if (!registry.has(slots)) {
    registry.set(slots, { active: 0, queue: [] });
  }
  return registry.get(slots)!;
}

async function acquireAndRun<T>(
  fn: () => Promise<T>,
  slots: number,
  timeoutMs: number
): Promise<T> {
  const state = getState(slots);

  await acquire(state, slots, timeoutMs);

  try {
    return await fn();
  } finally {
    release(state);
  }
}

function acquire(
  state: { active: number; queue: Array<() => void> },
  slots: number,
  timeoutMs: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (state.active < slots) {
      state.active++;
      resolve();
      return;
    }

    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      // Remove from queue
      const idx = state.queue.indexOf(tryAcquire);
      if (idx !== -1) {
        state.queue.splice(idx, 1);
      }
      reject(new Error("Semaphore acquisition timed out"));
    }, timeoutMs);

    const tryAcquire = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      state.active++;
      resolve();
    };

    state.queue.push(tryAcquire);
  });
}

function release(state: { active: number; queue: Array<() => void> }) {
  state.active--;
  if (state.queue.length > 0) {
    const next = state.queue.shift()!;
    next();
  }
}