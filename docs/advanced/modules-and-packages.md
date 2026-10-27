# Modules and packages

Modules and packages solve code organization and reuse. A Lua module is a file that returns a table; package management revolves around the standard library's `package` library and third-party tools. This group has three pages:

- [Defining and loading modules](/advanced/module-definition): how to write modules, and how `require` looks up paths and caches.
- [Lua package management](/advanced/package-management): the four fields of the `package` library, LuaRocks, and dependency handling.
- [Common Lua modules](/advanced/common-modules): third-party libraries such as Penlight, LuaSocket, and LuaFileSystem.

The five modules that come with the standard library — `table`, `string`, `math`, `io`, `os` — each get their own page in the basics section; for updating modules at runtime, see [Hot reloading and dynamic updates](/design-and-implementation/hot-reloading).

## Wrap-up

`require` takes care of both loading and caching for modules; the only places you usually need to step in are path configuration and cache clearing.

## References

- [Lua 5.4 reference manual · 6.3 Table library](https://www.lua.org/manual/5.4/manual.html#6.3)
- [Module_(computer_science)](https://en.wikipedia.org/wiki/Module_(computer_science))
- [Package_(software)](https://en.wikipedia.org/wiki/Package_(software))

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [README](/knowledge/README.md)
- [core-concepts](/knowledge/core-concepts.md)
