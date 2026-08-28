// bloom-deps:

export function parseSemVer(input: unknown): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  buildMetadata: string | null;
} {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const invalid = () => new SyntaxError('Not a valid SemVer string');

  // Split off build metadata first using indexOf+slice (first '+' only)
  let rest = input;
  let buildMetadata: string | null = null;

  const plusIdx = rest.indexOf('+');
  if (plusIdx !== -1) {
    const buildPart = rest.slice(plusIdx + 1);
    rest = rest.slice(0, plusIdx);

    if (buildPart.length === 0) throw invalid();

    // Validate build metadata identifiers
    const buildIds = buildPart.split('.');
    for (const id of buildIds) {
      if (id.length === 0) throw invalid();
      if (!/^[0-9A-Za-z-]+$/.test(id)) throw invalid();
    }
    buildMetadata = buildPart;
  }

  // Split off prerelease using indexOf+slice (first '-' only)
  let prerelease: string | null = null;

  const dashIdx = rest.indexOf('-');
  if (dashIdx !== -1) {
    const prePart = rest.slice(dashIdx + 1);
    rest = rest.slice(0, dashIdx);

    if (prePart.length === 0) throw invalid();

    // Validate prerelease identifiers
    const preIds = prePart.split('.');
    for (const id of preIds) {
      if (id.length === 0) throw invalid();
      if (!/^[0-9A-Za-z-]+$/.test(id)) throw invalid();
      // Check for leading zeros in numeric identifiers
      if (/^[0-9]+$/.test(id)) {
        if (id.length > 1 && id[0] === '0') throw invalid();
      }
    }
    prerelease = prePart;
  }

  // Now rest should be major.minor.patch
  // Count dots explicitly using indexOf+slice
  const firstDot = rest.indexOf('.');
  if (firstDot === -1) throw invalid();

  const majorStr = rest.slice(0, firstDot);
  const afterMajor = rest.slice(firstDot + 1);

  const secondDot = afterMajor.indexOf('.');
  if (secondDot === -1) throw invalid();

  const minorStr = afterMajor.slice(0, secondDot);
  const patchStr = afterMajor.slice(secondDot + 1);

  // Ensure no extra dots in patch
  if (patchStr.indexOf('.') !== -1) throw invalid();

  // Validate each numeric component
  const validateNumeric = (s: string): number => {
    if (s.length === 0) throw invalid();
    if (!/^[0-9]+$/.test(s)) throw invalid();
    if (s.length > 1 && s[0] === '0') throw invalid();
    const n = Number(s);
    if (!Number.isInteger(n) || n < 0) throw invalid();
    return n;
  };

  const major = validateNumeric(majorStr);
  const minor = validateNumeric(minorStr);
  const patch = validateNumeric(patchStr);

  return { major, minor, patch, prerelease, buildMetadata };
}