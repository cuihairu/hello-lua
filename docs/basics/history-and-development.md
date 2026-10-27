# History and Development of Lua

Lua is a lightweight, efficient, embeddable scripting language. This section covers its origins, the way the versions evolved, and where it is used today.

## 1. Origins

Lua was created in 1993 by the Computer Graphics Technology Group (Tecgraf) at the Pontifical Catholic University of Rio de Janeiro in Brazil. Its background traces back to two earlier projects: **DEL (Data Entry Language)** and **SOL (Simple Object Language)**.

Both DEL and SOL were built for Petrobras, the Brazilian national oil company, to configure and extend computer applications. Their limitations pushed Tecgraf to start over from scratch, and Lua came out of that. *Lua* means "moon" in Portuguese, and the team chose the name to signal the hope for something lightweight and flexible.

The original goal was straightforward: make Lua something you could drop into a C program to extend an application's behavior, without rewriting existing C code.

## 2. How Lua evolved

Since the first release in 1993, Lua has gone through several major versions, and every revision follows the same line: stay small, while making embedding stronger.

Lua 1.0 in 1993 offered the basic syntax and simple structures like tables; automatic garbage collection was built in from the very start. The 2.x line of 1994-1995 added *fallbacks* to extend semantics and began to support object-oriented-style programming.

3.0 in 1997 replaced fallbacks with *tag methods* — the direct ancestor of today's metamethod mechanism — and 3.1 added anonymous functions and closures implemented through upvalues. 4.0 in 2000 brought support for multiple Lua states, a re-entrant C API, and the first `for` statement.

5.0 in 2003 was a big one: coroutines, full lexical scoping, metatables and a real boolean type let Lua do non-blocking programming, and the modularization story was strengthened. 5.1 in 2006 brought a new module system (the `module` function and the `package` library) plus incremental garbage collection, and extended the metatable mechanism to values of every type. 5.2 in 2011 added the `_ENV` environment mechanism, a `goto` statement and ephemeron tables, with yieldable `pcall` and metamethods.

5.3 in 2015 added an integer type, bitwise operators and a utf-8 string library, which widened where it could be applied. 5.4 in 2020 added a generational mode for garbage collection, the `const` variable attribute, and to-be-closed variables.

5.5 in 2025 handed global-variable management to the language: the `global` statement supports explicit declarations and `<const>` read-only ones, for-loop control variables became read-only, and variadic arguments can be declared as a table directly (`function f(... t)`). Garbage collection now runs as incremental plus generational (minor/major) with three states, and the parameters can be tuned at runtime.

## 3. Where Lua is used

Gaming is the best-known use case: *World of Warcraft*, *Angry Birds* and *Dark Souls* all wrote game logic in Lua. Game logic can be changed while the game is running, without recompiling the whole game — that is the main reason it was picked.

Embedded systems are drawn to its memory footprint and execution efficiency. You find Lua in configuration scripts for routers and home appliances, and in some drone flight-control systems.

Whenever the requirement is a small, fast scripting language that can live inside a host program, Lua is still a common choice.

From 1993 to now, the versions keep changing while the positioning never has: small, fast, embeddable.

## References

- [Lua_(programming_language)](https://en.wikipedia.org/wiki/Lua_(programming_language))
- [Markup_language](https://en.wikipedia.org/wiki/Markup_language)
- [Lua 5.4 reference manual](https://www.lua.org/manual/5.4/manual.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [philosophy-and-features](philosophy-and-features.md)
- [README](/knowledge/README.md)
- [applications](/knowledge/applications.md)
- [books](/knowledge/books.md)
