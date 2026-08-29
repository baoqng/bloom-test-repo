// bloom-deps:

function parseFlatConfig(input: unknown): Record<string, string | number | boolean> {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const result: Record<string, string | number | boolean> = {};
  const lines = input.split('\n');

  for (const line of lines) {
    // Skip blank lines
    if (line.trim() === '') {
      continue;
    }

    // Skip comment lines
    if (line.trimStart().startsWith('#')) {
      continue;
    }

    // Validate and parse KEY=VALUE
    const keyValueMatch = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (!keyValueMatch) {
      throw new SyntaxError(`Invalid config line: ${line}`);
    }

    const key = keyValueMatch[1];
    const rawValue = keyValueMatch[2];
    const trimmedValue = rawValue.trim();

    // Coerce value
    let coercedValue: string | number | boolean;

    if (trimmedValue.toLowerCase() === 'true') {
      coercedValue = true;
    } else if (trimmedValue.toLowerCase() === 'false') {
      coercedValue = false;
    } else if (/^-?\d+(\.\d+)?$/.test(trimmedValue) || /^-?\.\d+$/.test(trimmedValue)) {
      coercedValue = Number(trimmedValue);
    } else {
      coercedValue = trimmedValue;
    }

    result[key] = coercedValue;
  }

  return result;
}

export { parseFlatConfig };