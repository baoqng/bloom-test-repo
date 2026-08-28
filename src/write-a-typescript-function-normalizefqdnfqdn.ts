// bloom-deps:

function normalizeFqdn(fqdn: unknown): string {
  // Type validation - must be a string
  if (typeof fqdn !== 'string') {
    throw new TypeError('fqdn must be a string');
  }

  // Trim and check for empty
  const trimmed = fqdn.trim();
  if (trimmed.length === 0) {
    throw new RangeError('fqdn must not be empty');
  }

  // Convert to lowercase
  let normalized = trimmed.toLowerCase();

  // Remove single trailing dot if present
  if (normalized.endsWith('.')) {
    normalized = normalized.slice(0, -1);
  }

  // Check if empty after dot removal
  if (normalized.length === 0) {
    throw new RangeError('fqdn must not be empty after normalization');
  }

  // Split on dots
  const labels = normalized.split('.');

  // Check for empty labels and validate each label
  for (const label of labels) {
    // Check for empty label
    if (label.length === 0) {
      throw new RangeError('fqdn must not have empty labels');
    }

    // Check for invalid characters (only ASCII letters, digits, and hyphens allowed)
    if (!/^[a-z0-9-]+$/.test(label)) {
      throw new RangeError('fqdn label contains invalid characters');
    }

    // Check for hyphen at start or end - MANDATORY: validate inside label loop
    if (label.startsWith('-') || label.endsWith('-')) {
      throw new RangeError('fqdn label must not start or end with a hyphen');
    }
  }

  return normalized;
}

export { normalizeFqdn };