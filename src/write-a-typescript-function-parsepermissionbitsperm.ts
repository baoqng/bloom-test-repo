// bloom-deps:

export function parsePermissionBits(perm: unknown): { read: boolean; write: boolean; execute: boolean } {
  if (typeof perm !== 'string') {
    throw new TypeError('perm must be a string');
  }
  if (perm.length !== 3) {
    throw new RangeError('perm must be exactly 3 characters');
  }
  if (perm[0] !== 'r' && perm[0] !== '-') {
    throw new RangeError("perm[0] must be 'r' or '-'");
  }
  if (perm[1] !== 'w' && perm[1] !== '-') {
    throw new RangeError("perm[1] must be 'w' or '-'");
  }
  if (perm[2] !== 'x' && perm[2] !== '-') {
    throw new RangeError("perm[2] must be 'x' or '-'");
  }
  return {
    read: perm[0] === 'r',
    write: perm[1] === 'w',
    execute: perm[2] === 'x',
  };
}