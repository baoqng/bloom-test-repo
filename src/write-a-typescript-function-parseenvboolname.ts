// bloom-deps:

export function parseEnvBool(name: string, defaultValue: boolean): boolean {
  // Validate name parameter
  if (typeof name !== 'string') {
    throw new TypeError('name must be a non-empty string');
  }
  
  if (name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }
  
  // Validate defaultValue parameter
  if (typeof defaultValue !== 'boolean') {
    throw new TypeError('defaultValue must be a boolean');
  }
  
  // Get the environment variable value
  const envValue = process.env[name];
  
  // If unset or empty, return default
  if (envValue === undefined || envValue === '') {
    return defaultValue;
  }
  
  // Normalize to lowercase for comparison
  const normalized = envValue.toLowerCase();
  
  // Check against accepted true values
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }
  
  // Check against accepted false values
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }
  
  // If we reach here, the value is non-empty but not recognized
  throw new RangeError(`Environment variable "${name}" has unrecognized value: "${envValue}"`);
}