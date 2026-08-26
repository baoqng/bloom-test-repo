// bloom-deps:

function resolveEffectiveRole(roles: unknown, hierarchy: unknown): string {
  if (
    !Array.isArray(roles) ||
    roles.length === 0 ||
    !roles.every((r) => typeof r === "string")
  ) {
    throw new TypeError(
      "roles must be a non-empty array of strings"
    );
  }

  if (
    !Array.isArray(hierarchy) ||
    hierarchy.length === 0 ||
    !hierarchy.every((h) => typeof h === "string")
  ) {
    throw new TypeError(
      "hierarchy must be a non-empty array of strings"
    );
  }

  const rolesArr = roles as string[];
  const hierarchyArr = hierarchy as string[];

  for (const role of rolesArr) {
    if (role === "") {
      throw new RangeError("roles must not contain empty strings");
    }
  }

  for (const role of rolesArr) {
    if (!hierarchyArr.includes(role)) {
      throw new RangeError(`Unknown role: "${role}"`);
    }
  }

  let bestRole: string = rolesArr[0];
  let bestIndex: number = hierarchyArr.indexOf(rolesArr[0]);

  for (let i = 1; i < rolesArr.length; i++) {
    const idx = hierarchyArr.indexOf(rolesArr[i]);
    if (idx >= bestIndex) {
      bestIndex = idx;
      bestRole = rolesArr[i];
    }
  }

  return bestRole;
}

export { resolveEffectiveRole };