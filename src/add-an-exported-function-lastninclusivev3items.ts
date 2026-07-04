// bloom-deps:

import { filterByMinimumScore } from './utils';

export function lastNInclusiveV3(items: number[], n: number): number[] {
  if (n <= 0) return [];
  if (n >= items.length) return items.slice();
  const start = items.length - n;
  return items.slice(start);
}