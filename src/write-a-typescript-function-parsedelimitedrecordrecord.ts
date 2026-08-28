// bloom-deps:

function parseDelimitedRecord(record: unknown, fields: unknown): Record<string, string> {
  if (typeof record !== 'string') {
    throw new TypeError('record must be a string');
  }

  if (!Array.isArray(fields)) {
    throw new TypeError('fields must be an array');
  }

  if (fields.length === 0) {
    throw new RangeError('fields must not be empty');
  }

  const trimmedFieldNames: string[] = [];
  for (const field of fields) {
    if (typeof field !== 'string' || field.trim() === '') {
      throw new RangeError('each field name must be a non-empty string');
    }
    trimmedFieldNames.push(field.trim());
  }

  const seen = new Set<string>();
  for (const name of trimmedFieldNames) {
    if (seen.has(name)) {
      throw new RangeError('field names must be unique');
    }
    seen.add(name);
  }

  // Count pipe-separated parts using indexOf+slice
  const parts: string[] = [];
  let remaining = record;
  let idx = remaining.indexOf('|');
  while (idx !== -1) {
    parts.push(remaining.slice(0, idx));
    remaining = remaining.slice(idx + 1);
    idx = remaining.indexOf('|');
  }
  parts.push(remaining);

  if (parts.length !== trimmedFieldNames.length) {
    throw new RangeError('record has wrong number of fields');
  }

  const result: Record<string, string> = {};
  for (let i = 0; i < trimmedFieldNames.length; i++) {
    result[trimmedFieldNames[i]] = parts[i].trim();
  }

  return result;
}

export { parseDelimitedRecord };