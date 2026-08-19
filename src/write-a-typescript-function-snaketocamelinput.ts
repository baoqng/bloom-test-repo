// bloom-deps:

function snakeToCamel(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0) {
    if (typeof input !== 'string') {
      throw new TypeError(`Expected a string, got ${typeof input}`);
    }
    if (input.length === 0) {
      return '';
    }
  }

  return input.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export { snakeToCamel };