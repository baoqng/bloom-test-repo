// bloom-deps:

function safeDiv(a: number, b: number): number {
  if (typeof a !== 'number' || !isFinite(a)) {
    throw new TypeError(`Invalid input: a must be a finite number, got ${a}`);
  }
  if (typeof b !== 'number' || !isFinite(b)) {
    throw new TypeError(`Invalid input: b must be a finite number, got ${b}`);
  }
  if (b === 0) {
    throw new RangeError('Division by zero: b must not be zero');
  }
  return a / b;
}

export { safeDiv };