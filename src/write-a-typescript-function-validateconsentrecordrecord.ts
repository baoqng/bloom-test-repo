// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function validateConsentRecord(record: unknown): {
  subjectId: string;
  purposes: string[];
  consentedAtMs: number;
  expiresAtMs: number | null;
  version: string;
} {
  if (!isPlainObject(record)) {
    throw new TypeError('record must be a plain object');
  }

  const rec = record as Record<string, unknown>;

  // Validate subjectId
  if (typeof rec.subjectId !== 'string' || rec.subjectId.trim().length === 0) {
    throw new TypeError('subjectId must be a non-empty string');
  }
  const subjectId = rec.subjectId.trim();

  // Validate purposes
  if (!Array.isArray(rec.purposes) || rec.purposes.length === 0) {
    throw new TypeError('purposes must be a non-empty array of strings');
  }
  for (const elem of rec.purposes) {
    if (typeof elem !== 'string' || elem.trim().length === 0) {
      throw new TypeError('purposes must be a non-empty array of strings');
    }
  }
  // Deduplicate preserving first occurrence
  const seen = new Set<string>();
  const purposes: string[] = [];
  for (const elem of rec.purposes) {
    const trimmedElem = (elem as string).trim();
    if (!seen.has(trimmedElem)) {
      seen.add(trimmedElem);
      purposes.push(trimmedElem);
    }
  }

  // Validate consentedAtMs
  const consentedAtMs = rec.consentedAtMs;
  if (
    typeof consentedAtMs !== 'number' ||
    !Number.isFinite(consentedAtMs) ||
    !Number.isInteger(consentedAtMs) ||
    consentedAtMs < 0
  ) {
    throw new TypeError('consentedAtMs must be a non-negative integer');
  }

  // Validate expiresAtMs
  let expiresAtMs: number | null = null;
  if (rec.expiresAtMs !== undefined && rec.expiresAtMs !== null) {
    const exp = rec.expiresAtMs;
    if (
      typeof exp !== 'number' ||
      !Number.isFinite(exp) ||
      !Number.isInteger(exp) ||
      exp <= 0
    ) {
      throw new TypeError('expiresAtMs must be a positive integer');
    }
    if (exp <= consentedAtMs) {
      throw new RangeError('expiresAtMs must be after consentedAtMs');
    }
    expiresAtMs = exp;
  }

  // Validate version
  if (typeof rec.version !== 'string' || rec.version.trim().length === 0) {
    throw new TypeError('version must be a non-empty string');
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