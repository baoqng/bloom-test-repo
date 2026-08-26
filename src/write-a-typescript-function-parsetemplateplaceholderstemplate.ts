// bloom-deps:

export function parseTemplatePlaceholders(template: unknown): string[] {
  // Type check: throw TypeError for non-string input
  if (typeof template !== "string") {
    throw new TypeError("Expected a string");
  }

  const placeholders: string[] = [];
  const seen = new Set<string>();
  let i = 0;

  while (i < template.length) {
    // Look for opening {{
    if (template[i] === "{" && template[i + 1] === "{") {
      i += 2;

      // Find the closing }}
      let closingIndex = -1;
      for (let j = i; j < template.length - 1; j++) {
        if (template[j] === "}" && template[j + 1] === "}") {
          closingIndex = j;
          break;
        }
      }

      // If no closing }} found, throw error
      if (closingIndex === -1) {
        throw new SyntaxError("Unclosed placeholder");
      }

      // Extract the key
      const key = template.substring(i, closingIndex);

      // Check for empty placeholder
      if (key.length === 0) {
        throw new SyntaxError("Empty placeholder found");
      }

      // Validate key contains only alphanumerics and underscores
      if (!/^[A-Za-z0-9_]+$/.test(key)) {
        throw new SyntaxError(
          "Placeholder key must contain only alphanumerics and underscores"
        );
      }

      // Add to result if not already seen (deduplicate, first occurrence wins)
      if (!seen.has(key)) {
        placeholders.push(key);
        seen.add(key);
      }

      // Move past the closing }}
      i = closingIndex + 2;
    } else {
      i++;
    }
  }

  return placeholders;
}