// bloom-deps:
import { ServiceError } from './serviceError';

export function sumPositive_26(numbers: number[]): number {
  return numbers.filter(n => n > 0).reduce((sum, n) => sum + n, 0);
}