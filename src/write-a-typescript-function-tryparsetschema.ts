// bloom-deps: zod@^4

import { z } from "zod";

export function tryParse<T>(
  schema: z.ZodType<T>,
  input: unknown
): { ok: true; value: T } | { ok: false; error: string } {
  try {
    const value = schema.parse(input);
    return { ok: true, value };
  } catch (err) {
    let errorMessage: string;

    if (err instanceof z.ZodError) {
      errorMessage = err.message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    } else {
      errorMessage = String(err);
    }

    return { ok: false, error: errorMessage };
  }
}