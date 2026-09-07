// bloom-deps:

export function sleep(ms: number): Promise<void> {
  if (ms < 0) {
    throw new RangeError('ms must be non-negative');
  }
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}