// bloom-deps:

export function formatRelativeTime(ms: unknown): string {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) {
    throw new TypeError('ms must be a finite number');
  }

  if (Object.is(ms, -0) || ms < 0) {
    throw new RangeError('Duration must be non-negative');
  }

  if (ms < 1000) {
    return 'just now';
  }

  if (ms < 60000) {
    const count = Math.floor(ms / 1000);
    return count === 1 ? '1 second ago' : `${count} seconds ago`;
  }

  if (ms < 3600000) {
    const count = Math.floor(ms / 60000);
    return count === 1 ? '1 minute ago' : `${count} minutes ago`;
  }

  if (ms < 86400000) {
    const count = Math.floor(ms / 3600000);
    return count === 1 ? '1 hour ago' : `${count} hours ago`;
  }

  const count = Math.floor(ms / 86400000);
  return count === 1 ? '1 day ago' : `${count} days ago`;
}