// bloom-deps:

export function parseETagValue(etag: unknown): { weak: boolean; tag: string } {
  if (typeof etag !== 'string' || etag.length === 0) {
    throw new TypeError('etag must be a non-empty string');
  }

  // Strong ETag: /^"[^"]*"$/
  if (etag.startsWith('"')) {
    if (/^"[^"]*"$/.test(etag)) {
      const tag = etag.slice(1, etag.length - 1);
      return { weak: false, tag };
    }
    throw new SyntaxError(`Invalid ETag value: ${etag}`);
  }

  // Weak ETag: /^W\/"[^"]*"$/
  if (etag.startsWith('W/')) {
    const inner = etag.slice(2);
    if (/^"[^"]*"$/.test(inner)) {
      const tag = inner.slice(1, inner.length - 1);
      return { weak: true, tag };
    }
    throw new SyntaxError(`Invalid ETag value: ${etag}`);
  }

  throw new SyntaxError(`Invalid ETag value: ${etag}`);
}