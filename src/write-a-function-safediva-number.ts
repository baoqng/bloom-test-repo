// bloom-deps:

export function safeDiv(a: number, b: number): number {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Both inputs must be numbers");
  }

  if (!isFinite(a)) {
    throw new TypeError(`Invalid input: a is not a finite number (${a})`);
  }

  if (!isFinite(b)) {
    throw new TypeError(`Invalid input: b is not a finite number (${b})`);
  }

  if (b === 0) {
    throw new RangeError("Division by zero: b must not be zero");
  }

  return a / b;
}