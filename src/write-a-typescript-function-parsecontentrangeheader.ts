// bloom-deps:

function parseContentRange(header: unknown): { start: number; end: number; total: number | null } {
  // Step 1: type check
  if (typeof header !== "string" || header.length === 0) {
    throw new TypeError("header must be a non-empty string");
  }

  // Step 2: check prefix
  if (!header.startsWith("bytes ")) {
    throw new RangeError("header must start with 'bytes '");
  }

  const rest = header.slice("bytes ".length);

  // rest should be of the form "start-end/total" or "start-end/*"
  // Find exactly one '/' separator
  const slashCount = (rest.match(/\//g) || []).length;
  if (slashCount !== 1) {
    throw new RangeError("header must contain exactly one '/' separator after 'bytes '");
  }

  const slashIdx = rest.indexOf("/");
  const rangePart = rest.slice(0, slashIdx);
  const totalPart = rest.slice(slashIdx + 1);

  // Parse range part: "start-end"
  // Find exactly one '-' separator
  const dashCount = (rangePart.match(/-/g) || []).length;
  if (dashCount !== 1) {
    throw new RangeError("range must contain exactly one '-' separator");
  }

  const dashIdx = rangePart.indexOf("-");
  const startStr = rangePart.slice(0, dashIdx);
  const endStr = rangePart.slice(dashIdx + 1);

  // Validate start
  if (!/^\d+$/.test(startStr)) {
    throw new RangeError("start must be a non-negative integer");
  }
  const start = Number(startStr);
  if (!Number.isInteger(start) || start < 0) {
    throw new RangeError("start must be a non-negative integer");
  }
  // Reject digit-leading non-integer strings (leading zeros might indicate non-integer parsing)
  if (String(start) !== startStr && startStr !== "0") {
    // leading zeros
    throw new RangeError("start must be a non-negative integer");
  }

  // Validate end
  if (!/^\d+$/.test(endStr)) {
    throw new RangeError("end must be a non-negative integer");
  }
  const end = Number(endStr);
  if (!Number.isInteger(end) || end < 0) {
    throw new RangeError("end must be a non-negative integer");
  }

  // start must not be greater than end
  if (start > end) {
    throw new RangeError("start must not be greater than end");
  }

  // Parse total
  let total: number | null;
  if (totalPart === "*") {
    total = null;
  } else {
    if (!/^\d+$/.test(totalPart)) {
      throw new RangeError("total must be a positive integer greater than end or '*'");
    }
    const totalNum = Number(totalPart);
    if (!Number.isInteger(totalNum) || totalNum <= end) {
      throw new RangeError("total must be a positive integer greater than end");
    }
    total = totalNum;
  }

  return { start, end, total };
}

export { parseContentRange };