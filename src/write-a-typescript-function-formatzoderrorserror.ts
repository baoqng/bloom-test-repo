// bloom-deps: zod@^3

import { ZodError } from "zod";

export function formatZodErrors(error: ZodError): Record<string, string[]> {
  // Check if argument is a ZodError instance
  if (!(error instanceof ZodError)) {
    throw new TypeError("Argument must be a ZodError instance");
  }

  // Extract fieldErrors from error.flatten()
  const flattened = error.flatten();

  // Return fieldErrors or empty object if none exist
  return flattened.fieldErrors ?? {};
}