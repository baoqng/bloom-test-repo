// bloom-deps:

function safeDiv(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both inputs must be numbers');
  }

  // Check for non-finite numbers (NaN, Infinity, -Infinity)
  if (!Number.isFinite(a)) {
    throw new TypeError('First argument must be a finite number');
  }

  if (!Number.isFinite(b)) {
    throw new TypeError('Second argument must be a finite number');
  }

  // Check for division by zero
  if (b === 0) {
    throw new RangeError('Cannot divide by zero');
  }

  return a / b;
}

export { safeDiv };