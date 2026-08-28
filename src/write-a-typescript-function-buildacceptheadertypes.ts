// bloom-deps:

function buildAcceptHeader(types: unknown): string {
  if (!Array.isArray(types)) {
    throw new TypeError('types must be an array');
  }
  if (types.length === 0) {
    throw new RangeError('types must not be empty');
  }

  interface Entry {
    type: string;
    q: number | undefined;
  }

  const entries: Entry[] = [];

  for (const element of types) {
    if (element === null || typeof element !== 'object' || Array.isArray(element)) {
      throw new TypeError('each entry must be an object');
    }

    const obj = element as Record<string, unknown>;

    if (typeof obj['type'] !== 'string') {
      throw new TypeError('type must be a string');
    }

    const trimmedType = (obj['type'] as string).trim();

    if (trimmedType.length === 0) {
      throw new RangeError('type must not be empty');
    }

    if (!trimmedType.includes('/')) {
      throw new RangeError('type must contain a slash');
    }

    let qValue: number | undefined = undefined;

    if ('q' in obj) {
      const q = obj['q'];
      if (typeof q !== 'number') {
        throw new TypeError('q must be a number');
      }
      if (!Number.isFinite(q) || q < 0 || q > 1) {
        throw new RangeError('q must be between 0 and 1');
      }
      const rounded = Math.round(q * 1000) / 1000;
      qValue = rounded;
    }

    entries.push({ type: trimmedType, q: qValue });
  }

  // Sort by descending q value (undefined q counts as 1)
  const getQ = (e: Entry): number => (e.q === undefined ? 1 : e.q);

  entries.sort((a, b) => getQ(b) - getQ(a));

  const parts: string[] = entries.map((entry) => {
    const effectiveQ = entry.q === undefined ? 1 : entry.q;
    if (entry.q === undefined || effectiveQ === 1) {
      return entry.type;
    }

    // Format q value: up to 3 decimal places, trim trailing zeros but keep at least one decimal digit
    let qStr = effectiveQ.toFixed(3);
    // Trim trailing zeros after decimal point but keep at least one decimal digit
    // e.g. "0.900" -> "0.9", "0.500" -> "0.5", "0.123" -> "0.123"
    qStr = qStr.replace(/(\.\d*?)0+$/, '$1');
    // Ensure at least one decimal digit after the dot
    if (qStr.endsWith('.')) {
      qStr = qStr + '0';
    }

    return `${entry.type};q=${qStr}`;
  });

  return parts.join(', ');
}

export { buildAcceptHeader };