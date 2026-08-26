// bloom-deps:

export function buildMetricsLabel(metricName: unknown, labels: unknown): string {
  // Validate metricName type and emptiness
  if (typeof metricName !== 'string' || metricName.trim().length === 0) {
    throw new TypeError('metricName must be a non-empty string');
  }

  const trimmedName = metricName.trim();

  // Validate metricName characters
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedName)) {
    throw new RangeError('metricName must contain only letters, digits, and underscores');
  }

  // Validate metricName does not start with a digit
  if (/^\d/.test(trimmedName)) {
    throw new RangeError('metricName must not start with a digit');
  }

  // Validate labels type
  if (labels !== null) {
    if (
      typeof labels !== 'object' ||
      Array.isArray(labels) ||
      Object.getPrototypeOf(labels) !== Object.prototype
    ) {
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

  // Validate all label values are strings
  for (const key of keys) {
    if (typeof labelsObj[key] !== 'string') {
      throw new TypeError('all label values must be strings');
    }
  }

  // Validate label keys
  for (const key of keys) {
    if (!/^[a-zA-Z0-9_]+$/.test(key)) {
      throw new RangeError('label keys must contain only letters, digits, and underscores');
    }
  }

  // Sort keys lexicographically
  const sortedKeys = keys.slice().sort();

  // Format each label
  const formattedLabels = sortedKeys.map((key) => {
    const value = (labelsObj[key] as string).replace(/"/g, '\\"');
    return `${key}="${value}"`;
  });

  return `${trimmedName}{${formattedLabels.join(',')}}`;
}