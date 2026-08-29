// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  let proto = Object.getPrototypeOf(value);
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  
  return Object.getPrototypeOf(value) === proto;
}

function parseGraphqlOperation(body: unknown): {
  operationType: string;
  operationName: string | null;
  variables: Record<string, unknown>;
} {
  if (!isPlainObject(body)) {
    throw new TypeError('body must be a plain object');
  }

  const bodyObj = body as Record<string, unknown>;

  if (typeof bodyObj.query !== 'string' || bodyObj.query.length === 0) {
    throw new TypeError('query must be a non-empty string');
  }

  let queryStr = bodyObj.query;

  queryStr = queryStr.replace(/^\s+/, '');

  while (queryStr.startsWith('#')) {
    const newlineIndex = queryStr.indexOf('\n');
    if (newlineIndex === -1) {
      queryStr = '';
      break;
    }
    queryStr = queryStr.slice(newlineIndex + 1).replace(/^\s+/, '');
  }

  if (queryStr.length === 0) {
    throw new SyntaxError(
      'query does not start with a valid operation keyword'
    );
  }

  let operationType: string;
  let operationName: string | null = null;
  let remainingQuery = queryStr;

  if (queryStr.startsWith('{')) {
    operationType = 'query';
    operationName = null;
  } else {
    const keywordMatch = queryStr.match(/^(query|mutation|subscription)\b/i);
    if (!keywordMatch) {
      throw new SyntaxError(
        'query does not start with a valid operation keyword'
      );
    }

    const keyword = keywordMatch[1].toLowerCase();
    operationType = keyword;
    remainingQuery = queryStr.slice(keyword.length).replace(/^\s+/, '');

    const identifierMatch = remainingQuery.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (identifierMatch) {
      operationName = identifierMatch[1];
    } else {
      operationName = null;
    }
  }

  let variables: Record<string, unknown> = {};

  if ('variables' in bodyObj) {
    const vars = bodyObj.variables;
    if (vars !== null) {
      if (!isPlainObject(vars)) {
        throw new TypeError('variables must be a plain object');
      }
      variables = vars as Record<string, unknown>;
    }
  }

  return {
    operationType,
    operationName,
    variables,
  };
}

export { parseGraphqlOperation };