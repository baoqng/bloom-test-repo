// bloom-deps: zod@^4

import { z } from 'zod';

type ZodIssue = z.ZodIssue;
type ZodError<T = any> = z.ZodError<T>;

type FlattenedError<T, U = string> = {
  [P in keyof T]?: U;
} & {
  _root?: U;
};

export function flattenError<T>(
  error: ZodError<T>
): FlattenedError<T, string>;

export function flattenError<T, U>(
  error: ZodError<T>,
  mapper?: (issue: ZodIssue) => U
): FlattenedError<T, U>;

export function flattenError<T, U>(
  error: ZodError<T>,
  mapper = (issue: ZodIssue): U => issue.message as U
): FlattenedError<T, U> {
  const fieldErrors: Record<PropertyKey, U> = {};
  const processedPaths = new Set<string>();

  for (const issue of error.issues) {
    if (issue.path.length === 0) {
      // Root-level error: use _root key
      if (!processedPaths.has('_root')) {
        fieldErrors['_root'] = mapper(issue);
        processedPaths.add('_root');
      }
    } else {
      // Nested field error: use dot-notation path as key
      const pathKey = issue.path.join('.');
      
      // Only use first error message for each path
      if (!processedPaths.has(pathKey)) {
        fieldErrors[pathKey] = mapper(issue);
        processedPaths.add(pathKey);
      }
    }
  }

  return fieldErrors as FlattenedError<T, U>;
}