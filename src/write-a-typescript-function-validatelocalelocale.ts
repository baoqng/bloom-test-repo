// bloom-deps:

export function validateLocale(locale: unknown): string {
  if (typeof locale !== "string") {
    throw new TypeError("locale must be a string");
  }

  if (locale.trim().length === 0) {
    throw new RangeError("locale must not be empty");
  }

  const trimmed = locale.trim();
  const subtags = trimmed.split(/[-_]/);

  if (subtags.length > 5) {
    throw new RangeError("locale has too many subtags");
  }

  const language = subtags[0];
  if (!/^[a-zA-Z]{2,3}$/.test(language)) {
    throw new RangeError("invalid language subtag");
  }

  for (let i = 1; i < subtags.length; i++) {
    if (!/^[a-zA-Z0-9]+$/.test(subtags[i])) {
      throw new RangeError("invalid locale format");
    }
  }

  const normalizedSubtags: string[] = [];
  normalizedSubtags.push(language.toLowerCase());

  let scriptCount = 0;
  let regionCount = 0;

  for (let i = 1; i < subtags.length; i++) {
    const subtag = subtags[i];

    if (/^[a-zA-Z]{4}$/.test(subtag)) {
      // Script subtag: exactly 4 ASCII letters
      scriptCount++;
      const normalized =
        subtag.charAt(0).toUpperCase() + subtag.slice(1).toLowerCase();
      normalizedSubtags.push(normalized);
    } else if (/^[a-zA-Z]{2}$/.test(subtag)) {
      // Region subtag: exactly 2 ASCII letters
      regionCount++;
      normalizedSubtags.push(subtag.toUpperCase());
    } else if (/^[0-9]{3}$/.test(subtag)) {
      // Region subtag: exactly 3 digits
      regionCount++;
      normalizedSubtags.push(subtag);
    } else {
      // Additional unvalidated subtag
      normalizedSubtags.push(subtag);
    }
  }

  return normalizedSubtags.join("-");
}