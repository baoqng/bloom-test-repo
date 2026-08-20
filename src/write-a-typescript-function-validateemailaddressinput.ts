// bloom-deps:

function validateEmailAddress(input: unknown): boolean {
  try {
    if (typeof input !== 'string') return false;
    if (/\s/.test(input)) return false;
    if (/\x00/.test(input)) return false;
    if (input.startsWith('@') || input.endsWith('@')) return false;

    const atCount = (input.match(/@/g) || []).length;
    if (atCount !== 1) return false;

    const atIndex = input.indexOf('@');
    const localPart = input.substring(0, atIndex);
    const domainPart = input.substring(atIndex + 1);

    if (localPart.length === 0) return false;
    if (domainPart.length === 0) return false;
    if (!domainPart.includes('.')) return false;

    return true;
  } catch {
    return false;
  }
}

export { validateEmailAddress };