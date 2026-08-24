// bloom-deps:

function formatDuration(ms: unknown): string {
  // Input validation: check if ms is a finite number
  if (typeof ms !== 'number' || !Number.isFinite(ms)) {
    throw new TypeError('ms must be a finite number');
  }

  // Range validation: check if ms is negative
  if (ms < 0) {
    throw new RangeError('ms must be non-negative');
  }

  // Case 1: 0–999ms → 'Nms'
  if (ms < 1000) {
    return `${Math.floor(ms)}ms`;
  }

  // Case 2: 1000–59999ms → 'Ns'
  if (ms < 60000) {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  }

  // Case 3: 60000–3599999ms → 'Nm Ns' or 'Nm'
  if (ms < 3600000) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (seconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  }

  // Case 4: 3600000+ → 'Nh Nm' or 'Nh'
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);

  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

export { formatDuration };