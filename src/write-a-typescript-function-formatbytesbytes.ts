// bloom-deps:

function formatBytes(bytes: number, decimals: number = 2): string {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes)) {
    throw new TypeError('bytes must be a finite number');
  }

  if (bytes < 0) {
    throw new TypeError('bytes must be a non-negative number');
  }

  if (bytes === 0) {
    return '0 B';
  }

  if (typeof decimals !== 'number' || !Number.isFinite(decimals) || decimals < 0) {
    throw new TypeError('decimals must be a non-negative finite number');
  }

  const d = Math.floor(decimals);

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, units.length - 1);

  const value = bytes / Math.pow(k, index);

  return `${value.toFixed(d)} ${units[index]}`;
}

export { formatBytes };