// bloom-deps:

function parseContentRange(header: unknown): { start: number; end: number; total: number | null } {
  // Validate input type and non-empty string
  if (typeof header !== 'string') {
    throw new TypeError('header must be a non-empty string');
  }

  if (header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }

  // Check for "bytes " prefix
  if (!header.startsWith('bytes ')) {
    throw new RangeError('header must start with "bytes "');
  }

  // Extract the range and total parts
  const contentAfterBytes = header.slice(6); // Remove "bytes " prefix
  const slashIndex = contentAfterBytes.lastIndexOf('/');

  if (slashIndex === -1) {
    throw new RangeError('header must contain "/" separator');
  }

  const rangePart = contentAfterBytes.slice(0, slashIndex);
  const totalPart = contentAfterBytes.slice(slashIndex + 1);

  // Parse range part (start-end)
  const dashIndex = rangePart.indexOf('-');

  if (dashIndex === -1) {
    throw new RangeError('range must contain "-" separator');
  }

  const startStr = rangePart.slice(0, dashIndex);
  const endStr = rangePart.slice(dashIndex + 1);

  // Validate start is a non-negative integer
  const start = parseInt(startStr, 10);
  if (
    isNaN(start) ||
    !Number.isInteger(start) ||
    start < 0 ||
    startStr !== start.toString()
  ) {
    throw new RangeError('start must be a non-negative integer');
  }

  // Validate end is a non-negative integer
  const end = parseInt(endStr, 10);
  if (
    isNaN(end) ||
    !Number.isInteger(end) ||
    end < 0 ||
    endStr !== end.toString()
  ) {
    throw new RangeError('end must be a non-negative integer');
  }

  // Validate start <= end
  if (start > end) {
    throw new RangeError('start must not be greater than end');
  }

  // Parse and validate total
  let total: number | null = null;

  if (totalPart === '*') {
    total = null;
  } else {
    const parsedTotal = parseInt(totalPart, 10);

    if (
      isNaN(parsedTotal) ||
      !Number.isInteger(parsedTotal) ||
      parsedTotal <= 0 ||
      parsedTotal !== parseInt(totalPart, 10) ||
      totalPart !== parsedTotal.toString()
    ) {
      throw new RangeError('total must be a positive integer');
    }

    if (parsedTotal <= end) {
      throw new RangeError('total must be greater than end');
    }

    total = parsedTotal;
  }

  return { start, end, total };
}

export { parseContentRange };