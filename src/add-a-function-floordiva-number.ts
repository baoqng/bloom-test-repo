// bloom-deps:

export function floorDiv(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  
  const quotient = a / b;
  return Math.floor(quotient);
}