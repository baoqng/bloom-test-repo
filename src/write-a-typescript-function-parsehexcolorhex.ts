// bloom-deps:

export function parseHexColor(hex: string): { r: number; g: number; b: number } {
  if (typeof hex !== 'string' || hex.length === 0) {
    throw new TypeError(`Invalid hex color: ${hex}`);
  }

  const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
  if (!hexColorRegex.test(hex)) {
    throw new TypeError(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
}