// bloom-deps:

function escapeCSVValue(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);
  const needsQuoting =
    str.includes(delimiter) ||
    str.includes('\n') ||
    str.includes('\r') ||
    str.includes('"');

  if (needsQuoting) {
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return str;
}

export function buildCSV(
  rows: Record<string, unknown>[],
  options?: {
    delimiter?: string;
    headers?: string[];
    includeHeader?: boolean;
  }
): string {
  if (!Array.isArray(rows)) {
    throw new TypeError('rows must be an Array');
  }

  if (rows.length === 0) {
    return '';
  }

  const delimiter = options?.delimiter ?? ',';
  const includeHeader = options?.includeHeader !== undefined ? options.includeHeader : true;

  const columns: string[] =
    options?.headers && options.headers.length > 0
      ? options.headers
      : Object.keys(rows[0]);

  const lines: string[] = [];

  if (includeHeader) {
    const headerLine = columns
      .map((col) => escapeCSVValue(col, delimiter))
      .join(delimiter);
    lines.push(headerLine);
  }

  for (const row of rows) {
    const rowLine = columns
      .map((col) => escapeCSVValue(row[col], delimiter))
      .join(delimiter);
    lines.push(rowLine);
  }

  return lines.join('\r\n') + '\r\n';
}