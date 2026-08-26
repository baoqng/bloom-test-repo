// bloom-deps:

function validateConsentRecord(record: unknown): {
  subjectId: string;
  purposes: string[];
  consentedAtMs: number;
  expiresAtMs: number | null;
  version: string;
} {
  // Validate record is a plain object
  if (
    record === null ||
    typeof record !== "object" ||
    Array.isArray(record) ||
    Object.getPrototypeOf(record) !== Object.prototype
  ) {
    throw new TypeError("record must be a plain object");
  }

  const rec = record as Record<string, unknown>;

  // Validate subjectId
  if (typeof rec.subjectId !== "string" || rec.subjectId.trim() === "") {
    throw new TypeError("subjectId must be a non-empty string");
  }
  const subjectId = rec.subjectId.trim();

  // Validate purposes
  if (
    !Array.isArray(rec.purposes) ||
    rec.purposes.length === 0 ||
    rec.purposes.some((p) => typeof p !== "string" || (p as string).trim() === "")
  ) {
    throw new TypeError("purposes must be a non-empty array of strings");
  }
  // Deduplicate preserving first occurrence
  const seen = new Set<string>();
  const purposes: string[] = [];
  for (const p of rec.purposes as string[]) {
    const trimmed = p.trim();
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      purposes.push(trimmed);
    }
  }

  // Validate consentedAtMs
  if (
    typeof rec.consentedAtMs !== "number" ||
    !Number.isFinite(rec.consentedAtMs) ||
    !Number.isInteger(rec.consentedAtMs) ||
    rec.consentedAtMs < 0
  ) {
    throw new TypeError("consentedAtMs must be a non-negative integer");
  }
  const consentedAtMs = rec.consentedAtMs;

  // Validate expiresAtMs
  let expiresAtMs: number | null = null;
  if (rec.expiresAtMs !== undefined && rec.expiresAtMs !== null) {
    if (
      typeof rec.expiresAtMs !== "number" ||
      !Number.isFinite(rec.expiresAtMs) ||
      !Number.isInteger(rec.expiresAtMs) ||
      rec.expiresAtMs <= 0
    ) {
      throw new TypeError("expiresAtMs must be a positive integer");
    }
    if (rec.expiresAtMs <= consentedAtMs) {
      throw new RangeError("expiresAtMs must be after consentedAtMs");
    }
    expiresAtMs = rec.expiresAtMs;
  }

  // Validate version
  if (typeof rec.version !== "string" || rec.version.trim() === "") {
    throw new TypeError("version must be a non-empty string");
  }
  const version = rec.version.trim();

  return {
    subjectId,
    purposes,
    consentedAtMs,
    expiresAtMs,
    version,
  };
}

export { validateConsentRecord };