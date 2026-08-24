// bloom-deps:

function parseExpression(expression: string): number {
  if (typeof expression !== 'string') throw new TypeError('Expected string');

  const trimmed = expression.trim();
  if (trimmed === '') throw new SyntaxError('Empty input');

  // Tokenize
  type Token =
    | { type: 'number'; value: number }
    | { type: 'operator'; value: string }
    | { type: 'lparen' }
    | { type: 'rparen' };

  const tokens: Token[] = [];
  let i = 0;
  while (i < trimmed.length) {
    const ch = trimmed[i];

    if (ch === ' ' || ch === '\t' || ch === '\n') {
      i++;
      continue;
    }

    if (ch >= '0' && ch <= '9' || ch === '.') {
      let numStr = '';
      while (i < trimmed.length && (trimmed[i] >= '0' && trimmed[i] <= '9' || trimmed[i] === '.')) {
        numStr += trimmed[i];
        i++;
      }
      const num = parseFloat(numStr);
      if (isNaN(num)) throw new SyntaxError(`Invalid number: ${numStr}`);
      tokens.push({ type: 'number', value: num });
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    throw new SyntaxError(`Unexpected character: ${ch}`);
  }

  // Handle unary minus: convert to unary operator 'u-'
  // A '-' is unary if it's the first token, or preceded by an operator or '('
  const processedTokens: Token[] = [];
  for (let j = 0; j < tokens.length; j++) {
    const tok = tokens[j];
    if (tok.type === 'operator' && tok.value === '-') {
      const prev = processedTokens[processedTokens.length - 1];
      if (prev === undefined || prev.type === 'operator' || prev.type === 'lparen') {
        // Unary minus: represent as special operator
        processedTokens.push({ type: 'operator', value: 'u-' });
        continue;
      }
    }
    processedTokens.push(tok);
  }

  // Validate: check for consecutive binary operators
  for (let j = 0; j < processedTokens.length; j++) {
    const tok = processedTokens[j];
    if (tok.type === 'operator' && tok.value !== 'u-') {
      const prev = processedTokens[j - 1];
      // consecutive binary operators: previous is also a binary operator
      if (prev && prev.type === 'operator' && prev.value !== 'u-') {
        throw new SyntaxError('Consecutive operators');
      }
    }
  }

  // Shunting-yard algorithm
  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
    'u-': 4,
  };

  const rightAssociative = new Set(['^', 'u-']);

  const outputQueue: number[] = [];
  const operatorStack: string[] = [];

  function applyOperator(op: string): void {
    if (op === 'u-') {
      if (outputQueue.length < 1) throw new SyntaxError('Invalid expression');
      const a = outputQueue.pop()!;
      outputQueue.push(-a);
    } else {
      if (outputQueue.length < 2) throw new SyntaxError('Invalid expression');
      const b = outputQueue.pop()!;
      const a = outputQueue.pop()!;
      switch (op) {
        case '+': outputQueue.push(a + b); break;
        case '-': outputQueue.push(a - b); break;
        case '*': outputQueue.push(a * b); break;
        case '/':
          if (b === 0) throw new RangeError('Division by zero');
          outputQueue.push(a / b);
          break;
        case '^': outputQueue.push(Math.pow(a, b)); break;
        default: throw new SyntaxError(`Unknown operator: ${op}`);
      }
    }
  }

  for (const tok of processedTokens) {
    if (tok.type === 'number') {
      outputQueue.push(tok.value);
    } else if (tok.type === 'operator') {
      const op = tok.value;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top === '(') break;
        if (top === undefined) break;
        const topPrec = precedence[top] ?? 0;
        const opPrec = precedence[op] ?? 0;
        if (topPrec > opPrec || (topPrec === opPrec && !rightAssociative.has(op))) {
          operatorStack.pop();
          applyOperator(top);
        } else {
          break;
        }
      }
      operatorStack.push(op);
    } else if (tok.type === 'lparen') {
      operatorStack.push('(');
    } else if (tok.type === 'rparen') {
      let foundLparen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop()!;
        if (top === '(') {
          foundLparen = true;
          break;
        }
        applyOperator(top);
      }
      if (!foundLparen) throw new SyntaxError('Mismatched parentheses');
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top === '(' || top === ')') throw new SyntaxError('Mismatched parentheses');
    applyOperator(top);
  }

  if (outputQueue.length !== 1) throw new SyntaxError('Invalid expression');

  return outputQueue[0];
}

export { parseExpression };