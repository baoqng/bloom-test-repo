// bloom-deps:

export function parseAcceptEncoding(header: unknown): Array<{ encoding: string; q: number }> {
  if (typeof header !== 'string') {
    throw new TypeError(`Expected header to be a string, got ${typeof header}`);
  }

  if (header.trim() === '') {
    return [];
  }

  const entries = header.split(',');
  const result: Array<{ encoding: string; q: number; originalIndex: number }> = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].trim();
    if (entry === '') {
      throw new SyntaxError(`Invalid encoding token: ''`);
    }

    const parts = entry.split(';');
    const token = parts[0].trim();

    if (token === '' || !/^[a-zA-Z0-9*-]+$/.test(token)) {
      throw new SyntaxError(`Invalid encoding token: '${token}'`);
    }

    let q = 1.0;

    for (let j = 1; j < parts.length; j++) {
      const param = parts[j].trim();
      if (param.startsWith('q=') || param.startsWith('Q=')) {
        const raw = param.slice(2);
        const parsed = parseFloat(raw);
        if (isNaN(parsed) || parsed < 0 || parsed > 1) {
          throw new SyntaxError(`Invalid q-value: '${raw}'`);
        }
        // Ensure it's a valid float representation
        if (!/^[0-9]*\.?[0-9]+$/.test(raw) && !/^[0-9]+$/.test(raw)) {
          throw new SyntaxError(`Invalid q-value: '${raw}'`);
        }
        q = parsed;
      }
      // Unrecognized parameters are ignored
    }

    result.push({ encoding: token, q, originalIndex: i });
  }

  // Stable sort by q descending
  result.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    return a.originalIndex - b.originalIndex;
  });

  return result.map(({ encoding, q }) => ({ encoding, q }));
}