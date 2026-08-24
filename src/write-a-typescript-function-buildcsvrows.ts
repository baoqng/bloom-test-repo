// bloom-deps:

export interface BuildCSVOptions {
  delimiter?: string;
  headers?: string[];
  includeHeader?: boolean;
}

export function buildCSV(
  rows: Record<string, unknown>[],
  options?: BuildCSVOptions
): string {
  // Validate that rows is an Array
  if (!Array.isArray(rows)) {
    throw new TypeError("rows must be an Array");
  }

  // Return empty string for empty rows array
  if (rows.length === 0) {
    return "";
  }

  // Set defaults
  const delimiter = options?.delimiter ?? ",";
  const includeHeader = options?.includeHeader ?? true;
  const headers =
    options?.headers ?? Object.keys(rows[0] ?? {});

  // Validate options
  if (typeof delimiter !== "string") {
    throw new TypeError("delimiter must be a non-empty string");
  }

  if (delimiter.length === 0) {
    throw new TypeError("delimiter must be a non-empty string");
  }

  if (!Array.isArray(headers)) {
    throw new TypeError("headers must be an Array");
  }

  if (typeof includeHeader !== "boolean") {
    throw new TypeError("includeHeader must be a boolean");
  }

  // Helper function to escape and quote CSV values
  const escapeCSVValue = (value: unknown): string => {
    const stringValue = String(value ?? "");

    // Check if value needs quoting
    const needsQuoting =
      stringValue.includes(delimiter) ||
      stringValue.includes("\n") ||
      stringValue.includes("\r") ||
      stringValue.includes('"') ||
      stringValue === "";

    if (needsQuoting) {
      // Escape internal double-quotes by doubling them
      const escaped = stringValue.replace(/"/g, '""');
      return `"${escaped}"`;
    }

    return stringValue;
  };

  const lines: string[] = [];

  // Add header row if includeHeader is true
  if (includeHeader) {
    const headerLine = headers
      .map((header) => escapeCSVValue(header))
      .join(delimiter);
    lines.push(headerLine);
  }

  // Add data rows
  for (const row of rows) {
    const values = headers.map((header) => {
      const value = row[header];
      return escapeCSVValue(value);
    });
    lines.push(values.join(delimiter));
  }

  // Join with CRLF line endings per RFC 4180
  return lines.join("\r\n");
}