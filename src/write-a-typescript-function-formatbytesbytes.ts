// bloom-deps:

function formatBytes(bytes: number, decimals?: number): string {
  if (!Number.isInteger(bytes) || bytes < 0) {
    throw new TypeError('bytes must be a non-negative integer');
  }

  if (decimals !== undefined) {
    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new TypeError('decimals must be a non-negative integer');
    }
  }

  if (bytes === 0) {
    return '0 B';
  }

  const dm = decimals !== undefined ? decimals : 2;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, units.length - 1);
  const value = bytes / Math.pow(k, index);

  return `${value.toFixed(dm)} ${units[index]}`;
}

export { formatBytes };