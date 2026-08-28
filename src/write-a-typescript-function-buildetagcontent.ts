// bloom-deps:
import { createHash } from 'crypto';

export function buildEtag(content: unknown, weak: unknown): string {
  if (typeof weak !== 'boolean') {
    throw new TypeError('weak must be a boolean');
  }

  if (
    !(typeof content === 'string' && content.length > 0) &&
    !(Buffer.isBuffer(content) && content.length > 0)
  ) {
    throw new TypeError('content must be a non-empty string or Buffer');
  }

  const hash = createHash('sha256');

  if (typeof content === 'string') {
    hash.update(content, 'utf8');
  } else {
    hash.update(content as Buffer);
  }

  const digest = hash.digest('hex');

  if (weak) {
    return `W/"${digest}"`;
  }

  return `"${digest}"`;
}