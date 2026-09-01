// bloom-deps:

export function resolveContentType(mimeType: unknown): string {
  if (typeof mimeType !== 'string') {
    throw new TypeError('mimeType must be a string');
  }
  if (mimeType.trim().length === 0) {
    throw new TypeError('mimeType must not be empty');
  }
  const semicolonIndex = mimeType.indexOf(';');
  const bare = semicolonIndex !== -1 ? mimeType.slice(0, semicolonIndex) : mimeType;
  return bare.trim().toLowerCase();
}