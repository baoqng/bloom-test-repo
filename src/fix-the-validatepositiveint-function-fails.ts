import { ServiceError } from './errors';

export function validatePositiveInt(n: number): boolean {
  if (n === null || n === undefined) {
    return false;
  }
  return Number.isInteger(n) && n > 0;
}