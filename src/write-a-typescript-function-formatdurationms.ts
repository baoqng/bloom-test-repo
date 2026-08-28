// bloom-deps:

export function formatDuration(ms: unknown): string {
  if (
    typeof ms !== 'number' ||
    !Number.isFinite(ms) ||
    ms < 0
  ) {
    throw new TypeError('ms must be a non-negative finite number');
  }

  const totalMs = Math.floor(ms);

  if (totalMs === 0) {
    return '0ms';
  }

  if (totalMs < 1000) {
    return `${totalMs}ms`;
  }

  if (totalMs < 60000) {
    const totalSeconds = totalMs / 1000;
    const floored = Math.floor(totalSeconds * 10) / 10;
    const decimal = Math.round((floored - Math.floor(floored)) * 10);
    if (decimal === 0) {
      return `${Math.floor(floored)}s`;
    } else {
      return `${floored.toFixed(1)}s`;
    }
  }

  if (totalMs < 3600000) {
    const totalSeconds = Math.floor(totalMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (seconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }

  // >= 3600000
  const totalSeconds = Math.floor(totalMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}