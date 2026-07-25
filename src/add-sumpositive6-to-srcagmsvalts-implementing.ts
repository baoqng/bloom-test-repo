// bloom-deps:

export function sumPositive_6(numbers: number[]): number {
  try {
    if (!Array.isArray(numbers)) {
      throw new Error('Input must be an array');
    }

    return numbers.reduce((sum, num) => {
      if (typeof num !== 'number') {
        throw new Error('All array elements must be numbers');
      }
      return num > 0 ? sum + num : sum;
    }, 0);
  } catch (error) {
    throw new Error(`sumPositive_6 failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}