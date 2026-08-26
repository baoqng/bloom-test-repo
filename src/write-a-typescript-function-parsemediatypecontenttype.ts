// bloom-deps:

export function parseMediaType(contentType: unknown): { type: string; subtype: string; parameters: Record<string, string> } {
  if (typeof contentType !== 'string') {
    throw new TypeError('contentType must be a string');
  }

  const trimmed = contentType.trim();

  if (trimmed.length === 0) {
    throw new RangeError('contentType must not be empty');
  }

  const semicolonIndex = trimmed.indexOf(';');
  const mediaTypePortion = semicolonIndex === -1 ? trimmed : trimmed.slice(0, semicolonIndex);
  const parameterPortion = semicolonIndex === -1 ? '' : trimmed.slice(semicolonIndex + 1);

  const mediaTypeTrimmed = mediaTypePortion.trim();
  const slashCount = (mediaTypeTrimmed.match(/\//g) || []).length;

  if (slashCount !== 1) {
    throw new RangeError('invalid media type format');
  }

  const slashIndex = mediaTypeTrimmed.indexOf('/');
  const type = mediaTypeTrimmed.slice(0, slashIndex).trim().toLowerCase();
  const subtype = mediaTypeTrimmed.slice(slashIndex + 1).trim().toLowerCase();

  if (type.length === 0) {
    throw new RangeError('type must not be empty');
  }

  if (subtype.length === 0) {
    throw new RangeError('subtype must not be empty');
  }

  const parameters: Record<string, string> = {};

  if (parameterPortion.length > 0) {
    const tokens = parameterPortion.split(';');
    for (const token of tokens) {
      const trimmedToken = token.trim();
      if (trimmedToken.length === 0) {
        continue;
      }
      if (!trimmedToken.includes('=')) {
        throw new RangeError(`invalid parameter: ${trimmedToken}`);
      }
      const eqIndex = trimmedToken.indexOf('=');
      const key = trimmedToken.slice(0, eqIndex).trim().toLowerCase();
      let value = trimmedToken.slice(eqIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
        value = value.slice(1, -1);
      }
      parameters[key] = value;
    }
  }

  return { type, subtype, parameters };
}