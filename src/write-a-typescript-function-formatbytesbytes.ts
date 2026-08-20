// bloom-deps:

function formatBytes(bytes: unknown, decimals?: number): string {
  if (
    typeof bytes !== 'number' ||
    !Number.isFinite(bytes) ||
    !Number.isInteger(bytes) ||
    bytes < 0
  ) {
    throw new TypeError('bytes must be a non-negative finite integer');
  }

  if (decimals !== undefined) {
    if (
      typeof decimals !== 'number' ||
      !Number.isFinite(decimals) ||
      !Number.isInteger(decimals) ||
      decimals < 0
    ) {
      throw new RangeError('decimals must be a non-negative integer');
    }
  }

  const dec = decimals !== undefined ? decimals : 1;

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, units.length - 1);

  const value = bytes / Math.pow(k, index);
  const formatted = value.toFixed(dec);

  return `${formatted} ${units[index]}`;
}

export { formatBytes };