// bloom-deps:

export function validateDateRange(
  startDate: unknown,
  endDate: unknown
): { startDate: Date; endDate: Date; daysBetween: number } {
  if (startDate === null || startDate === undefined) {
    throw new TypeError('startDate is required');
  }
  if (endDate === null || endDate === undefined) {
    throw new TypeError('endDate is required');
  }
  if (!(startDate instanceof Date)) {
    throw new TypeError('startDate must be a Date');
  }
  if (!(endDate instanceof Date)) {
    throw new TypeError('endDate must be a Date');
  }
  if (isNaN(startDate.getTime())) {
    throw new TypeError('startDate is not a valid date');
  }
  if (isNaN(endDate.getTime())) {
    throw new TypeError('endDate is not a valid date');
  }
  if (startDate.getTime() > endDate.getTime()) {
    throw new RangeError('startDate must be before or equal to endDate');
  }
  const daysBetween = Math.floor(
    (endDate.getTime() - startDate.getTime()) / 86400000
  );
  return { startDate, endDate, daysBetween };
}