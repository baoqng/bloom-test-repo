// bloom-deps:

export function parseHexColor(value: unknown): { r: number; g: number; b: number; a: number } {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (!value.startsWith('#')) {
    throw new SyntaxError("Hex color must start with '#'");
  }

  const hex = value.slice(1);

  if (![3, 4, 6, 8].includes(hex.length)) {
    throw new SyntaxError('Hex color must be 3, 4, 6, or 8 digits');
  }

  if (!/^[0-9A-Fa-f]+$/.test(hex)) {
    throw new SyntaxError('Hex color contains invalid characters');
  }

  let expanded: string;

  if (hex.length === 3) {
    expanded = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  } else if (hex.length === 4) {
    expanded = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  } else {
    expanded = hex;
  }

  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  const a = expanded.length === 8 ? parseInt(expanded.slice(6, 8), 16) : 255;

  return { r, g, b, a };
}