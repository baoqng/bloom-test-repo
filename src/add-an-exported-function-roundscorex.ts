// bloom-deps:

function bankersRound(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;
  if (diff === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  const rounded = Math.round(x);
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function roundScore(x: number): number {
  return bankersRound(x);
}