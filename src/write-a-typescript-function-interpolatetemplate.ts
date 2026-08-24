// bloom-deps:

function interpolate(template: string, variables: Record<string, string | number>): string {
  if (typeof template !== 'string') {
    throw new TypeError('template must be a string');
  }
  if (
    typeof variables !== 'object' ||
    variables === null ||
    Array.isArray(variables) ||
    Object.getPrototypeOf(variables) !== Object.prototype
  ) {
    throw new TypeError('variables must be a plain object');
  }

  // First, temporarily replace escaped braces \{{ with a placeholder
  const ESCAPED_PLACEHOLDER = '\x00ESCAPED_OPEN\x00';
  let result = template.replace(/\\\{\{/g, ESCAPED_PLACEHOLDER);

  // Replace {{...}} placeholders
  result = result.replace(/\{\{([^}]*)\}\}/g, (match, inner) => {
    const key = inner.trim();
    if (!(key in variables)) {
      throw new ReferenceError(`Variable "${key}" is not defined`);
    }
    return String(variables[key]);
  });

  // Restore escaped braces
  result = result.replace(new RegExp(ESCAPED_PLACEHOLDER, 'g'), '{{');

  return result;
}

export { interpolate };