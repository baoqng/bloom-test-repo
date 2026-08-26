// bloom-deps:

export function validateDataUrl(url: unknown): { mediaType: string; isBase64: boolean; data: string } {
  if (typeof url !== 'string') {
    throw new TypeError('url must be a string');
  }

  if (!url.trim()) {
    throw new RangeError('url must not be empty');
  }

  const trimmed = url.replace(/^\s+/, '').replace(/\s+$/, '');

  if (!trimmed.startsWith('data:')) {
    throw new RangeError("url must start with 'data:'");
  }

  const afterPrefix = trimmed.slice('data:'.length);

  const commaIndex = afterPrefix.indexOf(',');
  if (commaIndex === -1) {
    throw new RangeError('url must contain a comma separator');
  }

  const header = afterPrefix.slice(0, commaIndex);
  const data = afterPrefix.slice(commaIndex + 1);

  let mediaType: string;
  let isBase64: boolean;

  if (header === '') {
    mediaType = 'text/plain;charset=US-ASCII';
    isBase64 = false;
  } else {
    // Check if header contains a semicolon
    const lastSemicolon = header.lastIndexOf(';');
    if (lastSemicolon !== -1) {
      const afterLastSemicolon = header.slice(lastSemicolon + 1);
      if (afterLastSemicolon !== 'base64') {
        throw new RangeError("base64 flag must be exactly ';base64'");
      }
      isBase64 = true;
      mediaType = header.slice(0, lastSemicolon);
      // If mediaType is empty (header was ';base64'), default media type
      if (mediaType === '') {
        mediaType = 'text/plain;charset=US-ASCII';
      }
    } else {
      isBase64 = false;
      mediaType = header;
    }
  }

  if (isBase64) {
    if (!/^[A-Za-z0-9+/=]*$/.test(data)) {
      throw new RangeError('base64 data contains invalid characters');
    }
  }

  return { mediaType, isBase64, data };
}