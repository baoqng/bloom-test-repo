// bloom-deps:

export function validateColorRgb(color: unknown): { r: number; g: number; b: number } {
  if (typeof color !== "string") {
    throw new TypeError("color must be a string");
  }

  if (!color.trim()) {
    throw new RangeError("color must not be empty");
  }

  const trimmed = color.trim();

  if (!(/^rgb\s*\(/i.test(trimmed)) || !trimmed.endsWith(")")) {
    throw new RangeError("color must be in rgb() format");
  }

  const firstParen = trimmed.indexOf("(");
  const lastParen = trimmed.lastIndexOf(")");
  const inner = trimmed.substring(firstParen + 1, lastParen);

  const parts = inner.split(",");

  if (parts.length !== 3) {
    throw new RangeError("rgb() requires exactly 3 arguments");
  }

  const [rawR, rawG, rawB] = parts;

  const rStr = rawR.trim();
  const gStr = rawG.trim();
  const bStr = rawB.trim();

  const r = Number(rStr);
  if (!Number.isFinite(r) || !Number.isInteger(r) || r < 0 || r > 255) {
    throw new RangeError("red channel must be an integer between 0 and 255");
  }

  const g = Number(gStr);
  if (!Number.isFinite(g) || !Number.isInteger(g) || g < 0 || g > 255) {
    throw new RangeError("green channel must be an integer between 0 and 255");
  }

  const b = Number(bStr);
  if (!Number.isFinite(b) || !Number.isInteger(b) || b < 0 || b > 255) {
    throw new RangeError("blue channel must be an integer between 0 and 255");
  }

  return { r, g, b };
}