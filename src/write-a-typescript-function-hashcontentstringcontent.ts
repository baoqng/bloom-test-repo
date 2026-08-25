// bloom-deps:

function hashContentString(content: unknown): number {
  if (typeof content !== 'string') {
    throw new TypeError('content must be a string');
  }

  if (content.length === 0) {
    return 0;
  }

  let hash = 5381;

  for (let i = 0; i < content.length; i++) {
    const c = content.charCodeAt(i);
    hash = (Math.imul(hash, 33) + c) | 0;
  }

  return hash | 0;
}

export { hashContentString };