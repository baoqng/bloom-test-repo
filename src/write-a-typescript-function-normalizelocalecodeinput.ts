// bloom-deps:

function normalizeLocaleCode(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const pattern = /^([A-Za-z]{2})(?:[_-]([A-Za-z]{2}))?$/;
  const match = input.match(pattern);

  if (!match) {
    throw new SyntaxError('Not a valid BCP 47 locale code');
  }

  const language = match[1].toLowerCase();
  const region = match[2] ? match[2].toUpperCase() : undefined;

  const supportedLanguages = new Set(['en', 'fr', 'de', 'es', 'pt', 'ja', 'zh', 'ko', 'ar']);
  if (!supportedLanguages.has(language)) {
    throw new RangeError('Locale code is not supported');
  }

  if (region) {
    return `${language}-${region}`;
  }

  return language;
}

export { normalizeLocaleCode };