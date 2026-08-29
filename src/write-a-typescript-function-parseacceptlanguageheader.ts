// bloom-deps:

export function parseAcceptLanguage(header: unknown): Array<{ tag: string; q: number }> {
  // Type check: header must be a string
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  // Empty or blank input returns empty array
  const trimmedHeader = header.trim();
  if (trimmedHeader.length === 0) {
    return [];
  }

  // Split on commas
  const entries = trimmedHeader.split(',');
  
  const parsed: Array<{ tag: string; q: number; originalIndex: number }> = [];
  let hasValidEntry = false;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].trim();
    
    // Skip empty segments after trim
    if (entry.length === 0) {
      continue;
    }

    hasValidEntry = true;

    // Find semicolon to split tag from quality parameter
    const semicolonIndex = entry.indexOf(';');
    let tag: string;
    let q: number = 1.0;

    if (semicolonIndex === -1) {
      // No quality parameter, use default
      tag = entry.trim();
    } else {
      // Extract tag and quality parts
      tag = entry.slice(0, semicolonIndex).trim();
      const qualityPart = entry.slice(semicolonIndex + 1).trim();

      // Parse quality parameter
      if (qualityPart.startsWith('q=') || qualityPart.startsWith('Q=')) {
        const qValue = qualityPart.slice(2).trim();
        const qNum = parseFloat(qValue);

        // Validate quality factor
        if (isNaN(qNum) || qNum < 0 || qNum > 1) {
          throw new SyntaxError('Invalid quality factor');
        }

        q = qNum;
      } else {
        // Quality parameter without q= prefix is invalid
        throw new SyntaxError('Invalid quality factor');
      }
    }

    // Preserve language tag as-is (case preservation)
    // Allow wildcard '*' and regular language tags
    parsed.push({
      tag,
      q,
      originalIndex: i
    });
  }

  // Guard: ensure at least one valid entry was processed
  if (!hasValidEntry) {
    return [];
  }

  // Sort by quality descending, preserve original order for equal quality
  parsed.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    return a.originalIndex - b.originalIndex;
  });

  // Return result without originalIndex
  return parsed.map(({ tag, q }) => ({ tag, q }));
}