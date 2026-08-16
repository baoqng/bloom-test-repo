// bloom-deps:

function snakeToCamel(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string but received ${typeof input}`);
  }

  return input.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}

export { snakeToCamel };