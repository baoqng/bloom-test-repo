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

  constructor(capacity: number) {
    if (!Number.isInteger(capacity)) {
      throw new TypeError('capacity must be an integer');
    }
    if (capacity < 1) {
      throw new RangeError('capacity must be >= 1');
    }

    this.capacity = capacity;
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
    const node = this.map.get(key);
    if (node === undefined) {
      return null;
    }
    this.removeNode(node);
    this.insertAtFront(node);
    return node.value;
  }

  put(key: unknown, value: unknown): void {
    const existing = this.map.get(key);
    if (existing !== undefined) {
      existing.value = value;
      this.removeNode(existing);
      this.insertAtFront(existing);
      return;
    }

    if (this.map.size >= this.capacity) {
      const lruNode = this.tail.prev!;
      this.removeNode(lruNode);
      this.map.delete(lruNode.key);
    }

    const newNode = new LRUCacheNode(key, value);
    this.map.set(key, newNode);
    this.insertAtFront(newNode);
  }

  __len__(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}