// Implementing a little lisp in TypeScript's Type System
// This is a great idea! Nothing wrong to see here!

import { Lex } from "./lexer";
import { Parse } from "./parser";

/** Prepares program for execution. */
export type Litsp<
  Str extends string,
  Chars extends string[] = [],
> = Str extends `${infer Char extends string}${infer Rest extends string}`
  ? Litsp<Rest, [...Chars, Char]>
  : Parse<Lex<Chars>>;

/*

Some notes on how I plan to implement the interpreter:

Eval: takes a node. if it’s a literal, return it. if it’s
a function call, search for it in the scope, then call it
as an HKT with its child nodes passed down

Def [ident name, ident* args, block] 
  scope[name] = EvalBlock<block, args>

EvalBlock: HKT taking a block and a list of argument names
as type parameters and the inputs and scope as HKT parameters.
Binds the arguments to the inputs in a new scope and does Eval.

*/
