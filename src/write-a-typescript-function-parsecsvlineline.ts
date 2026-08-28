// bloom-deps:

export function parseCSVLine(line: unknown): string[] {
  if (typeof line !== "string") {
    throw new TypeError("line must be a string");
  }

  const fields: string[] = [];
  let i = 0;
  const len = line.length;

  while (i <= len) {
    // At the start of a field
    if (i === len) {
      // Empty trailing field after a comma
      fields.push("");
      break;
    }

    if (line[i] === '"') {
      // Quoted field
      i++; // skip opening quote
      let value = "";
      let closed = false;

      while (i < len) {
        if (line[i] === '"') {
          if (i + 1 < len && line[i + 1] === '"') {
            // Escaped double-quote
            value += '"';
            i += 2;
          } else {
            // Closing quote
            i++; // skip closing quote
            closed = true;
            break;
          }
        } else {
          value += line[i];
          i++;
        }
      }

      if (!closed) {
        throw new RangeError("quoted field is not properly closed");
      }

      fields.push(value);

      // After closing quote, expect comma or end of string
      if (i < len) {
        if (line[i] === ",") {
          i++; // skip comma
          // If this comma is the last character, we need to add an empty field
          if (i === len) {
            fields.push("");
            break;
          }
        }
        // If not comma and not end, continue (handle whatever comes next)
      } else {
        // End of string
        break;
      }
    } else {
      // Unquoted field — read until comma or end
      let value = "";
      while (i < len && line[i] !== ",") {
        value += line[i];
        i++;
      }
      fields.push(value);

      if (i < len && line[i] === ",") {
        i++; // skip comma
        if (i === len) {
          // Trailing comma — add empty field
          fields.push("");
          break;
        }
      } else {
        // End of string
        break;
      }
    }
  }

  // Handle empty string — should return one empty field
  if (line.length === 0) {
    return [""];
  }

  return fields;
}