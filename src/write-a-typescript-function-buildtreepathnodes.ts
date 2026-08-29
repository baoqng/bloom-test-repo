// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildTreePath(nodes: unknown, targetId: unknown): string[] {
  // Validate nodes is a non-empty array
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new TypeError('nodes must be a non-empty array');
  }

  // Validate each node has a string id
  for (const node of nodes) {
    if (!isPlainObject(node) || typeof node['id'] !== 'string') {
      throw new TypeError('Each node must have a string id');
    }
  }

  // Validate targetId is a non-empty string
  if (typeof targetId !== 'string' || targetId.length === 0) {
    throw new TypeError('targetId must be a non-empty string');
  }

  // Build a map from id to node
  const nodeMap = new Map<string, { id: string; parentId: string | null }>();
  for (const node of nodes) {
    const n = node as Record<string, unknown>;
    const id = n['id'] as string;
    const parentId = typeof n['parentId'] === 'string' ? n['parentId'] : null;
    nodeMap.set(id, { id, parentId });
  }

  // Check target node exists
  if (!nodeMap.has(targetId as string)) {
    throw new RangeError('Target node not found');
  }

  // Follow parentId links from target to root, detecting cycles
  const path: string[] = [];
  const visited = new Set<string>();
  let currentId: string | null = targetId as string;

  while (currentId !== null) {
    if (visited.has(currentId)) {
      throw new RangeError('Cycle detected in tree');
    }
    visited.add(currentId);

    const current = nodeMap.get(currentId);
    if (current === undefined) {
      // parentId references a node not in the list; treat as root boundary
      break;
    }

    path.push(current.id);
    currentId = current.parentId;
  }

  // Reverse to get root-to-target order
  path.reverse();

  return path;
}