// bloom-deps:

function validateRgbaColor(color: unknown): { r: number; g: number; b: number; a: number } {
  if (typeof color !== 'string') {
    throw new TypeError('color must be a string');
  }

  if (!color.trim()) {
    throw new RangeError('color must not be empty');
  }

  const trimmed = color.trim();

  if (!/^rgba\s*\(/i.test(trimmed) || !trimmed.endsWith(')')) {
    throw new RangeError('color must be in rgba() format');
  }

  const firstParen = trimmed.indexOf('(');
  const lastParen = trimmed.lastIndexOf(')');
  const content = trimmed.slice(firstParen + 1, lastParen);

  const parts = content.split(',');

  if (parts.length !== 4) {
    throw new RangeError('rgba() requires exactly 4 arguments');
  }

  const rStr = parts[0].trim();
  const gStr = parts[1].trim();
  const bStr = parts[2].trim();
  const aStr = parts[3].trim();

  const r = Number(rStr);
  if (!Number.isFinite(r) || !Number.isInteger(r) || r < 0 || r > 255) {
    throw new RangeError('red channel must be an integer between 0 and 255');
  }

  const g = Number(gStr);
  if (!Number.isFinite(g) || !Number.isInteger(g) || g < 0 || g > 255) {
    throw new RangeError('green channel must be an integer between 0 and 255');
  }

  const b = Number(bStr);
  if (!Number.isFinite(b) || !Number.isInteger(b) || b < 0 || b > 255) {
    throw new RangeError('blue channel must be an integer between 0 and 255');
  }

  const a = Number(aStr);
  if (!Number.isFinite(a) || a < 0 || a > 1) {
    throw new RangeError('alpha channel must be a number between 0 and 1');
  }

  return { r, g, b, a };
}

export { validateRgbaColor };