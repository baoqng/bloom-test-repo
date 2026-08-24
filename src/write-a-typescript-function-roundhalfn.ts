// bloom-deps:

function roundHalf(n: number): number {
  // Input validation
  if (typeof n !== 'number') {
    throw new TypeError(`Expected number, got ${typeof n}`);
  }

  if (!Number.isFinite(n)) {
    throw new Error('Input must be a finite number');
  }

  // Get the integer and fractional parts
  const floor = Math.floor(n);
  const fract = n - floor;

  // Not a tie: use standard rounding (nearest integer)
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(n);
  }

  // Tie case: half-to-even (banker's rounding)
  // For positive numbers: if floor is even, round down; if odd, round up
  // For negative numbers: if floor is even, round up (toward zero); if odd, round down (away from zero)
  if (fract === 0.5) {
    // Positive tie
    return floor % 2 === 0 ? floor : floor + 1;
  } else {
    // Negative tie (fract === -0.5)
    return floor % 2 === 0 ? floor : floor - 1;
  }
}

export { roundHalf };