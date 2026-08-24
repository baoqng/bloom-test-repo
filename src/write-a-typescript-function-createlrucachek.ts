// bloom-deps:

function createLRUCache<K, V>(capacity: number): {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  has: (key: K) => boolean;
  delete: (key: K) => boolean;
  clear: () => void;
  size: () => number;
} {
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new TypeError('Capacity must be a positive integer');
  }

  // Doubly linked list node
  interface Node {
    key: K;
    value: V;
    prev: Node | null;
    next: Node | null;
  }

  // Map from key to node
  const map = new Map<K, Node>();

  // Sentinel head (oldest/LRU) and tail (newest/MRU)
  const head: Node = { key: undefined as unknown as K, value: undefined as unknown as V, prev: null, next: null };
  const tail: Node = { key: undefined as unknown as K, value: undefined as unknown as V, prev: null, next: null };
  head.next = tail;
  tail.prev = head;

  function removeNode(node: Node): void {
    const prev = node.prev!;
    const next = node.next!;
    prev.next = next;
    next.prev = prev;
    node.prev = null;
    node.next = null;
  }

  function insertAtTail(node: Node): void {
    const prev = tail.prev!;
    prev.next = node;
    node.prev = prev;
    node.next = tail;
    tail.prev = node;
  }

  function get(key: K): V | undefined {
    const node = map.get(key);
    if (node === undefined) {
      return undefined;
    }
    // Move to tail (most recently used)
    removeNode(node);
    insertAtTail(node);
    return node.value;
  }

  function set(key: K, value: V): void {
    const existing = map.get(key);
    if (existing !== undefined) {
      existing.value = value;
      removeNode(existing);
      insertAtTail(existing);
      return;
    }

    // Evict LRU if at capacity
    if (map.size >= capacity) {
      const lru = head.next!;
      if (lru !== tail) {
        removeNode(lru);
        map.delete(lru.key);
      }
    }

    const newNode: Node = { key, value, prev: null, next: null };
    insertAtTail(newNode);
    map.set(key, newNode);
  }

  function has(key: K): boolean {
    return map.has(key);
  }

  function del(key: K): boolean {
    const node = map.get(key);
    if (node === undefined) {
      return false;
    }
    removeNode(node);
    map.delete(key);
    return true;
  }

  function clear(): void {
    map.clear();
    head.next = tail;
    tail.prev = head;
  }

  function size(): number {
    return map.size;
  }

  return {
    get,
    set,
    has,
    delete: del,
    clear,
    size,
  };
}

export { createLRUCache };