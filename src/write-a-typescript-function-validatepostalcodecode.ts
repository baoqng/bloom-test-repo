// bloom-deps:

export function validatePostalCode(code: unknown, countryCode: unknown): string {
  if (typeof code !== 'string') {
    throw new TypeError('code must be a string');
  }
  if (typeof countryCode !== 'string') {
    throw new TypeError('countryCode must be a string');
  }

  if (!code.trim()) {
    throw new RangeError('code must not be empty');
  }
  if (!countryCode.trim()) {
    throw new RangeError('countryCode must not be empty');
  }

  const normalizedCountry = countryCode.trim().toUpperCase();
  const normalizedCode = code.trim().replace(/\s+/g, '').toUpperCase();

  if (normalizedCountry === 'US') {
    if (!/^[0-9]{5}$/.test(normalizedCode) && !/^[0-9]{5}-[0-9]{4}$/.test(normalizedCode)) {
      throw new RangeError('invalid US postal code');
    }
  } else if (normalizedCountry === 'GB') {
    if (!/^[A-Z]{1,2}[0-9][A-Z0-9]?[0-9][A-Z]{2}$/.test(normalizedCode)) {
      throw new RangeError('invalid GB postal code');
    }
  } else if (normalizedCountry === 'CA') {
    if (!/^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/.test(normalizedCode)) {
      throw new RangeError('invalid CA postal code');
    }
  } else if (normalizedCountry === 'DE') {
    if (!/^[0-9]{5}$/.test(normalizedCode)) {
      throw new RangeError('invalid DE postal code');
    }
  } else {
    throw new RangeError(`unsupported country code: ${normalizedCountry}`);
  }

  return normalizedCode;
}