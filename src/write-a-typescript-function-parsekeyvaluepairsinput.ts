// bloom-deps:

export function parseKeyValuePairs(
  input: unknown,
  pairSep: unknown,
  kvSep: unknown
): Record<string, string> {
  // Validate input is a string
  if (typeof input !== "string") {
    throw new TypeError("input must be a string");
  }

  // Validate pairSep is a non-empty string
  if (typeof pairSep !== "string" || pairSep.length === 0) {
    throw new TypeError("pairSep must be a non-empty string");
  }

  // Validate kvSep is a non-empty string
  if (typeof kvSep !== "string" || kvSep.length === 0) {
    throw new TypeError("kvSep must be a non-empty string");
  }

  // Validate that pairSep and kvSep are different
  if (pairSep === kvSep) {
    throw new RangeError("pairSep and kvSep must be different");
  }

  const result: Record<string, string> = {};

  // Split input on pairSep
  const pairs = input.split(pairSep);

  let hasValidPair = false;

  for (const pair of pairs) {
    // Skip empty pairs
    if (pair.length === 0) {
      continue;
    }

    hasValidPair = true;

    // Find the first occurrence of kvSep
    const kvSepIndex = pair.indexOf(kvSep);

    // Throw if kvSep is not found in non-empty pair
    if (kvSepIndex === -1) {
      throw new SyntaxError(`Pair missing separator: ${pair}`);
    }

    // Split on the first occurrence of kvSep only
    const key = pair.slice(0, kvSepIndex).trim();
    const value = pair.slice(kvSepIndex + kvSep.length).trim();

    // Store the key-value pair (later duplicates overwrite earlier ones)
    result[key] = value;
  }

  return result;
}