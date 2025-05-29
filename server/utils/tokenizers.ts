export function tokenizeCode(code: string, language: string): string[] {
  // Remove comments and normalize whitespace
  const cleanedCode = removeComments(code, language);
  
  switch (language) {
    case "javascript":
      return tokenizeJavaScript(cleanedCode);
    case "python":
      return tokenizePython(cleanedCode);
    case "java":
      return tokenizeJava(cleanedCode);
    case "cpp":
      return tokenizeCpp(cleanedCode);
    case "csharp":
      return tokenizeCSharp(cleanedCode);
    default:
      return tokenizeGeneric(cleanedCode);
  }
}

function removeComments(code: string, language: string): string {
  switch (language) {
    case "javascript":
    case "java":
    case "cpp":
    case "csharp":
      // Remove single-line comments
      code = code.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      code = code.replace(/\/\*[\s\S]*?\*\//g, '');
      break;
    case "python":
      // Remove single-line comments
      code = code.replace(/#.*$/gm, '');
      // Remove triple-quoted strings (docstrings)
      code = code.replace(/"""[\s\S]*?"""/g, '');
      code = code.replace(/'''[\s\S]*?'''/g, '');
      break;
  }
  return code;
}

function tokenizeJavaScript(code: string): string[] {
  const keywords = [
    'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch',
    'finally', 'throw', 'class', 'extends', 'constructor', 'super', 'this',
    'new', 'typeof', 'instanceof', 'in', 'of', 'import', 'export', 'from',
    'async', 'await', 'promise', 'null', 'undefined', 'true', 'false'
  ];

  const operators = [
    '++', '--', '+=', '-=', '*=', '/=', '%=', '==', '===', '!=', '!==',
    '<=', '>=', '&&', '||', '=>', '?', ':', '+', '-', '*', '/', '%',
    '=', '<', '>', '!', '&', '|', '^', '~', '<<', '>>'
  ];

  return tokenizeWithRules(code, keywords, operators);
}

function tokenizePython(code: string): string[] {
  const keywords = [
    'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue',
    'return', 'try', 'except', 'finally', 'raise', 'with', 'as', 'import',
    'from', 'in', 'is', 'and', 'or', 'not', 'lambda', 'yield', 'global',
    'nonlocal', 'assert', 'del', 'pass', 'None', 'True', 'False'
  ];

  const operators = [
    '+=', '-=', '*=', '/=', '//=', '%=', '**=', '&=', '|=', '^=',
    '>>=', '<<=', '==', '!=', '<=', '>=', '//', '**', '+', '-', '*',
    '/', '%', '=', '<', '>', '&', '|', '^', '~', '<<', '>>'
  ];

  return tokenizeWithRules(code, keywords, operators);
}

function tokenizeJava(code: string): string[] {
  const keywords = [
    'public', 'private', 'protected', 'static', 'final', 'abstract', 'class',
    'interface', 'extends', 'implements', 'package', 'import', 'void', 'int',
    'double', 'float', 'char', 'boolean', 'String', 'if', 'else', 'for',
    'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return',
    'try', 'catch', 'finally', 'throw', 'throws', 'new', 'this', 'super',
    'null', 'true', 'false'
  ];

  const operators = [
    '++', '--', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<=', '>=',
    '&&', '||', '!', '+', '-', '*', '/', '%', '=', '<', '>', '&', '|',
    '^', '~', '<<', '>>', '>>>'
  ];

  return tokenizeWithRules(code, keywords, operators);
}

function tokenizeCpp(code: string): string[] {
  const keywords = [
    'int', 'double', 'float', 'char', 'bool', 'void', 'string', 'vector',
    'class', 'struct', 'public', 'private', 'protected', 'virtual', 'static',
    'const', 'volatile', 'mutable', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'default', 'break', 'continue', 'return', 'try',
    'catch', 'throw', 'new', 'delete', 'this', 'true', 'false', 'nullptr',
    'include', 'using', 'namespace', 'std', 'cout', 'cin', 'endl'
  ];

  const operators = [
    '++', '--', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<=', '>=',
    '&&', '||', '!', '+', '-', '*', '/', '%', '=', '<', '>', '&', '|',
    '^', '~', '<<', '>>', '->', '::', '.*', '->*'
  ];

  return tokenizeWithRules(code, keywords, operators);
}

function tokenizeCSharp(code: string): string[] {
  const keywords = [
    'public', 'private', 'protected', 'internal', 'static', 'readonly',
    'const', 'volatile', 'class', 'struct', 'interface', 'enum', 'namespace',
    'using', 'void', 'int', 'double', 'float', 'decimal', 'char', 'bool',
    'string', 'object', 'var', 'if', 'else', 'for', 'foreach', 'while',
    'do', 'switch', 'case', 'default', 'break', 'continue', 'return',
    'try', 'catch', 'finally', 'throw', 'new', 'this', 'base', 'null',
    'true', 'false', 'is', 'as', 'typeof', 'sizeof', 'checked', 'unchecked'
  ];

  const operators = [
    '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=',
    '>>=', '==', '!=', '<=', '>=', '&&', '||', '!', '+', '-', '*', '/',
    '%', '=', '<', '>', '&', '|', '^', '~', '<<', '>>', '??', '?.', '=>'
  ];

  return tokenizeWithRules(code, keywords, operators);
}

function tokenizeWithRules(code: string, keywords: string[], operators: string[]): string[] {
  const tokens: string[] = [];
  
  // Create a regex pattern that matches operators, identifiers, numbers, and punctuation
  const operatorPattern = operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const tokenPattern = new RegExp(
    `(${operatorPattern})|([a-zA-Z_][a-zA-Z0-9_]*)|([0-9]+(?:\\.[0-9]+)?)|([{}();,\\[\\].])|([\\s]+)`,
    'g'
  );

  let match;
  while ((match = tokenPattern.exec(code)) !== null) {
    const token = match[0];
    
    // Skip whitespace
    if (/^\s+$/.test(token)) {
      continue;
    }
    
    // Normalize identifiers that are not keywords to generic IDENTIFIER
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token) && !keywords.includes(token)) {
      tokens.push('IDENTIFIER');
    } else if (/^[0-9]+(?:\.[0-9]+)?$/.test(token)) {
      tokens.push('NUMBER');
    } else {
      tokens.push(token);
    }
  }

  return tokens;
}

function tokenizeGeneric(code: string): string[] {
  // Fallback tokenizer for unknown languages
  const tokens: string[] = [];
  const tokenPattern = /([a-zA-Z_][a-zA-Z0-9_]*)|([0-9]+(?:\.[0-9]+)?)|([{}();,\[\].])|([+\-*/=<>!&|^~%]+)|(\s+)/g;

  let match;
  while ((match = tokenPattern.exec(code)) !== null) {
    const token = match[0];
    
    // Skip whitespace
    if (!/^\s+$/.test(token)) {
      tokens.push(token);
    }
  }

  return tokens;
}
