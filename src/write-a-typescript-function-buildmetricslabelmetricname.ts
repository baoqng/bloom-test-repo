// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  if (Array.isArray(value)) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function buildMetricsLabel(metricName: unknown, labels: unknown): string {
  // Validate metricName type and emptiness
  if (typeof metricName !== 'string' || metricName.trim().length === 0) {
    throw new TypeError('metricName must be a non-empty string');
  }

  const trimmedName = metricName.trim();

  // Validate metricName characters
  if (/[^a-zA-Z0-9_]/.test(trimmedName)) {
    throw new RangeError('metricName must contain only letters, digits, and underscores');
  }

  // Validate metricName doesn't start with a digit
  if (/^[0-9]/.test(trimmedName)) {
    throw new RangeError('metricName must not start with a digit');
  }

  // Validate labels
  if (labels !== null) {
    if (typeof labels !== 'object' || Array.isArray(labels) || !isPlainObject(labels)) {
      throw new TypeError('labels must be a plain object or null');
    }
  }

  // If labels is null or has no own enumerable keys, return metric name alone
  if (labels === null) {
    return trimmedName;
  }

  const labelsObj = labels as Record<string, unknown>;
  const keys = Object.keys(labelsObj);

  if (keys.length === 0) {
    return trimmedName;
  }

  // Validate label values
  for (const key of keys) {
    if (typeof labelsObj[key] !== 'string') {
      throw new TypeError('all label values must be strings');
    }
  }

  // Validate label keys
  for (const key of keys) {
    if (/[^a-zA-Z0-9_]/.test(key)) {
      throw new RangeError('label keys must contain only letters, digits, and underscores');
    }
  }

  // Sort keys lexicographically
  const sortedKeys = keys.slice().sort();

  // Format each label
  const formatted = sortedKeys.map(key => {
    const value = (labelsObj[key] as string).replace(/"/g, '\\"');
    return `${key}="${value}"`;
  });

  return `${trimmedName}{${formatted.join(',')}}`;
}