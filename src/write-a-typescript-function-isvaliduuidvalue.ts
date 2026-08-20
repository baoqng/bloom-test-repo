// bloom-deps:

export function isValidUUID(value: unknown): boolean {
  if (typeof value !== 'string' || value.length === 0) return false;

  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  return uuidV4Regex.test(value);
}