// bloom-deps:

function formatDurationSeconds(seconds: unknown): string {
  if (typeof seconds !== 'number' || !isFinite(seconds)) {
    throw new TypeError('seconds must be a finite number');
  }
  if (seconds < 0) {
    throw new RangeError('seconds must be non-negative');
  }

  const totalSeconds = Math.floor(seconds);

  if (totalSeconds === 0) {
    return '0s';
  }

  if (totalSeconds >= 86400) {
    const d = Math.floor(totalSeconds / 86400);
    const remaining = totalSeconds % 86400;
    const h = Math.floor(remaining / 3600);
    const remaining2 = remaining % 3600;
    const m = Math.floor(remaining2 / 60);
    const s = remaining2 % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  if (totalSeconds >= 3600) {
    const h = Math.floor(totalSeconds / 3600);
    const remaining = totalSeconds % 3600;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${h}h ${m}m ${s}s`;
  }

  if (totalSeconds >= 60) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  }

  return `${totalSeconds}s`;
}

export { formatDurationSeconds };