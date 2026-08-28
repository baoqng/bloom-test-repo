// bloom-deps:

function readEnvInt(name: string, min: number, max: number): number {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('min and max must be finite numbers');
  }

  if (min > max) {
    throw new TypeError('min must be less than or equal to max');
  }

  const raw = process.env[name];

  if (raw === undefined || raw === '') {
    throw new RangeError(`environment variable "${name}" is unset or empty`);
  }

  const parsed = parseInt(raw, 10);

  if (Number.isNaN(parsed)) {
    throw new RangeError(`environment variable "${name}" cannot be parsed as an integer: "${raw}"`);
  }

  if (parsed < min || parsed > max) {
    throw new RangeError(`environment variable "${name}" value ${parsed} is out of range [${min}, ${max}]`);
  }

  return parsed;
}

export { readEnvInt };