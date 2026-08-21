// bloom-deps:

export function formatDurationSeconds(seconds: unknown): string {
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

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}