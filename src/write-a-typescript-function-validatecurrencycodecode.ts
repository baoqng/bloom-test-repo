// bloom-deps:

function validateCurrencyCode(code: unknown): string {
  // Step 1: Type validation
  if (typeof code !== 'string') {
    throw new TypeError('code must be a string');
  }

  // Step 2: Empty/whitespace validation
  if (!code.trim()) {
    throw new RangeError('code must not be empty');
  }

  // Derive trimmed value once
  const trimmed = code.trim();

  // Step 3: Length bounds validation
  if (trimmed.length !== 3) {
    throw new RangeError('code must be exactly 3 characters');
  }

  // Step 4: Content/character-set validation
  for (const char of trimmed) {
    const charCode = char.charCodeAt(0);
    // Check if character is ASCII letter (a-z: 97-122 or A-Z: 65-90)
    if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
      throw new RangeError('code must contain only ASCII letters');
    }
  }

  // Return uppercased trimmed string
  return trimmed.toUpperCase();
}

export { validateCurrencyCode };