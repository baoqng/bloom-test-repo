// bloom-deps: zod@^3

export function summariseZodIssues(issues: { path: (string | number)[]; message: string }[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const pathString = issue.path.length === 0 
      ? "root" 
      : issue.path.map(segment => String(segment)).join(".");
    
    return `${pathString}: ${issue.message}`;
  });
}