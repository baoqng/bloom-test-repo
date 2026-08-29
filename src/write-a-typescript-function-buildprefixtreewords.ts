// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

export function buildPrefixTree(words: unknown): Record<string, unknown> {
  if (!Array.isArray(words)) {
    throw new TypeError('words must be an array of strings');
  }

  for (const element of words) {
    if (typeof element !== 'string') {
      throw new TypeError('words must be an array of strings');
    }
  }

  const root: Record<string, unknown> = {};

  function insertWord(node: Record<string, unknown>, word: string, index: number): void {
    if (index === word.length) {
      node['$'] = true;
      return;
    }

    const char = word[index];

    if (!(char in node)) {
      node[char] = {};
    }

    const child = node[char];
    if (!isPlainObject(child)) {
      node[char] = {};
    }

    insertWord(node[char] as Record<string, unknown>, word, index + 1);
  }

  for (const word of words as string[]) {
    insertWord(root, word, 0);
  }

  return root;
}