// bloom-deps:

export function parseJsonLines(input: unknown): Array<{ line: number; data: unknown } | { line: number; error: string }> {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const result: Array<{ line: number; data: unknown } | { line: number; error: string }> = [];
  const lines = input.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const lineContent = lines[i];
    
    // Skip empty lines and lines containing only whitespace
    if (!lineContent.trim()) {
      continue;
    }
    
    // Attempt to parse the line as JSON
    try {
      const data = JSON.parse(lineContent);
      result.push({ line: lineNumber, data });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      result.push({ line: lineNumber, error: errorMessage });
    }
  }
  
  return result;
}