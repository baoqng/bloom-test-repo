// bloom-deps:

function validateHexColor(color: unknown): { hex: string; r: number; g: number; b: number; hasAlpha: boolean; a?: number } {
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

  const hexPart = trimmed.substring(1);

  if (!/^[0-9a-fA-F]+$/.test(hexPart) || ![3, 4, 6, 8].includes(hexPart.length)) {
    throw new RangeError('color must be a valid 3, 4, 6, or 8-character hex color');
  }

  let expanded: string;

  if (hexPart.length === 3) {
    expanded = hexPart[0] + hexPart[0] + hexPart[1] + hexPart[1] + hexPart[2] + hexPart[2];
  } else if (hexPart.length === 4) {
    expanded = hexPart[0] + hexPart[0] + hexPart[1] + hexPart[1] + hexPart[2] + hexPart[2] + hexPart[3] + hexPart[3];
  } else {
    expanded = hexPart;
  }

  const normalized = expanded.toLowerCase();

  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);

  if (normalized.length === 8) {
    const aRaw = parseInt(normalized.substring(6, 8), 16);
    const a = Math.round((aRaw / 255) * 10000) / 10000;
    return {
      hex: '#' + normalized,
      r,
      g,
      b,
      hasAlpha: true,
      a,
    };
  } else {
    return {
      hex: '#' + normalized,
      r,
      g,
      b,
      hasAlpha: false,
    };
  }
}

export { validateHexColor };