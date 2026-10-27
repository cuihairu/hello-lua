# Object-oriented programming

Lua has no built-in classes or inheritance; objects, inheritance, and polymorphism are all built from tables plus metatables. This group has five pages, running from `self` through to design patterns:

- [What `self` does](/advanced/self): where the `self` that the colon shorthand passes in implicitly comes from.
- [Table-based object systems](/advanced/object-system): defining classes and creating instances with tables and metatables, plus inheritance and composition as two ways to reuse.
- [Inheritance and polymorphism](/advanced/inheritance-and-polymorphism): `__index` sets up the prototype chain; method overriding delivers polymorphism.
- [Object-oriented design patterns](/advanced/design-patterns): Lua implementations of singleton, factory, observer, strategy, and decorator.
- [Object-oriented implementation](/advanced/oop-implementation): a unified look at the `__index` indexing chain from the implementation side.

## Wrap-up

`setmetatable` creates instances, `__index` sets up inheritance, and method overriding delivers polymorphism. Lua's object-orientation introduces no new mechanism — it's all tables and metatables by convention.

## References

- [Lua 5.4 reference manual · 2.6 Metatables](https://www.lua.org/manual/5.4/manual.html#2.6)
- [Object-oriented_programming](https://en.wikipedia.org/wiki/Object-oriented_programming)
- [PIL · Object-oriented programming](https://www.lua.org/pil/13.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [README](/knowledge/README.md)
- [core-concepts](/knowledge/core-concepts.md)
