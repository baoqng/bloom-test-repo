// bloom-deps:

function formatRelativeTime(ms: unknown): string {
  // Validate input type and finiteness
  if (typeof ms !== 'number' || !Number.isFinite(ms)) {
    throw new TypeError('Duration must be a finite number');
  }

  // Check for negative zero using Object.is
  if (Object.is(ms, -0) || ms < 0) {
    throw new RangeError('Duration must be non-negative');
  }

  // Return "just now" for durations less than 1 second
  if (ms < 1000) {
    return 'just now';
  }

  // Define time unit thresholds and divisors
  const units = [
    { threshold: 60000, divisor: 1000, singular: 'second', plural: 'seconds' },
    {
      threshold: 3600000,
      divisor: 60000,
      singular: 'minute',
      plural: 'minutes',
    },
    {
      threshold: 86400000,
      divisor: 3600000,
      singular: 'hour',
      plural: 'hours',
    },
    { threshold: Infinity, divisor: 86400000, singular: 'day', plural: 'days' },
  ];

  // Find the appropriate unit and compute count
  for (const unit of units) {
    if (ms < unit.threshold) {
      const count = Math.floor(ms / unit.divisor);
      const unitLabel = count === 1 ? unit.singular : unit.plural;
      return `${count} ${unitLabel} ago`;
    }
  }

  // This should never be reached, but satisfy TypeScript
  return 'just now';
}

export { formatRelativeTime };