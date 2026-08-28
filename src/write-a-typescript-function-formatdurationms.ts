// bloom-deps:

export function formatDuration(ms: unknown): string {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) {
    throw new TypeError('ms must be a finite number');
  }
  if (ms < 0) {
    throw new RangeError('ms must not be negative');
  }

  const totalMs = Math.floor(ms);

  if (totalMs >= 3600000) {
    const hours = Math.floor(totalMs / 3600000);
    const remainingMs = totalMs % 3600000;
    const minutes = Math.floor(remainingMs / 60000);
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  }

  if (totalMs >= 60000) {
    const minutes = Math.floor(totalMs / 60000);
    const remainingMs = totalMs % 60000;
    const seconds = Math.floor(remainingMs / 1000);
    if (seconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  }

  if (totalMs >= 1000) {
    const seconds = Math.floor(totalMs / 1000);
    return `${seconds}s`;
  }

  return `${totalMs}ms`;
}