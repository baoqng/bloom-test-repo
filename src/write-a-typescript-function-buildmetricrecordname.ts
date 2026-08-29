// bloom-deps:

export function buildMetricRecord(
  name: string,
  value: number,
  labels: Record<string, string>,
  timestampMs?: number
): { name: string; value: number; labels: Record<string, string>; timestamp: number } {
  // Validate name is a non-empty string
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  // Validate name matches /^[a-zA-Z][a-zA-Z0-9_.]*$/
  if (!/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(name)) {
    throw new TypeError('Invalid metric name: ' + name);
  }

  // Validate value is a finite number
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }

  // Validate labels is a plain object
  if (!isPlainObject(labels)) {
    throw new TypeError('labels must be a plain object');
  }

  // Validate each label key and value
  for (const key in labels) {
    if (Object.prototype.hasOwnProperty.call(labels, key)) {
      // Validate label key matches /^[a-zA-Z_][a-zA-Z0-9_]*$/
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        throw new TypeError('Invalid label key: ' + key);
      }

      // Validate label value is a string
      const labelValue = labels[key];
      if (typeof labelValue !== 'string') {
        throw new TypeError('Label value must be a string for key ' + key);
      }
    }
  }

  // Validate and set timestamp
  let timestamp: number;
  if (timestampMs !== undefined) {
    // Validate timestampMs is a finite number
    if (typeof timestampMs !== 'number' || !isFinite(timestampMs)) {
      throw new TypeError('timestampMs must be a finite number');
    }

    // Validate timestampMs is > 0
    if (timestampMs <= 0) {
      throw new RangeError('timestampMs must be > 0');
    }

    timestamp = timestampMs;
  } else {
    // Capture Date.now() once
    timestamp = Date.now();
  }

  // Shallow copy labels
  const copiedLabels: Record<string, string> = {};
  for (const key in labels) {
    if (Object.prototype.hasOwnProperty.call(labels, key)) {
      copiedLabels[key] = labels[key];
    }
  }

  return {
    name,
    value,
    labels: copiedLabels,
    timestamp
  };
}

/**
 * Check if a value is a plain object by walking the full prototype chain.
 * Returns true only if:
 * - value is not null
 * - value is not an array
 * - typeof value is 'object'
 * - prototype chain leads to Object.prototype
 */
function isPlainObject(value: unknown): boolean {
  // Check null
  if (value === null) {
    return false;
  }

  // Check typeof is 'object'
  if (typeof value !== 'object') {
    return false;
  }

  // Check not an array
  if (Array.isArray(value)) {
    return false;
  }

  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(value);
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  // Should end at Object.prototype
  return Object.getPrototypeOf(value) === proto;
}