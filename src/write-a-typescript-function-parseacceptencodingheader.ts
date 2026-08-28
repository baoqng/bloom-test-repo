function parseAcceptEncoding(header: unknown): Array<{ encoding: string; q: number }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header === '') {
    return [];
  }

  const results: Array<{ encoding: string; q: number; originalIndex: number }> = [];

  const entries = header.split(',');

  let hasNonEmptyEntry = false;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].trim();

    if (entry === '') {
      continue;
    }

    hasNonEmptyEntry = true;

    // Split on ';' using indexOf to handle first separator
    const semicolonIdx = entry.indexOf(';');

    let encodingToken: string;
    let paramsPart: string;

    if (semicolonIdx === -1) {
      encodingToken = entry.trim();
      paramsPart = '';
    } else {
      encodingToken = entry.slice(0, semicolonIdx).trim();
      paramsPart = entry.slice(semicolonIdx + 1);
    }

    // Validate encoding token
    if (encodingToken === '' || !/^[a-zA-Z0-9*-]+$/.test(encodingToken)) {
      throw new SyntaxError(`Invalid encoding token: '${encodingToken}'`);
    }

    let q = 1.0;

    // Parse parameters
    if (paramsPart !== '') {
      const params = paramsPart.split(';');
      for (let j = 0; j < params.length; j++) {
        const param = params[j].trim();

        // Use indexOf to split on first '=' only
        const eqIdx = param.indexOf('=');
        if (eqIdx === -1) {
          // No '=', skip unrecognized parameter
          continue;
        }

        const paramName = param.slice(0, eqIdx).trim();
        const paramValue = param.slice(eqIdx + 1).trim();

        if (paramName === 'q') {
          const parsed = parseFloat(paramValue);
          if (isNaN(parsed) || parsed < 0 || parsed > 1) {
            throw new SyntaxError(`Invalid q-value: '${paramValue}'`);
          }
          q = parsed;
        }
        // Ignore unrecognized parameters
      }
    }

    results.push({ encoding: encodingToken, q, originalIndex: i });
  }

  // If the header was non-empty but all entries were empty after trimming,
  // that means we had something like "," which implies empty encoding tokens
  if (!hasNonEmptyEntry) {
    throw new SyntaxError(`Invalid encoding token: ''`);
  }

  // Stable sort by q descending
  results.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    return a.originalIndex - b.originalIndex;
  });

  return results.map(({ encoding, q }) => ({ encoding, q }));
}

export { parseAcceptEncoding };