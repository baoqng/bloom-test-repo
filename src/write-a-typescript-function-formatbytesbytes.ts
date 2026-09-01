// bloom-deps:

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unitIndex = Math.min(i, units.length - 1);

  const value = bytes / Math.pow(k, unitIndex);
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}