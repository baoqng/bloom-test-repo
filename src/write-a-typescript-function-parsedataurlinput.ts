// bloom-deps:

function parseDataUrl(input: unknown): { mediaType: string; encoding: string | null; data: string } {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  if (!input.startsWith('data:')) {
    throw new SyntaxError('Not a valid data URL');
  }

  const rest = input.slice('data:'.length);

  const commaIndex = rest.indexOf(',');
  if (commaIndex === -1) {
    throw new SyntaxError('Data URL is missing comma separator');
  }

  const meta = rest.slice(0, commaIndex);
  const data = rest.slice(commaIndex + 1);

  let mediaType: string;
  let encoding: string | null = null;

  const base64Suffix = ';base64';

  if (meta === '' || meta === base64Suffix) {
    // media type is absent
    mediaType = 'text/plain;charset=US-ASCII';
    if (meta === base64Suffix) {
      encoding = 'base64';
    }
  } else if (meta.endsWith(base64Suffix)) {
    encoding = 'base64';
    mediaType = meta.slice(0, meta.length - base64Suffix.length);
  } else {
    // Check for unsupported encoding: a semicolon followed by something other than base64
    // The encoding would be specified as the last ;xxx segment
    const lastSemicolon = meta.lastIndexOf(';');
    if (lastSemicolon !== -1) {
      const potentialEncoding = meta.slice(lastSemicolon);
      // If this looks like an encoding specifier (starts with ';' and doesn't contain '=')
      // we treat it as an unsupported encoding
      // Parameters in media type look like ;key=value, encodings look like ;word (no '=')
      if (!potentialEncoding.includes('=')) {
        throw new RangeError('Unsupported data URL encoding');
      }
    }
    mediaType = meta;
  }

  return { mediaType, encoding, data };
}

export { parseDataUrl };