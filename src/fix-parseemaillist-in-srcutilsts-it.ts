// bloom-deps:

export function parseEmailList(input: unknown): string[] {
  if (input === null || input === undefined) {
    return [];
  }

  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const entries = input.split(',').map(entry => entry.trim()).filter(entry => entry.length > 0);

  const result: string[] = [];

  for (const entry of entries) {
    const atCount = entry.split('@').length - 1;

    if (atCount !== 1) {
      throw new TypeError('Invalid email format: ' + entry);
    }

    const parts = entry.split('@');
    const domain = parts[1];

    if (!domain.includes('.')) {
      throw new TypeError('Invalid email domain: ' + entry);
    }

    result.push(entry);
  }

  return result;
}