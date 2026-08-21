// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  let proto = v;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(v) === proto;
}

export function evaluateRbacPermission(
  user: { id: string; roles: string[] },
  permission: string,
  policy: Record<string, string[]>
): boolean {
  // Validate user
  if (
    !isPlainObject(user) ||
    typeof (user as Record<string, unknown>).id !== 'string' ||
    !Array.isArray((user as Record<string, unknown>).roles) ||
    !(user as Record<string, unknown[]>).roles.every((r) => typeof r === 'string')
  ) {
    throw new TypeError(
      'user must be an object with id (string) and roles (string[])'
    );
  }

  // Validate permission
  if (typeof permission !== 'string' || permission.length === 0) {
    throw new TypeError('permission must be a non-empty string');
  }

  // Validate policy
  if (!isPlainObject(policy)) {
    throw new TypeError('policy must be a plain object');
  }

  // Empty roles
  if (user.roles.length === 0) {
    return false;
  }

  // Check each role
  for (const role of user.roles) {
    if (Object.prototype.hasOwnProperty.call(policy, role)) {
      const permissions = policy[role];
      if (Array.isArray(permissions) && permissions.some((p) => p === permission)) {
        return true;
      }
    }
  }

  return false;
}