// bloom-deps:

export function formatRelativeTime(date: unknown, now?: unknown): string {
  // Validate date
  let dateMs: number;
  if (date instanceof Date) {
    dateMs = date.getTime();
  } else if (typeof date === 'number' && Number.isFinite(date)) {
    dateMs = date;
  } else {
    throw new TypeError('date must be a Date or finite number');
  }

  // Validate now
  let nowMs: number;
  if (now === undefined) {
    nowMs = Date.now();
  } else if (now instanceof Date) {
    nowMs = now.getTime();
  } else if (typeof now === 'number' && Number.isFinite(now)) {
    nowMs = now;
  } else {
    throw new TypeError('now must be a Date or finite number');
  }

  const diffMs = nowMs - dateMs;
  const absDiffMs = Math.abs(diffMs);

  let label: string;

  if (absDiffMs < 5000) {
    return 'just now';
  } else if (absDiffMs < 60000) {
    const n = Math.floor(absDiffMs / 1000);
    label = `${n} seconds`;
  } else if (absDiffMs < 3600000) {
    const n = Math.floor(absDiffMs / 60000);
    label = `${n} minutes`;
  } else if (absDiffMs < 86400000) {
    const n = Math.floor(absDiffMs / 3600000);
    label = `${n} hours`;
  } else if (absDiffMs < 2592000000) {
    const n = Math.floor(absDiffMs / 86400000);
    label = `${n} days`;
  } else if (absDiffMs < 31536000000) {
    const n = Math.floor(absDiffMs / 2592000000);
    label = `${n} months`;
  } else {
    const n = Math.floor(absDiffMs / 31536000000);
    label = `${n} years`;
  }

  if (diffMs < 0) {
    return `in ${label}`;
  } else {
    return `${label} ago`;
  }
}