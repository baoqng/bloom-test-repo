// bloom-deps:

export function validateMacAddress(mac: unknown): string {
  if (typeof mac !== "string") {
    throw new TypeError("mac must be a string");
  }

  if (mac.trim().length === 0) {
    throw new RangeError("mac must not be empty");
  }

  const trimmed = mac.trim();

  const hasColon = trimmed.includes(":");
  const hasHyphen = trimmed.includes("-");

  if (hasColon && hasHyphen) {
    throw new RangeError("mac must use colons or hyphens as separators, not both");
  }

  let groups: string[];

  if (hasColon) {
    groups = trimmed.split(":");
  } else if (hasHyphen) {
    groups = trimmed.split("-");
  } else {
    // No separator — must be exactly 12 hex chars
    if (trimmed.length !== 12) {
      throw new RangeError("mac must have exactly 6 groups");
    }
    groups = [];
    for (let i = 0; i < 12; i += 2) {
      groups.push(trimmed.slice(i, i + 2));
    }
  }

  if (groups.length !== 6) {
    throw new RangeError("mac must have exactly 6 groups");
  }

  const hexPattern = /^[0-9a-fA-F]{2}$/;
  for (const group of groups) {
    if (!hexPattern.test(group)) {
      throw new RangeError("each mac group must be exactly 2 hexadecimal characters");
    }
  }

  return groups.join(":").toLowerCase();
}