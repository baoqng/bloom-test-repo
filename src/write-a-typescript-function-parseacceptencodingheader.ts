// bloom-deps:

export function parseAcceptEncoding(header: unknown): Array<{ encoding: string; q: number }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    return [];
  }

  const parts = header.split(',');
  const results: Array<{ encoding: string; q: number; index: number }> = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) {
      continue;
    }

    // Count semicolons to find q parameter
    const semicolonIndex = part.indexOf(';');

    let encodingRaw: string;
    let q = 1.0;

    if (semicolonIndex !== -1) {
      encodingRaw = part.slice(0, semicolonIndex).trim();
      const paramPart = part.slice(semicolonIndex + 1).trim();

      // Parse q parameter
      const eqIndex = paramPart.indexOf('=');
      if (eqIndex !== -1) {
        const paramName = paramPart.slice(0, eqIndex).trim().toLowerCase();
        const paramValue = paramPart.slice(eqIndex + 1).trim();

        if (paramName === 'q') {
          const qNum = Number(paramValue);
          if (
            !paramValue ||
            isNaN(qNum) ||
            qNum < 0 ||
            qNum > 1 ||
            !/^\d+(\.\d+)?$/.test(paramValue)
          ) {
            throw new SyntaxError('Invalid q value');
          }
          q = qNum;
        }
      } else {
        // Has semicolon but no '=' — still treat q as default
        // If it looks like a q param with no value, throw
        const paramName = paramPart.trim().toLowerCase();
        if (paramName === 'q') {
          throw new SyntaxError('Invalid q value');
        }
      }
    } else {
      encodingRaw = part;
    }

    const encoding = encodingRaw!.trim().toLowerCase();
    if (!encoding) {
      continue;
    }

    results.push({ encoding, q, index: i });
  }

  // Stable sort by q descending, preserving original order for equal q
  results.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    return a.index - b.index;
  });

  return results.map(({ encoding, q }) => ({ encoding, q }));
}