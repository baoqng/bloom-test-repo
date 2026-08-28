// bloom-deps:

export function parseAcceptCharset(header: unknown): Array<{ charset: string; q: number }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    return [];
  }

  const entries: Array<{ charset: string; q: number }> = [];

  const parts = header.split(',');

  for (const part of parts) {
    const trimmedPart = part.trim();

    const semicolonIndex = trimmedPart.indexOf(';');

    let charsetName: string;
    let qValue: number = 1.0;

    if (semicolonIndex === -1) {
      charsetName = trimmedPart.toLowerCase();
    } else {
      charsetName = trimmedPart.slice(0, semicolonIndex).trim().toLowerCase();
      const qPart = trimmedPart.slice(semicolonIndex + 1).trim();

      if (qPart.startsWith('q=')) {
        const qStr = qPart.slice(2);
        const parsed = parseFloat(qStr);

        if (isNaN(parsed)) {
          throw new RangeError(`q value is not a number: ${qStr}`);
        }

        if (parsed < 0 || parsed > 1) {
          throw new RangeError(`q value out of range [0, 1]: ${parsed}`);
        }

        qValue = parsed;
      }
    }

    if (!charsetName) {
      throw new RangeError('charset name must not be empty after trimming');
    }

    entries.push({ charset: charsetName, q: qValue });
  }

  entries.sort((a, b) => b.q - a.q);

  return entries;
}