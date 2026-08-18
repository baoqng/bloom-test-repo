// bloom-deps:

export function slugify(text: string): string {
  if (typeof text !== 'string') {
    throw new TypeError(`text must be a string`);
  }

  return text
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}