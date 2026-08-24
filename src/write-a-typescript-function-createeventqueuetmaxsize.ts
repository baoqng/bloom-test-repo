// bloom-deps:

function createEventQueue<T>(maxSize: number): {
  enqueue: (item: T) => boolean;
  dequeue: () => T | undefined;
  drain: () => T[];
  size: () => number;
  isFull: () => boolean;
  isEmpty: () => boolean;
} {
  if (!Number.isInteger(maxSize) || maxSize < 1) {
    throw new TypeError('maxSize must be a positive integer');
  }

  const queue: T[] = [];

  return {
    enqueue(item: T): boolean {
      if (queue.length >= maxSize) {
        return false;
      }
      queue.push(item);
      return true;
    },

    dequeue(): T | undefined {
      if (queue.length === 0) {
        return undefined;
      }
      return queue.shift();
    },

    drain(): T[] {
      const items = queue.slice();
      queue.length = 0;
      return items;
    },

    size(): number {
      return queue.length;
    },

    isFull(): boolean {
      return queue.length >= maxSize;
    },

    isEmpty(): boolean {
      return queue.length === 0;
    },
  };
}

export { createEventQueue };