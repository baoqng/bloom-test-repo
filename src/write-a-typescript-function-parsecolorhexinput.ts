// bloom-deps:

function parseColorHex(input: unknown): { r: number; g: number; b: number; a: number } {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  if (input[0] !== '#' || ![4, 5, 7, 9].includes(input.length)) {
    throw new SyntaxError('Not a valid hex color');
  }

  const hexPart = input.slice(1);

  if (!/^[0-9A-Fa-f]+$/.test(hexPart)) {
    throw new SyntaxError('Hex color contains invalid characters');
  }

  let r: number, g: number, b: number, a: number;

  if (hexPart.length === 3) {
    // #RGB
    r = parseInt(hexPart[0] + hexPart[0], 16);
    g = parseInt(hexPart[1] + hexPart[1], 16);
    b = parseInt(hexPart[2] + hexPart[2], 16);
    a = 255;
  } else if (hexPart.length === 4) {
    // #RGBA
    r = parseInt(hexPart[0] + hexPart[0], 16);
    g = parseInt(hexPart[1] + hexPart[1], 16);
    b = parseInt(hexPart[2] + hexPart[2], 16);
    a = parseInt(hexPart[3] + hexPart[3], 16);
  } else if (hexPart.length === 6) {
    // #RRGGBB
    r = parseInt(hexPart.slice(0, 2), 16);
    g = parseInt(hexPart.slice(2, 4), 16);
    b = parseInt(hexPart.slice(4, 6), 16);
    a = 255;
  } else {
    // #RRGGBBAA
    r = parseInt(hexPart.slice(0, 2), 16);
    g = parseInt(hexPart.slice(2, 4), 16);
    b = parseInt(hexPart.slice(4, 6), 16);
    a = parseInt(hexPart.slice(6, 8), 16);
  }

  return { r, g, b, a };
}

export { parseColorHex };