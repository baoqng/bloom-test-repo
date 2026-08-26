// bloom-deps:

export function validateColorHsl(color: unknown): { h: number; s: number; l: number; a: number } {
  if (typeof color !== "string") {
    throw new TypeError("color must be a string");
  }

  if (color.trim().length === 0) {
    throw new RangeError("color must not be empty");
  }

  const trimmed = color.trim();

  if (!/^hsla?\(/i.test(trimmed)) {
    throw new RangeError("color must be in hsl() or hsla() format");
  }

  if (!trimmed.endsWith(")")) {
    throw new RangeError("color must be in hsl() or hsla() format");
  }

  const isHsla = /^hsla\(/i.test(trimmed);

  const inner = trimmed.slice(trimmed.indexOf("(") + 1, trimmed.lastIndexOf(")"));

  const parts = inner.split(",");

  if (!isHsla && parts.length !== 3) {
    throw new RangeError("hsl() requires exactly 3 arguments");
  }

  if (isHsla && parts.length !== 4) {
    throw new RangeError("hsla() requires exactly 4 arguments");
  }

  const huePart = parts[0].trim();
  const h = parseFloat(huePart);
  if (!isFinite(h) || h < 0 || h > 360) {
    throw new RangeError("hue must be a number between 0 and 360");
  }

  const satPart = parts[1].trim();
  if (!satPart.endsWith("%")) {
    throw new RangeError("saturation must be a percentage between 0% and 100%");
  }
  const s = parseFloat(satPart.slice(0, -1));
  if (!isFinite(s) || s < 0 || s > 100) {
    throw new RangeError("saturation must be a percentage between 0% and 100%");
  }

  const lightPart = parts[2].trim();
  if (!lightPart.endsWith("%")) {
    throw new RangeError("lightness must be a percentage between 0% and 100%");
  }
  const l = parseFloat(lightPart.slice(0, -1));
  if (!isFinite(l) || l < 0 || l > 100) {
    throw new RangeError("lightness must be a percentage between 0% and 100%");
  }

  let a = 1;
  if (isHsla) {
    const alphaPart = parts[3].trim();
    a = parseFloat(alphaPart);
    if (!isFinite(a) || a < 0 || a > 1) {
      throw new RangeError("alpha must be between 0 and 1");
    }
  }

  return { h, s, l, a };
}