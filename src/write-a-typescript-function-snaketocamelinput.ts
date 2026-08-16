// bloom-deps:

export function snakeToCamel(input: unknown): string {
  if (typeof input !== "string") {
    throw new TypeError(`Expected a string but received ${typeof input}`);
  }

  return input.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}