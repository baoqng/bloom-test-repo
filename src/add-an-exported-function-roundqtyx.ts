// bloom-deps:

export function roundQty(x: number): number {
  // Banker's rounding (round half to nearest even)
  const rounded = Math.round(x);
  const decimal = x - Math.floor(x);
  
  // If exactly halfway (0.5 or -0.5), round to nearest even
  if (Math.abs(decimal - 0.5) < 1e-10) {
    const floor = Math.floor(x);
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  if (Math.abs(decimal + 0.5) < 1e-10) {
    const floor = Math.floor(x);
    return floor % 2 === 0 ? floor : floor - 1;
  }
  
  return rounded;
}