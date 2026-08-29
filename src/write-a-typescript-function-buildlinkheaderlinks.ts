// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildLinkHeader(links: unknown): string {
  if (!Array.isArray(links) || links.length === 0) {
    throw new TypeError('links must be a non-empty array');
  }

  const parts: string[] = [];

  for (const link of links) {
    if (!isPlainObject(link)) {
      throw new TypeError('Each link must have a non-empty url and rel');
    }

    const obj = link as Record<string, unknown>;
    const url = obj['url'];
    const rel = obj['rel'];

    if (
      typeof url !== 'string' ||
      url.length === 0 ||
      typeof rel !== 'string' ||
      rel.length === 0
    ) {
      throw new TypeError('Each link must have a non-empty url and rel');
    }

    if (url.indexOf('<') !== -1 || url.indexOf('>') !== -1) {
      throw new RangeError('Link URL must not contain angle brackets');
    }

    let part = `<${url}>; rel="${rel}"`;

    const title = obj['title'];
    if (title !== undefined) {
      if (typeof title === 'string') {
        part += `; title="${title}"`;
      }
    }

    parts.push(part);
  }

  return parts.join(', ');
}