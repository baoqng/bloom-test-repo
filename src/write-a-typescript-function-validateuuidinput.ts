// bloom-deps:

function validateUuid(input: unknown): boolean {
  try {
    if (typeof input !== 'string') return false;
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(input);
  } catch {
    return false;
  }
}

export { validateUuid };