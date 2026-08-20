// bloom-deps:

function formatBytes(bytes: number, decimals?: number): string {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes)) {
    throw new TypeError('bytes must be a finite number');
  }

  if (bytes < 0) {
    throw new RangeError('bytes must be non-negative');
  }

  if (bytes === 0) {
    return '0 Bytes';
  }

  const dec = decimals === undefined ? 2 : decimals;

  if (typeof dec !== 'number' || !Number.isFinite(dec) || dec < 0) {
    throw new RangeError('decimals must be a non-negative finite number');
  }

  const d = Math.floor(dec);

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, units.length - 1);

  const value = bytes / Math.pow(k, index);

  return `${parseFloat(value.toFixed(d))} ${units[index]}`;
}

export { formatBytes };