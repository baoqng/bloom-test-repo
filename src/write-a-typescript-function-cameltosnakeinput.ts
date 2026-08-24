// bloom-deps:

function camelToSnake(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError(`Input must be a string, received: ${typeof input}`);
  }

  return input
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

export { camelToSnake };