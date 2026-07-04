// bloom-deps:
import { ServiceError } from './serviceError';

export function sumPositive_41(numbers: number[]): number {
  return numbers.filter(num => num > 0).reduce((sum, num) => sum + num, 0);
}