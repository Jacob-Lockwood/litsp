> **Warning:** This is a work in progress!! None of the stuff I wrote below this line has been implemented yet, and a lot of it is probably going to change!!

# Litsp

## What is this?

I'm making a programming language. But what's special about this project isn't the language itself. It's that I'm writing all parts of the interpreter inside of TypeScript's Type System. Not TypeScript, the language that compiles to JavaScript, but it's surprisingly powerful type system. Programs written in this language are fully interpreted at compile time.

## Why?

I felt like it.

## What's the language like?

It's a Lisp dialect (as the name suggests) because I didn't feel like implementing [the shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm) in a literal type system.

Since the language runs at compile-time, it can't have any side-effects other than outputting.

Here's a demo of some litsp code, inside a TypeScript file:

```typescript
type Program = Litsp<`

(def is_prime? n (
  (let result 1)
  (for (range 2 n) i (
    (if (= (% n i) 0) (
      (set result 0)
    ))
  ))
  result
))
(writeln (is_prime? 57))
(writeln (is_prime? 59))

`>;
type Output = RunLitsp<Program>;
//   ^? Output is 0\n1\n
```

## Is it Turing Complete?

Probably not, since TypeScript's Type System has a recursion depth of 999 iterations. But I'd be happy to be proved wrong by someone smarter than I.
