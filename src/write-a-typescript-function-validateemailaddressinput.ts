// bloom-deps:

export function validateEmailAddress(input: unknown): { local: string; domain: string } {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Count '@' occurrences using indexOf+slice, not split
  let atCount = 0;
  let atIndex = -1;
  let searchFrom = 0;
  while (true) {
    const idx = input.indexOf('@', searchFrom);
    if (idx === -1) break;
    atCount++;
    atIndex = idx;
    searchFrom = idx + 1;
  }

  if (atCount !== 1) {
    throw new SyntaxError('Not a valid email address');
  }

  const local = input.slice(0, atIndex);
  const domain = input.slice(atIndex + 1);

  if (local.length === 0) {
    throw new SyntaxError('Local part must not be empty');
  }

  if (domain.length === 0) {
    throw new SyntaxError('Domain must not be empty');
  }

  // Validate local part characters: alphanumeric, dot, hyphen, underscore, plus
  if (/[^A-Za-z0-9.\-_+]/.test(local)) {
    throw new SyntaxError('Local part contains invalid characters');
  }

  if (domain.indexOf('.') === -1) {
    throw new SyntaxError('Domain must have at least one dot');
  }

  // Validate domain labels
  const labels = domain.split('.');
  let anyValidLabel = false;
  for (const label of labels) {
    if (label.length === 0) {
      throw new SyntaxError('Domain labels must not be empty');
    }
    // Check hyphens inside the label loop (per-label validation)
    // (hyphens are allowed in domain labels; no restriction stated beyond empty check)
    anyValidLabel = true;
  }

  if (!anyValidLabel) {
    throw new SyntaxError('Domain labels must not be empty');
  }

  return {
    local: local.toLowerCase(),
    domain: domain.toLowerCase(),
  };
}