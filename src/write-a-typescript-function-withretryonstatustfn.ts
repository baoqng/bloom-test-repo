// bloom-deps:

export async function withRetryOnStatus<T>(
  fn: () => Promise<{ status: number; body: T }>,
  retryStatuses: number[],
  maxAttempts: number
): Promise<T> {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  if (!Array.isArray(retryStatuses) || retryStatuses.length === 0) {
    throw new TypeError('retryStatuses must be a non-empty array');
  }

  let lastError: unknown = undefined;
  let lastStatus: number | undefined = undefined;
  let exhaustedDueToStatus = false;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (retryStatuses.indexOf(result.status) !== -1) {
        lastStatus = result.status;
        exhaustedDueToStatus = true;
        lastError = undefined;
        // If attempts remain, retry
        if (attempt < maxAttempts - 1) {
          continue;
        }
        // Exhausted due to retryable status
        throw new Error(`Max attempts reached with status ${result.status}`);
      }
      return result.body;
    } catch (err) {
      // Check if this is the error we threw ourselves (status exhausted)
      if (
        exhaustedDueToStatus &&
        err instanceof Error &&
        lastStatus !== undefined &&
        err.message === `Max attempts reached with status ${lastStatus}`
      ) {
        throw err;
      }
      // fn threw an error
      lastError = err;
      exhaustedDueToStatus = false;
      // If attempts remain, retry
      if (attempt < maxAttempts - 1) {
        continue;
      }
      // Exhausted due to thrown errors
      throw lastError;
    }
  }

  // Should not reach here
  throw lastError;
}