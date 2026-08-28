// bloom-deps:

export function buildRetryHeader(retryAfter: unknown, unit: unknown): string {
  if (
    typeof retryAfter !== 'number' ||
    !Number.isInteger(retryAfter) ||
    retryAfter <= 0
  ) {
    throw new TypeError('retryAfter must be a positive integer');
  }

  if (unit !== 'seconds' && unit !== 'date') {
    throw new TypeError("unit must be 'seconds' or 'date'");
  }

  if (unit === 'seconds') {
    return String(retryAfter);
  }

  // unit === 'date'
  const date = new Date(retryAfter);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayName = days[date.getUTCDay()];
  const dayNum = String(date.getUTCDate()).padStart(2, '0');
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${dayName}, ${dayNum} ${monthName} ${year} ${hours}:${minutes}:${seconds} GMT`;
}