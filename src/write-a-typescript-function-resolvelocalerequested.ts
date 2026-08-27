// bloom-deps:

function resolveLocale(requested: unknown, supported: unknown, fallback: unknown): string {
  if (typeof requested !== 'string') {
    throw new TypeError('requested must be a string');
  }
  if (!Array.isArray(supported)) {
    throw new TypeError('supported must be an array');
  }
  if (typeof fallback !== 'string') {
    throw new TypeError('fallback must be a string');
  }
  if (!requested.trim()) {
    throw new RangeError('requested must not be empty');
  }
  if (supported.length === 0) {
    throw new RangeError('supported must not be empty');
  }
  for (const item of supported) {
    if (typeof item !== 'string') {
      throw new TypeError('each supported locale must be a string');
    }
    if (!item.trim()) {
      throw new RangeError('each supported locale must not be empty');
    }
  }
  if (!fallback.trim()) {
    throw new RangeError('fallback must not be empty');
  }

  const normalizedFallback = fallback.toLowerCase().trim();
  const normalizedSupported = (supported as string[]).map(s => s.toLowerCase().trim());

  if (!normalizedSupported.includes(normalizedFallback)) {
    throw new RangeError('fallback must be in supported list');
  }

  const normalizedRequested = requested.toLowerCase().trim();

  // Exact match
  const exactIndex = normalizedSupported.indexOf(normalizedRequested);
  if (exactIndex !== -1) {
    return normalizedSupported[exactIndex];
  }

  // Language subtag match
  const languageSubtag = normalizedRequested.split('-')[0];
  const subtag = normalizedSupported.find(s => s.startsWith(languageSubtag));
  if (subtag !== undefined) {
    return subtag;
  }

  // Fallback
  return normalizedFallback;
}

export { resolveLocale };