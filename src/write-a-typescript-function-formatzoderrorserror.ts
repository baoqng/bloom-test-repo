// bloom-deps: zod@^3

import { ZodError } from "zod";

export function formatZodErrors(error: ZodError): Record<string, string[]> {
  if (!(error instanceof ZodError)) {
    throw new TypeError("Argument must be an instance of ZodError");
  }

  const flattened = error.flatten();
  const fieldErrors = flattened.fieldErrors as Record<string, string[]>;

  if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
    return {};
  }

  const result: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      result[key] = messages;
    }
  }

  return result;
}