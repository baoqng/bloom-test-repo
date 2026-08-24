// bloom-deps:

export function parseExpression(expression: string): number {
  if (typeof expression !== 'string') {
    throw new TypeError('expression must be a string');
  }

  const trimmed = expression.trim();
  if (trimmed.length === 0) {
    throw new SyntaxError('expression must not be empty');
  }

  // Tokenize
  const tokens = tokenize(trimmed);

  // Shunting-yard
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  let prevToken: Token | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'number') {
      outputQueue.push(token);
      prevToken = token;
    } else if (token.type === 'operator') {
      let op = token.value;

      // Detect unary minus: occurs at start, or after '(' or after another operator
      if (op === '-' && (prevToken === null || prevToken.type === 'lparen' || prevToken.type === 'operator')) {
        // Unary minus — treat as 'u-'
        token.value = 'u-';
        token.precedence = 4; // Higher than *, / but below ^
        token.rightAssociative = true;
        operatorStack.push(token);
        prevToken = token;
        continue;
      }

      // Check for consecutive binary operators
      if (prevToken === null || prevToken.type === 'operator' || prevToken.type === 'lparen') {
        // Only unary minus is allowed here; any other operator is invalid
        throw new SyntaxError(`Unexpected operator '${op}' at position ${token.pos}`);
      }

      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'operator' &&
          (
            (top.precedence! > token.precedence!) ||
            (top.precedence === token.precedence && !token.rightAssociative)
          )
        ) {
          outputQueue.push(operatorStack.pop()!);
        } else {
          break;
        }
      }

      operatorStack.push(token);
      prevToken = token;
    } else if (token.type === 'lparen') {
      // Check for invalid placement: number followed by '(' without operator
      if (prevToken !== null && prevToken.type === 'number') {
        throw new SyntaxError(`Unexpected '(' at position ${token.pos}`);
      }
      operatorStack.push(token);
      prevToken = token;
    } else if (token.type === 'rparen') {
      let foundLParen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'lparen') {
          foundLParen = true;
          operatorStack.pop();
          break;
        }
        outputQueue.push(operatorStack.pop()!);
      }
      if (!foundLParen) {
        throw new SyntaxError('Mismatched parentheses: unexpected \')\'');
      }
      prevToken = token;
    }
  }

  // Check that last token is valid for end of expression
  if (prevToken === null || prevToken.type === 'operator') {
    throw new SyntaxError('Expression ends with an operator');
  }

  // Pop remaining operators
  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'lparen' || top.type === 'rparen') {
      throw new SyntaxError('Mismatched parentheses: missing \')\'');
    }
    outputQueue.push(top);
  }

  // Evaluate RPN
  return evaluateRPN(outputQueue);
}

interface Token {
  type: 'number' | 'operator' | 'lparen' | 'rparen';
  value: string;
  pos: number;
  precedence?: number;
  rightAssociative?: boolean;
}

function getOperatorInfo(op: string): { precedence: number; rightAssociative: boolean } {
  switch (op) {
    case '+':
    case '-':
      return { precedence: 1, rightAssociative: false };
    case '*':
    case '/':
      return { precedence: 2, rightAssociative: false };
    case '^':
      return { precedence: 3, rightAssociative: true };
    default:
      throw new SyntaxError(`Unknown operator: '${op}'`);
  }
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number (integer or decimal)
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < expression.length && /[0-9]/.test(expression[i + 1]))) {
      let numStr = '';
      const startPos = i;
      while (i < expression.length && /[0-9.]/.test(expression[i])) {
        numStr += expression[i];
        i++;
      }
      // Validate number format
      if ((numStr.match(/\./g) || []).length > 1) {
        throw new SyntaxError(`Invalid number '${numStr}' at position ${startPos}`);
      }
      const num = parseFloat(numStr);
      if (isNaN(num)) {
        throw new SyntaxError(`Invalid number '${numStr}' at position ${startPos}`);
      }
      tokens.push({ type: 'number', value: numStr, pos: startPos });
      continue;
    }

    // Operators
    if (['+', '-', '*', '/', '^'].includes(ch)) {
      const info = getOperatorInfo(ch);
      tokens.push({
        type: 'operator',
        value: ch,
        pos: i,
        precedence: info.precedence,
        rightAssociative: info.rightAssociative,
      });
      i++;
      continue;
    }

    // Parentheses
    if (ch === '(') {
      tokens.push({ type: 'lparen', value: '(', pos: i });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')', pos: i });
      i++;
      continue;
    }

    throw new SyntaxError(`Unexpected character '${ch}' at position ${i}`);
  }

  return tokens;
}

function evaluateRPN(tokens: Token[]): number {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'operator') {
      if (token.value === 'u-') {
        // Unary minus
        if (stack.length < 1) {
          throw new SyntaxError('Invalid expression: insufficient operands for unary minus');
        }
        const a = stack.pop()!;
        stack.push(-a);
      } else {
        // Binary operator
        if (stack.length < 2) {
          throw new SyntaxError('Invalid expression: insufficient operands for operator');
        }
        const b = stack.pop()!;
        const a = stack.pop()!;

        switch (token.value) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            if (b === 0) {
              throw new RangeError('Division by zero');
            }
            stack.push(a / b);
            break;
          case '^':
            stack.push(Math.pow(a, b));
            break;
          default:
            throw new SyntaxError(`Unknown operator: '${token.value}'`);
        }
      }
    }
  }

  if (stack.length !== 1) {
    throw new SyntaxError('Invalid expression: too many operands');
  }

  return stack[0];
}