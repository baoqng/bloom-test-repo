// bloom-deps:
import { ServiceError } from './serviceError';

export function sumPositive_16(numbers: number[]): number {
  return numbers.filter(n => n > 0).reduce((acc, n) => acc + n, 0);
}