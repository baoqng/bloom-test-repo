export function roundEvenB(x: number): number {
  const f = Math.floor(x);
  const d = x - f;
  let result: number;
  if (d < 0.5) result = f;
  else if (d > 0.5) result = f + 1;
  else result = f % 2 === 0 ? f : f + 1;
  return result === 0 ? 0 : result;
}