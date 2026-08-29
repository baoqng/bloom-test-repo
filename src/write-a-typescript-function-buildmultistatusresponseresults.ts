// bloom-deps:

export function buildMultiStatusResponse(results: unknown): {
  succeeded: number;
  failed: number;
  errors: Array<{ index: number; message: string }>;
} {
  // Validate that results is a non-empty array
  if (!Array.isArray(results) || results.length === 0) {
    throw new TypeError("results must be a non-empty array");
  }

  let succeeded = 0;
  let failed = 0;
  const errors: Array<{ index: number; message: string }> = [];

  // Process each result entry
  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    // Validate that each element is a plain object
    if (
      result === null ||
      typeof result !== "object" ||
      Array.isArray(result) ||
      Object.getPrototypeOf(result) !== Object.prototype
    ) {
      throw new TypeError("Each result must have a boolean success field");
    }

    // Validate that success field exists and is boolean
    if (!("success" in result) || typeof result.success !== "boolean") {
      throw new TypeError("Each result must have a boolean success field");
    }

    const success = result.success;

    if (success) {
      succeeded++;
    } else {
      failed++;

      // For failed results, error field must be a non-empty string
      if (
        !("error" in result) ||
        typeof result.error !== "string" ||
        result.error.length === 0
      ) {
        throw new TypeError("Failed results must include an error message");
      }

      errors.push({
        index: i,
        message: result.error,
      });
    }
  }

  return {
    succeeded,
    failed,
    errors,
  };
}