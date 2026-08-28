// bloom-deps:

function validateCronExpression(expr: unknown): void {
  if (typeof expr !== 'string') {
    throw new TypeError('expr must be a string');
  }

  const fields = expr.trim().split(/\s+/);

  if (fields.length !== 5) {
    throw new SyntaxError(`Invalid cron expression: expected 5 fields, got ${fields.length}`);
  }

  const fieldDefs = [
    { name: 'minute', min: 0, max: 59 },
    { name: 'hour', min: 0, max: 23 },
    { name: 'day', min: 1, max: 31 },
    { name: 'month', min: 1, max: 12 },
    { name: 'weekday', min: 0, max: 6 },
  ];

  for (let i = 0; i < 5; i++) {
    const field = fields[i];
    const def = fieldDefs[i];

    if (field === '*') {
      continue;
    }

    if (/[^0-9]/.test(field)) {
      throw new SyntaxError(`Invalid cron expression: field ${def.name} contains non-numeric characters`);
    }

    const value = parseInt(field, 10);

    if (value < def.min || value > def.max) {
      throw new RangeError(`cron field ${def.name}: value ${value} is out of range [${def.min}, ${def.max}]`);
    }
  }
}

export { validateCronExpression };