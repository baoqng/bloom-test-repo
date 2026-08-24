// bloom-deps:

/**
 * Reads an environment variable and returns it as a trimmed string.
 * 
 * @param name - The name of the environment variable to read
 * @returns The trimmed value of the environment variable
 * @throws TypeError if name is not a non-empty string
 * @throws RangeError if the environment variable is undefined, empty, or whitespace-only
 */
function requireEnvString(name: unknown): string {
  // Validate that name is a string type
  if (typeof name !== 'string') {
    throw new TypeError(`Environment variable name must be a string, received ${typeof name}`);
  }

  // Validate that name is not empty
  if (name.length === 0) {
    throw new TypeError('Environment variable name cannot be an empty string');
  }

  // Check if the environment variable is defined
  const value = process.env[name];
  if (value === undefined) {
    throw new RangeError(`Environment variable "${name}" is not defined`);
  }

  // Trim the value and check if it's empty or whitespace-only
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    throw new RangeError(`Environment variable "${name}" is empty or contains only whitespace`);
  }

  return trimmedValue;
}

export { requireEnvString };