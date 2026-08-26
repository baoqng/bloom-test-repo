// bloom-deps:

export function validateColorRgb(color: unknown): { r: number; g: number; b: number } {
  if (typeof color !== "string") {
    throw new TypeError("color must be a string");
  }

  if (!color.trim()) {
    throw new RangeError("color must not be empty");
  }

  const trimmed = color.trim();

  if (!/^rgb\s*\(/i.test(trimmed) || !trimmed.endsWith(")")) {
    throw new RangeError("color must be in rgb() format");
  }

  const firstParen = trimmed.indexOf("(");
  const lastParen = trimmed.lastIndexOf(")");
  const content = trimmed.substring(firstParen + 1, lastParen);

  const parts = content.split(",");

  if (parts.length !== 3) {
    throw new RangeError("rgb() requires exactly 3 arguments");
  }

  const isValidChannel = (val: string): boolean => {
    const trimmedVal = val.trim();
    const num = Number(trimmedVal);
    return Number.isFinite(num) && Number.isInteger(num) && num >= 0 && num <= 255;
  };

  if (!isValidChannel(parts[0])) {
    throw new RangeError("red channel must be an integer between 0 and 255");
  }

  if (!isValidChannel(parts[1])) {
    throw new RangeError("green channel must be an integer between 0 and 255");
  }

  if (!isValidChannel(parts[2])) {
    throw new RangeError("blue channel must be an integer between 0 and 255");
  }

  return {
    r: Number(parts[0].trim()),
    g: Number(parts[1].trim()),
    b: Number(parts[2].trim()),
  };
}