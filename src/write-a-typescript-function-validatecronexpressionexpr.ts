// bloom-deps:

function validateCronExpression(expr: unknown): void {
  if (typeof expr !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof expr}`);
  }

  const fields = expr.trim().split(/\s+/);

  if (fields.length !== 5) {
    throw new SyntaxError(
      `Invalid cron expression: expected 5 fields, got ${fields.length}`
    );
  }

  const fieldNames = ['minute', 'hour', 'day', 'month', 'weekday'];
  const ranges: Array<[number, number]> = [
    [0, 59],
    [0, 23],
    [1, 31],
    [1, 12],
    [0, 6],
  ];

  for (let i = 0; i < 5; i++) {
    const field = fields[i];
    const name = fieldNames[i];
    const [min, max] = ranges[i];

    if (field === '*') {
      continue;
    }

    if (!/^[0-9]+$/.test(field)) {
      throw new SyntaxError(
        `Invalid cron expression: field "${name}" contains non-numeric characters "${field}"`
      );
    }

    const value = parseInt(field, 10);

    if (value < min || value > max) {
      throw new RangeError(
        `cron field ${name}: value ${value} is out of range [${min}, ${max}]`
      );
    }
  }
}

export { validateCronExpression };