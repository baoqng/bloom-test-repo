// bloom-deps:
import { createHash } from 'crypto';

export function computeHashedKey(namespace: string, content: string): string {
  if (typeof namespace !== 'string') {
    throw new TypeError('namespace must be a string');
  }

  if (namespace.trim().length === 0) {
    throw new RangeError('namespace must not be empty or contain only whitespace');
  }

  if (namespace.length > 64) {
    throw new RangeError('namespace must not exceed 64 characters');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(namespace)) {
    throw new RangeError('namespace contains characters outside [a-zA-Z0-9_-]');
  }

  if (typeof content !== 'string') {
    throw new TypeError('content must be a string');
  }

  const hexDigest = createHash('sha256').update(content, 'utf8').digest('hex');

  return `${namespace}:${hexDigest}`;
}