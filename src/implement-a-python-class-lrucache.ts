// bloom-deps:

class LRUCacheNode {
  key: unknown;
  value: unknown;
  prev: LRUCacheNode | null = null;
  next: LRUCacheNode | null = null;

  constructor(key: unknown, value: unknown) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache {
  private capacity: number;
  private map: Map<unknown, LRUCacheNode>;
  private head: LRUCacheNode;
  private tail: LRUCacheNode;

  constructor(capacity: unknown) {
    if (typeof capacity !== 'number' || isNaN(capacity as number) || !Number.isInteger(capacity)) {
      throw new TypeError('capacity must be an integer');
    }
    if ((capacity as number) < 1) {
      throw new ValueError('capacity must be >= 1');
    }

    this.capacity = capacity as number;
    this.map = new Map();

    this.head = new LRUCacheNode(null, null);
    this.tail = new LRUCacheNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private removeNode(node: LRUCacheNode): void {
    const prev = node.prev!;
    const next = node.next!;
    prev.next = next;
    next.prev = prev;
    node.prev = null;
    node.next = null;
  }

  private insertAtFront(node: LRUCacheNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: unknown): unknown {
    if (!this.map.has(key)) {
      return null;
    }
    const node = this.map.get(key)!;
    this.removeNode(node);
    this.insertAtFront(node);
    return node.value;
  }

  put(key: unknown, value: unknown): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;
      this.removeNode(node);
      this.insertAtFront(node);
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev!;
        this.removeNode(lru);
        this.map.delete(lru.key);
      }
      const newNode = new LRUCacheNode(key, value);
      this.insertAtFront(newNode);
      this.map.set(key, newNode);
    }
  }

  len(): number {
    return this.map.size;
  }

  get size(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}

class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValueError';
  }
}

export function createLRUCache(capacity: unknown): LRUCache {
  if (typeof capacity !== 'number' || isNaN(capacity as number) || !Number.isInteger(capacity)) {
    throw new TypeError('capacity must be an integer');
  }
  if ((capacity as number) < 1) {
    throw new ValueError('capacity must be >= 1');
  }
  return new LRUCache(capacity as number);
}