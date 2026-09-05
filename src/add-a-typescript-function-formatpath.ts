// bloom-deps:

export function formatPath(segments: (string | number)[]): string {
  if (segments.length === 0) return "";
  return segments.join(".");
}