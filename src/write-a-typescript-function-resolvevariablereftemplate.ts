// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === null;
}

export function resolveVariableRef(template: unknown, context: unknown): string {
  if (typeof template !== 'string') {
    throw new TypeError('template must be a string');
  }

  if (context === null || typeof context !== 'object' || Array.isArray(context)) {
    throw new TypeError('context must be an object');
  }

  const trimmed = template.trim();

  if (trimmed.length === 0) {
    throw new RangeError('template must not be empty');
  }

  if (!trimmed.startsWith('${') || !trimmed.endsWith('}')) {
    throw new RangeError('template must be a single variable reference');
  }

  if (trimmed.length <= 3) {
    // '${' + '}' = 3 chars, so variable name portion is empty
    const inner = trimmed.slice(2, trimmed.length - 1);
    if (inner.trim().length === 0) {
      throw new RangeError('variable name must not be empty');
    }
  }

  const inner = trimmed.slice(2, trimmed.length - 1);

  if (inner.trim().length === 0) {
    throw new RangeError('variable name must not be empty');
  }

  const varName = inner.trim();

  if (!/^[A-Z0-9_]+$/.test(varName)) {
    throw new RangeError('variable name contains invalid characters');
  }

  const ctx = context as Record<string, unknown>;

  if (!Object.prototype.hasOwnProperty.call(ctx, varName)) {
    throw new RangeError(`variable \${${varName}} not found in context`);
  }

  const value = ctx[varName];

  if (typeof value !== 'string') {
    throw new TypeError('context value must be a string');
  }

  return value;
}