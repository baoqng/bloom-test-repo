// bloom-deps:

export function parseColor(input: string): { r: number; g: number; b: number; a: number } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  // Named colors
  const namedColors: Record<string, { r: number; g: number; b: number; a: number }> = {
    red:         { r: 255, g: 0,   b: 0,   a: 1 },
    blue:        { r: 0,   g: 0,   b: 255, a: 1 },
    green:       { r: 0,   g: 128, b: 0,   a: 1 },
    white:       { r: 255, g: 255, b: 255, a: 1 },
    black:       { r: 0,   g: 0,   b: 0,   a: 1 },
    transparent: { r: 0,   g: 0,   b: 0,   a: 0 },
  };

  const lowerTrimmed = trimmed.toLowerCase();
  if (lowerTrimmed in namedColors) {
    return { ...namedColors[lowerTrimmed] };
  }

  // Hex colors
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);

    if (hex.length === 3) {
      // #RGB
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        throw new SyntaxError(`Unrecognized color format: ${input}`);
      }
      return { r, g, b, a: 1 };
    }

    if (hex.length === 4) {
      // #RGBA
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      const a = parseInt(hex[3] + hex[3], 16) / 255;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
        throw new SyntaxError(`Unrecognized color format: ${input}`);
      }
      return { r, g, b, a };
    }

    if (hex.length === 6) {
      // #RRGGBB
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        throw new SyntaxError(`Unrecognized color format: ${input}`);
      }
      return { r, g, b, a: 1 };
    }

    if (hex.length === 8) {
      // #RRGGBBAA
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
        throw new SyntaxError(`Unrecognized color format: ${input}`);
      }
      return { r, g, b, a };
    }

    throw new SyntaxError(`Unrecognized color format: ${input}`);
  }

  // rgb(r, g, b)
  const rgbMatch = trimmed.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return { r, g, b, a: 1 };
  }

  // rgba(r, g, b, a)
  const rgbaMatch = trimmed.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9]*\.?[0-9]+)\s*\)$/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    const a = parseFloat(rgbaMatch[4]);
    return { r, g, b, a };
  }

  // hsl(h, s%, l%)
  const hslMatch = trimmed.match(/^hsl\(\s*([0-9]*\.?[0-9]+)\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*\)$/i);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;
    const { r, g, b } = hslToRgb(h, s, l);
    return { r, g, b, a: 1 };
  }

  throw new SyntaxError(`Unrecognized color format: ${input}`);
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  // Normalize hue to [0, 360)
  h = ((h % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r1 = 0, g1 = 0, b1 = 0;

  if (h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }

  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);

  return { r, g, b };
}