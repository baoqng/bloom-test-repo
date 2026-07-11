export function wTieUpR8(x: number): number {
  if (!isFinite(x)) return x;
  const r = Math.round(x);
  // Check if exactly at a .5 tie
  if (Math.abs(x - r) === 0.5) {
    // We are at a tie; round to even
    const f = Math.floor(x);
    const c = Math.ceil(x);
    // Pick whichever of floor/ceil is even
    if (f % 2 === 0) return f;
    return c;
  }
  return r;
}