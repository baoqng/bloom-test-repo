// bloom-deps:

type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'PS256' | 'PS384' | 'PS512';

const ALLOWED_ALGORITHMS: ReadonlySet<string> = new Set<JwtAlgorithm>([
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'ES256', 'ES384', 'ES512',
  'PS256', 'PS384', 'PS512',
]);

export function validateJwtAlgorithm(alg: unknown): JwtAlgorithm {
  if (typeof alg !== 'string') {
    throw new TypeError('alg must be a string');
  }

  if (!alg.trim()) {
    throw new RangeError('alg must not be empty');
  }

  const trimmed = alg.trim();

  if (!ALLOWED_ALGORITHMS.has(trimmed)) {
    throw new RangeError(`unsupported algorithm: ${trimmed}`);
  }

  return trimmed as JwtAlgorithm;
}