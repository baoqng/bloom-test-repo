// bloom-deps:

export function parseScheduleExpression(value: unknown): {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
} {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new SyntaxError('Expression must not be empty');
  }

  const tokens = trimmed.split(/\s+/).filter(t => t.length > 0);
  if (tokens.length !== 5) {
    throw new SyntaxError('Expression must have exactly 5 fields');
  }

  const fieldNames = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'] as const;
  const validPattern = /^[0-9,\-/*]+$/;

  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i];
    const fieldValue = tokens[i];
    if (!validPattern.test(fieldValue)) {
      throw new SyntaxError(`Invalid character in ${fieldName} field: '${fieldValue}'`);
    }
  }

  return {
    minute: tokens[0],
    hour: tokens[1],
    dayOfMonth: tokens[2],
    month: tokens[3],
    dayOfWeek: tokens[4],
  };
}