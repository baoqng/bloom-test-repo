// bloom-deps:

function observeWith<T>(initial: T): {
  get: () => T;
  set: (value: T) => void;
  subscribe: (fn: (value: T) => void) => () => void;
} {
  if (initial === undefined) {
    throw new TypeError('Initial value must not be undefined');
  }

  let current: T = initial;
  const listeners: Map<string, (value: T) => void> = new Map();

  function get(): T {
    return current;
  }

  function set(value: T): void {
    current = value;
    for (const listener of listeners.values()) {
      listener(current);
    }
  }

  function subscribe(fn: (value: T) => void): () => void {
    const id = crypto.randomUUID();
    listeners.set(id, fn);
    return () => {
      listeners.delete(id);
    };
  }

  return { get, set, subscribe };
}

export { observeWith };