// bloom-deps:

export interface SearchQueryResult {
  terms: string[];
  filters: Array<{ field: string; value: string }>;
  raw: string;
}

export function parseSearchQuery(
  input: unknown,
  allowedFields: string[]
): SearchQueryResult {
  // Validate input is a string
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  // Validate allowedFields is a non-empty array of strings
  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((field) => typeof field === 'string')
  ) {
    throw new TypeError('allowedFields must be a non-empty array of strings');
  }

  // Trim input
  const trimmedInput = input.trim();

  // Handle empty input
  if (trimmedInput.length === 0) {
    return { terms: [], filters: [], raw: '' };
  }

  // Normalize allowedFields to lowercase for case-insensitive matching
  const normalizedFields = new Set(allowedFields.map((f) => f.toLowerCase()));

  // Split on whitespace (consecutive whitespace treated as one separator)
  const tokens = trimmedInput.split(/\s+/);

  const terms: string[] = [];
  const filters: Array<{ field: string; value: string }> = [];

  // Process each token
  for (const token of tokens) {
    // Match field:value pattern
    const match = token.match(/^(\w+):(.+)$/);

    if (match) {
      const fieldName = match[1];
      const fieldValue = match[2];
      const normalizedFieldName = fieldName.toLowerCase();

      if (normalizedFields.has(normalizedFieldName)) {
        // Field is in allowedFields, add to filters
        filters.push({
          field: normalizedFieldName,
          value: fieldValue,
        });
      } else {
        // Field not in allowedFields, add token verbatim to terms
        terms.push(token);
      }
    } else {
      // Token doesn't match pattern, add to terms
      terms.push(token);
    }
  }

  return {
    terms,
    filters,
    raw: trimmedInput,
  };
}