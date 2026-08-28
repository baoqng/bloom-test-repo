// bloom-deps:

function formatFileSize(bytes: unknown): string {
  if (typeof bytes !== 'number') {
    throw new TypeError('bytes must be a number');
  }
  if (!Number.isFinite(bytes)) {
    throw new TypeError('bytes must be finite');
  }
  if (bytes < 0) {
    throw new RangeError('bytes must be non-negative');
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const threshold = 1024;

  if (bytes < threshold) {
    return `${Math.floor(bytes)} B`;
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= threshold && unitIndex < units.length - 1) {
    value = value / threshold;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export { formatFileSize };