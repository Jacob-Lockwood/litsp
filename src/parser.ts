import type { AnyToken, Lex } from "./lexer";

export type LitspNode =
  | { kind: "ident"; name: string[] }
  | { kind: "string"; chars: string[] }
  | { kind: "integer"; digits: number }
  | LitspNode[];

// Huge thanks to T6 for basically writing this type for me!
export type Parse<
  Tokens extends AnyToken[],
  Stacks extends unknown[][] = [],
  CurrentStack extends unknown[] = [],
> = Tokens extends [{ kind: "lparen" }, ...infer Rest extends AnyToken[]]
  ? Parse<Rest, [CurrentStack, ...Stacks], []>
  : Tokens extends [{ kind: "rparen" }, ...infer Rest extends AnyToken[]]
  ? Stacks extends [
      infer Previous extends unknown[],
      ...infer S extends unknown[][],
    ]
    ? Parse<Rest, S, [...Previous, CurrentStack]>
    : never
  : Tokens extends [
      infer First extends unknown,
      ...infer Rest extends AnyToken[],
    ]
  ? Parse<Rest, Stacks, [...CurrentStack, First]>
  : Stacks extends []
  ? CurrentStack
  : "SYNTAX ERROR! unbalanced parentheses";

type CharsOf<
  S extends string,
  Chars extends string[] = [],
> = S extends `${infer Char}${infer Rest}`
  ? CharsOf<Rest, [...Chars, Char]>
  : Chars;

type Lexed = Lex<
  CharsOf<`
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
`>
>;
type Parsed = Parse<Lexed>;
