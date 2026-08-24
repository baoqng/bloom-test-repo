// bloom-deps:

function parseMarkdownTable(markdown: string): Array<Record<string, string>> {
  if (typeof markdown !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const lines = markdown
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    throw new SyntaxError('Markdown table must have at least 2 rows (header and separator)');
  }

  const parseCells = (line: string): string[] => {
    let content = line;
    if (content.startsWith('|')) {
      content = content.slice(1);
    }
    if (content.endsWith('|')) {
      content = content.slice(0, -1);
    }
    return content.split('|').map(cell => cell.trim());
  };

  const separatorLine = lines[1];

  // Validate separator: must contain only dashes, colons, pipes, and spaces
  if (!/^[\s|:\-]+$/.test(separatorLine)) {
    throw new SyntaxError('Separator row is malformed: must contain only dashes, colons, pipes, and whitespace');
  }

  // Additional check: each cell in separator must match alignment pattern
  const separatorCells = parseCells(separatorLine);
  for (const cell of separatorCells) {
    if (!/^:?-+:?$/.test(cell)) {
      throw new SyntaxError(`Separator row is malformed: invalid cell "${cell}"`);
    }
  }

  const headers = parseCells(lines[0]);

  const result: Array<Record<string, string>> = [];

  for (let i = 2; i < lines.length; i++) {
    const cells = parseCells(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cells[j] !== undefined ? cells[j] : '';
    }
    result.push(row);
  }

  return result;
}

export { parseMarkdownTable };