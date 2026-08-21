// bloom-deps:

function isPlainObject(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  if (Array.isArray(v)) return false;
  let proto = Object.getPrototypeOf(v);
  while (proto !== null) {
    if (proto === Object.prototype) {
      return Object.getPrototypeOf(proto) === null;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

export function validateSchema(
  data: unknown,
  schema: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
  }>
): { valid: boolean; errors: Array<{ field: string; message: string }> } {
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object');
  }
  if (!isPlainObject(data)) {
    throw new TypeError('data must be a plain object');
  }

  const dataObj = data as Record<string, unknown>;
  const errors: Array<{ field: string; message: string }> = [];

  for (const field of Object.keys(schema)) {
    const rule = schema[field];
    const inData = field in dataObj;
    const value = dataObj[field];
    const isAbsent = !inData || value === null || value === undefined;

    if (rule.required === true && isAbsent) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    if (isAbsent) {
      continue;
    }

    // Type check
    let typeValid = false;
    switch (rule.type) {
      case 'string':
        typeValid = typeof value === 'string';
        break;
      case 'number':
        typeValid = typeof value === 'number';
        break;
      case 'boolean':
        typeValid = typeof value === 'boolean';
        break;
      case 'array':
        typeValid = Array.isArray(value);
        break;
      case 'object':
        typeValid = typeof value === 'object' && value !== null && !Array.isArray(value);
        break;
    }

    if (!typeValid) {
      errors.push({ field, message: `${field} must be a ${rule.type}` });
      continue;
    }

    // Number constraints
    if (rule.type === 'number') {
      const num = value as number;
      if (rule.min !== undefined && num < rule.min) {
        errors.push({ field, message: `${field} must be >= ${rule.min}` });
      }
      if (rule.max !== undefined && num > rule.max) {
        errors.push({ field, message: `${field} must be <= ${rule.max}` });
      }
    }

    // String constraints
    if (rule.type === 'string') {
      const str = value as string;
      if (rule.min !== undefined && str.length < rule.min) {
        errors.push({ field, message: `${field} must have at least ${rule.min} characters` });
      }
      if (rule.max !== undefined && str.length > rule.max) {
        errors.push({ field, message: `${field} must have at most ${rule.max} characters` });
      }
      if (rule.pattern !== undefined && !new RegExp(rule.pattern).test(str)) {
        errors.push({ field, message: `${field} does not match pattern` });
      }
    }

    // Enum check
    if (rule.enum !== undefined && !rule.enum.some(e => e === value)) {
      errors.push({ field, message: `${field} must be one of: ${rule.enum.join(', ')}` });
    }
  }

  return { valid: errors.length === 0, errors };
}