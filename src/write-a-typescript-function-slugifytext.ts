// bloom-deps:

export function slugify(text: string): string {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}