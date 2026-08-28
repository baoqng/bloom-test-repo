// bloom-deps:

function validateHexColor(color: unknown): { hex: string; r: number; g: number; b: number; hasAlpha: boolean; a?: number } {
  if (typeof color !== 'string') {
    throw new TypeError('color must be a string');
  }

  if (color.trim() === '') {
    throw new RangeError('color must not be empty');
  }

  const trimmed = color.trim();

  if (!trimmed.startsWith('#')) {
    throw new RangeError("color must start with '#'");
  }

  const hex = trimmed.slice(1);

  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex)) {
    throw new RangeError('color must be a valid 3, 4, 6, or 8-character hex color');
  }

  let expanded: string;

  if (hex.length === 3) {
    expanded = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  } else if (hex.length === 4) {
    expanded = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  } else {
    expanded = hex;
  }

  const normalised = expanded.toLowerCase();

  const r = parseInt(normalised.slice(0, 2), 16);
  const g = parseInt(normalised.slice(2, 4), 16);
  const b = parseInt(normalised.slice(4, 6), 16);

  if (normalised.length === 8) {
    const aRaw = parseInt(normalised.slice(6, 8), 16);
    const a = Math.round((aRaw / 255) * 10000) / 10000;
    return {
      hex: '#' + normalised,
      r,
      g,
      b,
      hasAlpha: true,
      a,
    };
  } else {
    return {
      hex: '#' + normalised,
      r,
      g,
      b,
      hasAlpha: false,
    };
  }
}

export { validateHexColor };