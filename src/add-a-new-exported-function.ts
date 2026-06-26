// bloom-deps: zod
import { ZodIssue } from 'zod';

export function summariseZodIssues(issues: ZodIssue[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const path =
      issue.path.length > 0
        ? issue.path.join('.')
        : 'root';
    const message = issue.message;
    return `${path}: ${message}`;
  });
}