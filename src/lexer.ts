//TODO add comma for array

export type AnyToken =
  | { kind: "string"; chars: string[] }
  | { kind: "integer"; digits: number[] }
  | { kind: "identifier"; name: string[] }
  | { kind: "lbracket" }
  | { kind: "rbracket" }
  | { kind: "lparen" }
  | { kind: "rparen" };

export interface TokenMap {
  "[": "lbracket";
  "]": "rbracket";
  "(": "lparen";
  ")": "rparen";
}

type Specials =
  | Whitespace
  | keyof TokenMap
  | (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)
  | '"';

export type Whitespace = " " | "\t" | "\n";

type RemoveLeadingWhitespace<Str extends string[]> = Str extends [
  Whitespace,
  ...infer Rest extends string[],
]
  ? RemoveLeadingWhitespace<Rest>
  : Str;
type LexNumber<
  Code extends string[],
  Num extends number[] = [],
> = Code extends [
  `${infer Digit extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`,
  ...infer Rest extends string[],
]
  ? LexNumber<Rest, [...Num, Digit]>
  : [Num, Code];

type LexString<
  Code extends string[],
  Str extends string[] = [],
> = Code extends [
  "\\",
  infer Char extends string,
  ...infer Rest extends string[],
]
  ? LexString<Rest, [...Str, Char]>
  : Code extends ['"', ...infer Rest extends string[]]
  ? [Str, Rest]
  : Code extends [infer Char extends string, ...infer Rest extends string[]]
  ? LexString<Rest, [...Str, Char]>
  : never;

type LexIdent<
  Code extends string[],
  Name extends string[] = [],
> = Code extends [
  infer Char extends string,
  infer NextChar extends string,
  ...infer Rest extends string[],
]
  ? NextChar extends Specials
    ? [[...Name, Char], [NextChar, ...Rest]]
    : Char extends Specials
    ? [Name, [Char, NextChar, ...Rest]]
    : LexIdent<Rest, [...Name, Char, NextChar]>
  : [Name, Code];

export type Lex<
  Code extends string[],
  Tokens extends AnyToken[] = [],
> = Code extends ['"', ...infer Rest extends string[]]
  ? LexString<Rest> extends [
      infer Str extends string[],
      infer Rest extends string[],
    ]
    ? Lex<Rest, [...Tokens, { kind: "string"; chars: Str }]>
    : "SYNTAX ERROR! unterminated string literal"
  : Code extends [Whitespace, ...infer Rest extends string[]]
  ? Lex<RemoveLeadingWhitespace<Rest>, Tokens>
  : LexNumber<Code> extends [
      infer Num extends [number, ...number[]],
      infer Rest extends string[],
    ]
  ? Lex<Rest, [...Tokens, { kind: "integer"; digits: Num }]>
  : Code extends [infer Char extends string, ...infer Rest extends string[]]
  ? Char extends keyof TokenMap
    ? // @ts-expect-error IDK HOW TO FIX THIS STUPID TYPESCRIPT AGLDSHPOPOIEWN>XGSD;HLGH
      Lex<Rest, [...Tokens, { kind: TokenMap[Char] }]>
    : LexIdent<Code> extends [
        infer Name extends string[],
        infer Rest extends string[],
      ]
    ? Lex<Rest, [...Tokens, { kind: "identifier"; name: Name }]>
    : never
  : Tokens;

/* type CharsOf<
  S extends string,
  Chars extends string[] = [],
> = S extends `${infer Char}${infer Rest}`
  ? CharsOf<Rest, [...Chars, Char]>
  : Chars;

type Program = CharsOf<`
(def is_prime? n (
  (let result 1)
  (for (range 2 n) i (
    (if (= (% n i) 0) (
      (set result 0)
    ))
  ))
  result
))
(writeln (is_prime? 5))
(for (range 1 100) n (
  (if (is_prime? n) (
    (writeln n)
  ))
))
`>;
type Lexed = Tokenize<Program>[55];
type Test = Tokenize<CharsOf<"(for (range 2 n) i)">>;
*/
