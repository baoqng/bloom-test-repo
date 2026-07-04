export function roundScoreV2(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;
  
  let result: number;
  if (frac < 0.5) {
    result = floor;
  } else if (frac > 0.5) {
    result = floor + 1;
  } else {
    // Exactly 0.5: round to nearest even
    result = floor % 2 === 0 ? floor : floor + 1;
  }
  
  // Convert -0 to +0
  return result === 0 ? 0 : result;
}