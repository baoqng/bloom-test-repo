// bloom-deps:

function parseContentRange(header: unknown): {
  unit: string;
  start: number | null;
  end: number | null;
  total: number | null;
} {
  // Validate that header is a non-empty string
  if (typeof header !== "string" || header.length === 0) {
    throw new TypeError("header must be a non-empty string");
  }

  const trimmedHeader = header.trim();

  // Find the first space to split unit from range/total
  const spaceIndex = trimmedHeader.indexOf(" ");
  if (spaceIndex === -1) {
    throw new SyntaxError("Not a valid Content-Range header");
  }

  const unit = trimmedHeader.slice(0, spaceIndex).toLowerCase();
  const rangeTotalPart = trimmedHeader.slice(spaceIndex + 1);

  // Find the slash to split range from total
  const slashIndex = rangeTotalPart.indexOf("/");
  if (slashIndex === -1) {
    throw new SyntaxError("Not a valid Content-Range header");
  }

  const rangePart = rangeTotalPart.slice(0, slashIndex);
  const totalPart = rangeTotalPart.slice(slashIndex + 1);

  // Parse total
  let total: number | null = null;
  if (totalPart !== "*") {
    const totalNum = parseInt(totalPart, 10);
    if (isNaN(totalNum) || totalNum.toString() !== totalPart) {
      throw new SyntaxError("Not a valid Content-Range header");
    }
    total = totalNum;
  }

  // Parse range (either 'start-end' or '*')
  let start: number | null = null;
  let end: number | null = null;

  if (rangePart === "*") {
    // Wildcard range - start and end remain null
  } else {
    const dashIndex = rangePart.indexOf("-");
    if (dashIndex === -1) {
      throw new SyntaxError("Not a valid Content-Range header");
    }

    const startStr = rangePart.slice(0, dashIndex);
    const endStr = rangePart.slice(dashIndex + 1);

    // Validate start
    if (startStr.length === 0) {
      throw new SyntaxError("Not a valid Content-Range header");
    }
    const startNum = parseInt(startStr, 10);
    if (isNaN(startNum) || startNum.toString() !== startStr) {
      throw new SyntaxError("Not a valid Content-Range header");
    }
    start = startNum;

    // Validate end
    if (endStr.length === 0) {
      throw new SyntaxError("Not a valid Content-Range header");
    }
    const endNum = parseInt(endStr, 10);
    if (isNaN(endNum) || endNum.toString() !== endStr) {
      throw new SyntaxError("Not a valid Content-Range header");
    }
    end = endNum;

    // Validate start <= end
    if (start > end) {
      throw new RangeError("start must be less than or equal to end");
    }

    // Validate end < total (only if total is not null)
    if (total !== null && end >= total) {
      throw new RangeError("end must be less than total");
    }
  }

  return {
    unit,
    start,
    end,
    total,
  };
}

export { parseContentRange };