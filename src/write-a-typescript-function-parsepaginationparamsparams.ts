// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function parsePaginationParams(
  params: Record<string, unknown>,
  options: {
    allowedSortFields: string[];
    maxLimit?: number;
    defaultLimit?: number;
    defaultSortField?: string;
    defaultSortDir?: 'asc' | 'desc';
  }
): { offset: number; limit: number; sortBy: string; sortDir: 'asc' | 'desc' } {
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  if (!isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }

  const { allowedSortFields, maxLimit: rawMaxLimit, defaultLimit: rawDefaultLimit, defaultSortField, defaultSortDir } = options;

  if (
    !Array.isArray(allowedSortFields) ||
    allowedSortFields.length === 0 ||
    !allowedSortFields.every((f) => typeof f === 'string')
  ) {
    throw new TypeError('allowedSortFields must be a non-empty array of strings');
  }

  const maxLimit = rawMaxLimit !== undefined ? rawMaxLimit : 100;
  const defaultLimit = rawDefaultLimit !== undefined ? rawDefaultLimit : 20;

  // Parse page
  let page: number;
  const rawPage = params['page'];
  if (rawPage === undefined || rawPage === null) {
    page = 1;
  } else if (typeof rawPage === 'string' || typeof rawPage === 'number') {
    const parsed = parseInt(String(rawPage), 10);
    if (!Number.isInteger(parsed)) {
      throw new RangeError('page must be a positive integer');
    }
    page = parsed;
  } else {
    throw new RangeError('page must be a positive integer');
  }

  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('page must be a positive integer');
  }

  // Parse limit
  let limit: number;
  const rawLimit = params['limit'];
  if (rawLimit === undefined || rawLimit === null) {
    limit = defaultLimit;
  } else if (typeof rawLimit === 'string' || typeof rawLimit === 'number') {
    const parsed = parseInt(String(rawLimit), 10);
    if (!Number.isInteger(parsed)) {
      throw new RangeError(`limit must be between 1 and ${maxLimit}`);
    }
    limit = parsed;
  } else {
    throw new RangeError(`limit must be between 1 and ${maxLimit}`);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    throw new RangeError(`limit must be between 1 and ${maxLimit}`);
  }

  // Parse sortBy
  let sortBy: string;
  const rawSortBy = params['sortBy'];
  if (rawSortBy === undefined || rawSortBy === null) {
    sortBy = defaultSortField !== undefined ? defaultSortField : allowedSortFields[0];
  } else if (typeof rawSortBy === 'string') {
    sortBy = rawSortBy;
  } else {
    throw new RangeError(`sortBy must be one of: ${allowedSortFields.join(', ')}`);
  }

  if (!allowedSortFields.includes(sortBy)) {
    throw new RangeError(`sortBy must be one of: ${allowedSortFields.join(', ')}`);
  }

  // Parse sortDir
  let sortDir: 'asc' | 'desc';
  const rawSortDir = params['sortDir'];
  if (rawSortDir === undefined || rawSortDir === null) {
    sortDir = defaultSortDir !== undefined ? defaultSortDir : 'asc';
  } else if (typeof rawSortDir === 'string') {
    if (rawSortDir !== 'asc' && rawSortDir !== 'desc') {
      throw new RangeError('sortDir must be asc or desc');
    }
    sortDir = rawSortDir;
  } else {
    throw new RangeError('sortDir must be asc or desc');
  }

  const offset = (page - 1) * limit;

  return { offset, limit, sortBy, sortDir };
}