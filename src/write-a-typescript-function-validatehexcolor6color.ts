// bloom-deps:

export function validateHexColor6(color: unknown): { r: number; g: number; b: number; hex: string } {
  if (typeof color !== 'string') {
    throw new TypeError('color must be a string');
  }

  if (color.trim().length === 0) {
    throw new RangeError('color must not be empty');
  }

  const trimmed = color.trim();

  if (!trimmed.startsWith('#')) {
    throw new RangeError("color must start with '#'");
  }

  if (trimmed.length !== 7) {
    throw new RangeError("color must be exactly 7 characters including '#'");
  }

  const hexPart = trimmed.slice(1);
  if (!/^[0-9a-fA-F]{6}$/.test(hexPart)) {
    throw new RangeError("color must contain only hexadecimal characters after '#'");
  }

  const r = parseInt(trimmed.slice(1, 3), 16);
  const g = parseInt(trimmed.slice(3, 5), 16);
  const b = parseInt(trimmed.slice(5, 7), 16);

  return { r, g, b, hex: '#' + trimmed.slice(1).toLowerCase() };
}