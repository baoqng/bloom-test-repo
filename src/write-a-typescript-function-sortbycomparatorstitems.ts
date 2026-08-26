// bloom-deps:

export function sortByComparators<T>(
  items: unknown,
  extractors: unknown,
  directions: unknown
): T[] {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  if (
    !Array.isArray(extractors) ||
    extractors.length === 0 ||
    extractors.some((e) => typeof e !== "function")
  ) {
    throw new TypeError("extractors must be a non-empty array of functions");
  }

  if (!Array.isArray(directions)) {
    throw new TypeError("directions must be an array");
  }

  if (directions.length !== extractors.length) {
    throw new RangeError("directions must have the same length as extractors");
  }

  for (let i = 0; i < directions.length; i++) {
    if (directions[i] !== "asc" && directions[i] !== "desc") {
      throw new SyntaxError(`Direction at index ${i} must be 'asc' or 'desc'`);
    }
  }

  const result = [...items] as T[];

  result.sort((a, b) => {
    for (let i = 0; i < extractors.length; i++) {
      const extractor = extractors[i] as (item: unknown) => unknown;
      const direction = directions[i] as "asc" | "desc";

      const aVal = extractor(a);
      const bVal = extractor(b);

      let cmp = 0;
      if (aVal < bVal) {
        cmp = -1;
      } else if (aVal > bVal) {
        cmp = 1;
      }

      if (cmp !== 0) {
        return direction === "desc" ? -cmp : cmp;
      }
    }
    return 0;
  });

  return result;
}