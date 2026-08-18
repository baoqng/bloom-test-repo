// bloom-deps:

export function safeDiv(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both inputs must be numbers');
  }
  if (!isFinite(a)) {
    throw new TypeError(`Input a must be a finite number, got ${a}`);
  }
  if (!isFinite(b)) {
    throw new TypeError(`Input b must be a finite number, got ${b}`);
  }
  if (b === 0) {
    throw new RangeError('Division by zero is not allowed');
  }
  return a / b;
}