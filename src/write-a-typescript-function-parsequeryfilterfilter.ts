// bloom-deps:

type FilterOperator = '=' | '!=' | '>=' | '<=' | '>' | '<';

interface FilterEntry {
  field: string;
  operator: FilterOperator;
  value: string;
}

const OPERATORS_IN_ORDER: FilterOperator[] = ['>=', '<=', '!=', '>', '<', '='];

export function parseQueryFilter(filter: unknown): Array<FilterEntry> {
  if (typeof filter !== 'string') {
    throw new TypeError('filter must be a string');
  }

  const trimmedFilter = filter.trim();
  if (trimmedFilter.length === 0) {
    throw new RangeError('filter must not be empty');
  }

  const tokens = trimmedFilter.split(',');

  const results: FilterEntry[] = [];
  let anyProcessed = false;

  for (let i = 0; i < tokens.length; i++) {
    const rawToken = tokens[i];
    const token = rawToken.trim();

    if (token.length === 0) {
      continue;
    }

    anyProcessed = true;

    // Find operator using indexOf for each operator in longest-first order
    let detectedOperator: FilterOperator | null = null;
    let operatorIndex = -1;

    for (let j = 0; j < OPERATORS_IN_ORDER.length; j++) {
      const op = OPERATORS_IN_ORDER[j];
      const idx = token.indexOf(op);
      if (idx !== -1) {
        detectedOperator = op;
        operatorIndex = idx;
        break;
      }
    }

    if (detectedOperator === null || operatorIndex === -1) {
      throw new RangeError('filter token has no operator');
    }

    const fieldPart = token.slice(0, operatorIndex);
    const valuePart = token.slice(operatorIndex + detectedOperator.length);

    const field = fieldPart.trim();
    const value = valuePart.trim();

    if (field.length === 0) {
      throw new RangeError('field must not be empty');
    }

    if (value.length === 0) {
      throw new RangeError('value must not be empty');
    }

    if (!/^[A-Za-z0-9_.]+$/.test(field)) {
      throw new RangeError('field contains invalid characters');
    }

    results.push({
      field,
      operator: detectedOperator,
      value,
    });
  }

  return results;
}