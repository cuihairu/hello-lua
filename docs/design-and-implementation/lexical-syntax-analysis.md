# Lexical and Syntax Analysis

Lexical and syntax analysis are the core of the interpreter: they turn source code into executable bytecode.

## 1. Lexical Analysis

Lexical analysis converts source code into a sequence of tokens—the smallest meaningful units of the source, such as keywords, identifiers, operators, and delimiters.

Lua's lexer (also called the scanner) reads the source and splits it into tokens. Tokens are classified by category: keywords such as `if`, `while`, and `function`; identifiers, which name variables and functions; operators such as `+`, `-`, `*`, and `/`; delimiters such as `(`, `)`, `,`, `;`, and `=`, with `{`, `}`, `[`, and `]` used mainly in table constructors and indexing; and constants, including numbers and strings. The lexer handles the source character stream with a finite state machine, deciding how to produce each token from the current character and its context. Whitespace and comments are ignored and do not become part of a token.

Example:

```plaintext
-- source code
local a = 10 + 5

-- resulting tokens
local      -> keyword (reserved word)
a          -> name (identifier)
=          -> delimiter
10         -> number (integer literal)
+          -> operator
5          -> number (integer literal)
```

## 2. Syntax Analysis

Syntax analysis organizes the token sequence into the program's syntactic structure according to the grammar rules of the language.

Lua's parser consumes tokens one at a time with recursive descent: a group of mutually recursive functions parse the grammar rules, such as `subexpr`, `statement`, and `exprstat`. Recursive descent works for LL(1) grammars, and LL(1) itself cannot handle left recursion (it would recurse forever), so Lua's grammar has been rewritten to avoid it: expressions are parsed by precedence climbing—`subexpr` tries binary operators in order of precedence—and left-associative operators are implemented with a tail-recursion loop, which is why `a - b - c` parses correctly as `(a - b) - c`. The parser is single-pass: as soon as it recognizes a statement or expression it calls the code generator in `lcode.c` to produce bytecode, and no explicit AST is built. The parser also reports syntax errors such as unmatched parentheses or missing keywords.

Example:

```plaintext
-- source code
local a = 10 + 5

-- syntactic structure sketch (Lua does not build an AST; this only illustrates the parse levels)
LocalAssignment
├── Variable: a
└── Expression
    ├── Number: 10
    └── Binary Operation
        ├── Operator: +
        └── Number: 5
```

## Summary

Lexical analysis converts the source character stream into a token sequence; syntax analysis then organizes those tokens into program structure according to the grammar. Lua parses in a single recursive-descent pass and emits bytecode during parsing—the complete path from source to bytecode.

## References

- [Lexical analysis](https://en.wikipedia.org/wiki/Lexical_analysis)
- [Abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
- [Official Lua source repository on GitHub](https://github.com/lua/lua)

<!-- BACKLINKS-AUTO -->
## Related pages

- [core-concepts](/knowledge/core-concepts.md)
