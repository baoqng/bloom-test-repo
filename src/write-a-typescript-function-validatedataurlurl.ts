// bloom-deps:

export function validateDataUrl(url: unknown): { mediaType: string; isBase64: boolean; data: string } {
  if (typeof url !== "string") {
    throw new TypeError("url must be a string");
  }

  if (url.trim().length === 0) {
    throw new RangeError("url must not be empty");
  }

  // Only trim leading whitespace; trailing whitespace may be part of the data payload
  const trimmedUrl = url.replace(/^\s+/, '');

  if (!trimmedUrl.startsWith("data:")) {
    throw new RangeError("url must start with 'data:'");
  }

  const afterPrefix = trimmedUrl.slice("data:".length);

  const commaIndex = afterPrefix.indexOf(",");
  if (commaIndex === -1) {
    throw new RangeError("url must contain a comma separator");
  }

  const header = afterPrefix.slice(0, commaIndex);
  const dataPayload = afterPrefix.slice(commaIndex + 1);

  let mediaType: string;
  let isBase64: boolean;

  if (header === "") {
    mediaType = "text/plain;charset=US-ASCII";
    isBase64 = false;
  } else {
    const semicolonIndex = header.indexOf(";");
    if (semicolonIndex !== -1) {
      const lastSemicolonIndex = header.lastIndexOf(";");
      const afterLastSemicolon = header.slice(lastSemicolonIndex + 1);
      if (afterLastSemicolon !== "base64") {
        throw new RangeError("base64 flag must be exactly ';base64'");
      }
      isBase64 = true;
      mediaType = header.slice(0, lastSemicolonIndex);
      if (mediaType === "") {
        mediaType = "text/plain;charset=US-ASCII";
      }
    } else {
      mediaType = header;
      isBase64 = false;
    }
  }

  if (isBase64) {
    if (!/^[A-Za-z0-9+/=]*$/.test(dataPayload)) {
      throw new RangeError("base64 data contains invalid characters");
    }
  }

  return { mediaType, isBase64, data: dataPayload };
}