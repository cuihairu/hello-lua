# Highlights from Key Books

Book and paper citations are scattered across the prose and the appendix; this page keeps the sources, authors, related knowledge points, and the matching site notes in one place for easy lookup.

## Books

### *Programming in Lua* (4th edition)

A language book by Roberto Ierusalimschy, an official Lua author; the 4th edition targets Lua 5.3. The 1st edition is free to read on the official site: <https://www.lua.org/pil/>.

Related knowledge points: language-level detail — data types, tables and metatables, closures, coroutines, modules.

Site pages: [Data types](/basics/data-types), [Metatables and metamethods](/basics/metatables-and-metamethods), [Closures](/advanced/closures).

### *Lua Programming* (2nd edition)

The Chinese translation of the 1st edition of *Programming in Lua*.

Related knowledge points: language basics.

Site pages: [Basic syntax](/basics/syntax).

### *Lua Design and Implementation* / *Dissecting the Lua Source*

Chinese books that use the Lua 5.1/5.3 source as their backbone, covering lexical analysis, the virtual machine, and garbage collection.

Related knowledge points: interpreter implementation, virtual machine, GC.

Site pages: [Design and implementation](/design-and-implementation/README), [Lua 5.5 source analysis](/design-and-implementation/lua55-source).

### *Game Programming Patterns*

By Robert Nystrom. Its Interpreter / Bytecode chapters explain the motivation and trade-offs of a bytecode virtual machine in plain language.

Related knowledge points: bytecode and virtual machine.

Site pages: [Bytecode and virtual machine](/design-and-implementation/bytecode-and-vm).

## Papers

### The Evolution of Lua

Roberto Ierusalimschy and others, HOPL III, 2007. Covers Lua's evolution from 1993 to 2005 and explains why Lua chose the table as its only data structure and why embedding came first.

Related knowledge points: history and design philosophy.

Site pages: [Lua history and development](/basics/history-and-development), [Lua design principles](/design-and-implementation/design-principles).

### The Implementation of Lua 5.0

JUCS, 2005. A systematic look at Lua's register virtual machine, hash table implementation, and function calling convention. <https://www.lua.org/doc/jucs05.pdf>

Related knowledge points: VM architecture, bytecode, calling conventions.

Site pages: [VM architecture](/design-and-implementation/vm-architecture), [Bytecode and virtual machine](/design-and-implementation/bytecode-and-vm).

### Revisiting Coroutines

ACM TOPLAS, 2009. Discusses the semantic difference between symmetric and asymmetric coroutines.

Related knowledge points: coroutine semantics and design.

Site pages: [Coroutines and concurrency](/advanced/coroutines), [The design behind coroutines](/design-and-implementation/coroutines-design).

## Sources

Book and paper information comes from the appendix pages [Resources and community](/appendix/resources) and [Further reading and references](/appendix/further-reading); authorship and publication details follow those two pages.

## References

- [PIL · Getting Started](https://www.lua.org/pil/1.html)
- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua_(programming_language)](https://en.wikipedia.org/wiki/Lua_(programming_language))

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
