// bloom-deps:

export interface DataUri {
  mediaType: string;
  isBase64: boolean;
  data: string;
}

export function parseDataUri(uri: unknown): DataUri {
  if (typeof uri !== 'string') {
    throw new TypeError('uri must be a string');
  }

  if (!uri.startsWith('data:')) {
    throw new SyntaxError('uri must start with "data:"');
  }

  const withoutScheme = uri.slice('data:'.length);

  const commaIndex = withoutScheme.indexOf(',');
  if (commaIndex === -1) {
    throw new SyntaxError('uri is missing the comma separator');
  }

  const metaPart = withoutScheme.slice(0, commaIndex);
  const dataPart = withoutScheme.slice(commaIndex + 1);

  const isBase64 = metaPart.endsWith(';base64');
  const mediaType = isBase64 ? metaPart.slice(0, metaPart.length - ';base64'.length) : metaPart;

  return {
    mediaType,
    isBase64,
    data: dataPart,
  };
}