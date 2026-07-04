// bloom-deps:
import { ServiceError } from './serviceError';

export function sumPositive_46(numbers: number[]): number {
  return numbers.filter(num => num > 0).reduce((acc, num) => acc + num, 0);
}