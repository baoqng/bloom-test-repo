// bloom-deps:

export function formatBytes(bytes: number): string {
  if (typeof bytes !== 'number' || isNaN(bytes) || !isFinite(bytes)) {
    throw new TypeError('bytes must be a non-negative finite number');
  }

  if (!Number.isInteger(bytes)) {
    throw new RangeError('bytes must be an integer');
  }

  if (bytes < 0) {
    throw new RangeError('bytes must be non-negative');
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const base = 1024;

  let unitIndex = 0;
  let value = bytes;

  while (value >= base && unitIndex < units.length - 1) {
    value = value / base;
    unitIndex++;
  }

  if (unitIndex === 0) {
    return `${bytes} B`;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}