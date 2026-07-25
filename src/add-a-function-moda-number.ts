// bloom-deps:

export function mod(a: number, n: number): number {
  if (n === 0) {
    throw new Error('Division by zero: modulo by 0');
  }
  
  const result = a % n;
  
  // Python-style floored modulo: result takes sign of divisor
  // If result is 0, return 0 (works for both positive and negative n)
  // If result and n have different signs, adjust result
  if (result !== 0 && (result < 0) !== (n < 0)) {
    return result + n;
  }
  
  return result;
}