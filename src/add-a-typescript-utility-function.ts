// bloom-deps:

export function formatPath(path: Array<string | number>): string {
  if (path.length === 0) return '';
  return path.map((segment) => String(segment)).join('.');
}