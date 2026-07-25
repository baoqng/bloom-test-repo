// bloom-deps:

export function roundToIntV2(x: number): number {
  // Banker's rounding: round halves to the nearest even integer
  // Math.round() in JavaScript uses "round half away from zero"
  // We need to implement banker's rounding (round half to even)
  
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;
  
  // If not a half, use standard rounding
  if (fraction !== 0.5 && fraction !== -0.5) {
    return Math.round(x);
  }
  
  // For positive numbers at exactly .5
  if (fraction === 0.5) {
    // Round to nearest even
    return floor % 2 === 0 ? floor : ceil;
  }
  
  // For negative numbers at exactly -.5
  if (fraction === -0.5) {
    // Round to nearest even (ceil is the smaller absolute value for negatives)
    return ceil % 2 === 0 ? ceil : floor;
  }
  
  return Math.round(x);
}