// bloom-deps:

const UserSchema = {
  safeParse: (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
      return { success: false };
    }
    const obj = value as Record<string, unknown>;
    if (typeof obj.id !== 'string' || 
        typeof obj.name !== 'string' || 
        (obj.email !== null && typeof obj.email !== 'string') ||
        typeof obj.role !== 'string' ||
        (obj.score !== null && obj.score !== undefined && typeof obj.score !== 'number')) {
      return { success: false };
    }
    return { success: true, data: value };
  }
};

type User = {
  id: string;
  name: string;
  email: string | null;
  role: string;
  score?: number | null;
};

const GetUsersByRoleParamsSchema = {
  safeParse: (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
      return { success: false, error: { errors: [] } };
    }
    const obj = value as Record<string, unknown>;
    
    const errors: Array<{ path: string[]; message: string; code: string }> = [];
    
    if (typeof obj.role !== 'string' || obj.role.length === 0) {
      errors.push({ path: ['role'], message: 'role is required', code: 'too_small' });
    }
    
    if (typeof obj.limit !== 'number' || !Number.isInteger(obj.limit) || obj.limit < 0) {
      errors.push({ path: ['limit'], message: 'limit must be a non-negative integer', code: 'invalid_type' });
    }
    
    const offset = obj.offset ?? 0;
    if (typeof offset !== 'number' || !Number.isInteger(offset) || offset < 0) {
      errors.push({ path: ['offset'], message: 'offset must be a non-negative integer', code: 'invalid_type' });
    }
    
    if (errors.length > 0) {
      return { success: false, error: { errors } };
    }
    
    return { 
      success: true, 
      data: { 
        role: obj.role as string, 
        limit: obj.limit as number, 
        offset: offset as number 
      } 
    };
  }
};

type GetUsersByRoleParams = {
  role: string;
  limit: number;
  offset: number;
};

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type ValidationError = {
  field: string;
  message: string;
  code: string;
};

function isUser(value: unknown): value is User {
  return UserSchema.safeParse(value).success;
}

function isUserArray(value: unknown): value is User[] {
  return Array.isArray(value) && value.every((item) => isUser(item));
}

let inMemoryUsers: User[] = [];

export function seedUsers(users: User[]): void {
  inMemoryUsers = users.map((u) => ({ ...u }));
}

export function getUsersByRole(
  unknownParams: unknown
): Result<User[], ValidationError[]> {
  const parseResult = GetUsersByRoleParamsSchema.safeParse(unknownParams);

  if (!parseResult.success) {
    const errors: ValidationError[] = parseResult.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    }));
    return { success: false, error: errors };
  }

  const { role, limit, offset } = parseResult.data;

  if (limit === 0) {
    return { success: true, data: [] };
  }

  try {
    const filtered = inMemoryUsers.filter((user) => user.role === role);
    const paginated = filtered.slice(offset, offset + limit);

    if (!isUserArray(paginated)) {
      throw new Error("Unexpected data shape in user store");
    }

    return { success: true, data: paginated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[getUsersByRole] Failed to filter users:", message);
    throw new Error(`getUsersByRole failed: ${message}`);
  }
}

export function getUsersByRoleWithScoreFilter(
  unknownParams: unknown,
  minScore: number,
  maxScore: number
): Result<User[], ValidationError[]> {
  const baseResult = getUsersByRole(unknownParams);

  if (!baseResult.success) {
    return baseResult;
  }

  try {
    const filtered = baseResult.data.filter((user) => {
      const hasScore = (score: unknown): score is number => typeof score === 'number';
      
      if (!hasScore(user.score)) {
        return false;
      }
      return user.score >= minScore && user.score <= maxScore;
    });

    return { success: true, data: filtered };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[getUsersByRoleWithScoreFilter] Failed to filter by score:", message);
    throw new Error(`getUsersByRoleWithScoreFilter failed: ${message}`);
  }
}

export type { User, GetUsersByRoleParams, ValidationError as ValidationFieldError };