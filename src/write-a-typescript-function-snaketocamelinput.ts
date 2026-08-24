// bloom-deps:

function snakeToCamel(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError(`input must be a string, received ${input === null ? 'null' : typeof input}`);
  }

  return input.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export { snakeToCamel };