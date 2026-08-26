// bloom-deps:

export function validateTemporalDate(date: unknown): { year: number; month: number; day: number } {
  if (typeof date !== 'string') {
    throw new TypeError('date must be a string');
  }

  if (!date.trim()) {
    throw new RangeError('date must not be empty');
  }

  const trimmed = date.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new RangeError('date must be in YYYY-MM-DD format');
  }

  const parts = trimmed.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (year < 1 || year > 9999) {
    throw new RangeError('year must be between 1 and 9999');
  }

  if (month < 1 || month > 12) {
    throw new RangeError('month must be between 1 and 12');
  }

  const isLeapYear = (y: number): boolean =>
    (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  const thirtyOneDayMonths = [1, 3, 5, 7, 8, 10, 12];
  let maxDay: number;

  if (thirtyOneDayMonths.includes(month)) {
    maxDay = 31;
  } else if (month === 2) {
    maxDay = isLeapYear(year) ? 29 : 28;
  } else {
    maxDay = 30;
  }

  if (day < 1 || day > maxDay) {
    throw new RangeError(`day must be between 1 and ${maxDay}`);
  }

  return { year, month, day };
}