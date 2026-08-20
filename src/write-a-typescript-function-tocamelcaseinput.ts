// bloom-deps:

function toCamelCase(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError('Expected string');
  }

  if (input.length === 0) {
    return '';
  }

  // Count and preserve leading underscores
  let leadingCount = 0;
  while (leadingCount < input.length && input[leadingCount] === '_') {
    leadingCount++;
  }

  // Count and preserve trailing underscores
  let trailingCount = 0;
  while (trailingCount < input.length && input[input.length - 1 - trailingCount] === '_') {
    trailingCount++;
  }

  const leadingUnderscores = '_'.repeat(leadingCount);
  const trailingUnderscores = '_'.repeat(trailingCount);

  // Extract the middle portion (without leading/trailing underscores)
  const middle = input.slice(leadingCount, input.length - trailingCount || undefined);

  if (middle.length === 0) {
    return input;
  }

  // Split on one or more underscores, filter out empty segments
  const parts = middle.split(/_+/).filter(part => part.length > 0);

  if (parts.length === 0) {
    return input;
  }

  // First part stays lowercase, subsequent parts get capitalized
  const camel = parts[0].toLowerCase() +
    parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('');

  return leadingUnderscores + camel + trailingUnderscores;
}

export { toCamelCase };