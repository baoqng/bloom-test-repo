// bloom-deps:

function formatBytes(bytes: number, decimals: number = 2): string {
  if (typeof bytes !== 'number' || !isFinite(bytes)) {
    throw new TypeError('bytes must be a finite number');
  }
  if (bytes < 0) {
    throw new RangeError('bytes must be non-negative');
  }

  if (typeof decimals !== 'number' || !isFinite(decimals)) {
    throw new TypeError('decimals must be a finite number');
  }

  const clampedDecimals = Math.max(0, Math.floor(decimals));

  if (bytes === 0) {
    return '0 Bytes';
  }

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, units.length - 1);

  const value = bytes / Math.pow(k, index);

  return `${parseFloat(value.toFixed(clampedDecimals))} ${units[index]}`;
}

export { formatBytes };