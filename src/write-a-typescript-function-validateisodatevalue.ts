// bloom-deps:

function validateISODate(value: unknown): string {
  // Type check: must be a string
  if (typeof value !== 'string') {
    throw new TypeError(`Expected string, got ${typeof value}`);
  }

  // Pattern check: must match YYYY-MM-DD format
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(value)) {
    throw new RangeError(`Date string does not match YYYY-MM-DD format: ${value}`);
  }

  // Parse components using integer arithmetic only
  const year = parseInt(value.substring(0, 4), 10);
  const month = parseInt(value.substring(5, 7), 10);
  const day = parseInt(value.substring(8, 10), 10);

  // Validate month range: 1-12
  if (month < 1 || month > 12) {
    throw new RangeError(`Month must be between 1 and 12, got ${month}`);
  }

  // Determine if leap year using integer arithmetic only
  const isLeapYear =
    (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  // Days in each month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust February for leap year
  if (isLeapYear) {
    daysInMonth[1] = 29;
  }

  // Get max days for the given month (month is 1-indexed, array is 0-indexed)
  const maxDaysForMonth = daysInMonth[month - 1];

  // Validate day range for the given month
  if (day < 1 || day > maxDaysForMonth) {
    throw new RangeError(
      `Day must be between 1 and ${maxDaysForMonth} for month ${month} in year ${year}, got ${day}`
    );
  }

  // All validations passed, return the value unchanged
  return value;
}

export { validateISODate };