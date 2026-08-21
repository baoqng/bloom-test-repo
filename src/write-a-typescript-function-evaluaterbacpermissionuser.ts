// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
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
    !(user.roles as unknown[]).every((r) => typeof r === 'string')
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

  // Return false if user.roles is empty
  if (user.roles.length === 0) {
    return false;
  }

  // Check each role
  for (const role of user.roles) {
    const granted = (policy as Record<string, unknown>)[role];
    if (Array.isArray(granted) && granted.includes(permission)) {
      return true;
    }
  }

  return false;
}