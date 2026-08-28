// bloom-deps:

export function parseContentDisposition(header: unknown): string {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    throw new RangeError('header must not be empty');
  }

  const trimmed = header.trim();

  // Split on first semicolon to get the disposition type
  const firstSemicolon = trimmed.indexOf(';');
  const dispositionType = firstSemicolon === -1
    ? trimmed
    : trimmed.slice(0, firstSemicolon);

  if (dispositionType.trim().toLowerCase() !== 'attachment') {
    throw new RangeError('header must be an attachment disposition');
  }

  if (firstSemicolon === -1) {
    throw new RangeError('filename parameter is required');
  }

  // Parse parameters after the disposition type
  const paramsString = trimmed.slice(firstSemicolon + 1);

  // Find filename parameter using indexOf to count and locate
  let filenameValue: string | null = null;

  // Split params by semicolons manually
  let remaining = paramsString;
  while (remaining.length > 0) {
    const nextSemi = remaining.indexOf(';');
    let param: string;
    if (nextSemi === -1) {
      param = remaining;
      remaining = '';
    } else {
      param = remaining.slice(0, nextSemi);
      remaining = remaining.slice(nextSemi + 1);
    }

    param = param.trim();
    if (!param) continue;

    // Split param on first '='
    const eqIdx = param.indexOf('=');
    if (eqIdx === -1) continue;

    const paramName = param.slice(0, eqIdx).trim().toLowerCase();
    const paramValue = param.slice(eqIdx + 1);

    if (paramName === 'filename') {
      filenameValue = paramValue;
      break;
    }
  }

  if (filenameValue === null) {
    throw new RangeError('filename parameter is required');
  }

  // Strip surrounding double quotes if both are present
  let filename = filenameValue;
  if (filename.length >= 2 && filename[0] === '"' && filename[filename.length - 1] === '"') {
    filename = filename.slice(1, filename.length - 1);
  }

  // Trim surrounding whitespace
  filename = filename.trim();

  if (!filename) {
    throw new RangeError('filename must not be empty');
  }

  return filename;
}