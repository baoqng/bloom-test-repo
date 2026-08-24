// bloom-deps:

function resolveTemplateVars(template: unknown, vars: unknown): string {
  // Validate template is a string
  if (typeof template !== 'string') {
    throw new TypeError('template must be a string');
  }

  // Validate vars is a plain object (not null, not array, not primitive)
  if (
    vars === null ||
    typeof vars !== 'object' ||
    Array.isArray(vars) ||
    Object.prototype.toString.call(vars) !== '[object Object]'
  ) {
    throw new TypeError('vars must be a plain object');
  }

  // Pattern for valid variable names: starts with letter or underscore, followed by alphanumerics or underscores
  const varNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  // Pattern to find all {{ }} placeholders
  const placeholderPattern = /\{\{([^}]*)\}\}/g;

  // Track if any placeholders were found
  let hasPlaceholders = false;

  // Replace all placeholders in a single left-to-right pass
  const result = template.replace(placeholderPattern, (match, varName) => {
    hasPlaceholders = true;

    // Validate that the variable name matches the required pattern
    if (!varNamePattern.test(varName)) {
      throw new SyntaxError(`invalid placeholder name: ${varName}`);
    }

    // Check if the variable name exists in vars
    if (!(varName in vars)) {
      throw new RangeError(`variable '${varName}' not found in vars`);
    }

    // Get the value from vars
    const value = (vars as Record<string, unknown>)[varName];

    // Validate that the resolved value is a string or number
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new TypeError(
        `resolved value for placeholder '${varName}' must be a string or number, got ${typeof value}`
      );
    }

    // Coerce numbers to strings for substitution
    if (typeof value === 'number') {
      return String(value);
    }

    return value;
  });

  return result;
}

export { resolveTemplateVars };