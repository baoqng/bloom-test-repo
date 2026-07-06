// bloom-deps:

export function roundAmount(x: number): number {
  // Banker's rounding (round half to nearest even)
  const rounded = Math.round(x);
  
  // For exact halves, ensure we round to nearest even
  if (x - Math.floor(x) === 0.5) {
    const floor = Math.floor(x);
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  if (x - Math.floor(x) === -0.5) {
    const floor = Math.floor(x);
    return floor % 2 === 0 ? floor : floor - 1;
  }
  
  // Ensure we never return -0, always return +0
  return rounded === 0 ? 0 : rounded;
}