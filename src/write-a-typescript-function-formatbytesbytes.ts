// bloom-deps:

export function formatBytes(bytes: number): string {
  if (typeof bytes !== 'number' || isNaN(bytes) || !isFinite(bytes)) {
    throw new TypeError('bytes must be a finite number');
  }

  if (!Number.isInteger(bytes) || bytes < 0) {
    if (bytes < 0) {
      throw new RangeError('bytes must be a non-negative integer');
    }
    throw new RangeError('bytes must be a non-negative integer');
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value = value / 1024;
    unitIndex++;
  }

  if (unitIndex === 0) {
    return `${value} B`;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}