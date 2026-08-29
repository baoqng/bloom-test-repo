// bloom-deps:

export function parseClientVersion(header: string): { name: string; version: string } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    throw new RangeError('Header must not be empty');
  }

  const slashIndex = header.indexOf('/');
  if (slashIndex === -1) {
    throw new RangeError('Missing slash separator');
  }

  const name = header.slice(0, slashIndex).trim();
  const version = header.slice(slashIndex + 1).trim();

  if (!name) {
    throw new RangeError('Client name must not be empty');
  }

  if (!version) {
    throw new RangeError('Client version must not be empty');
  }

  return { name, version };
}