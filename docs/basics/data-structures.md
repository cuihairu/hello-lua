# Data Structures

Lua provides exactly one data structure: the table. Arrays, dictionaries, and more complicated arrangements are all built on it. This group has four pages:

- [Tables](/basics/tables): creating tables, array and dictionary usage, nested tables.
- [Metatables and metamethods](/basics/metatables-and-metamethods): `setmetatable`, `__index`/`__newindex`, operator overloading.
- [String handling](/basics/string-handling): concatenation, substrings, formatting, pattern matching.
- [Arrays and dictionaries](/basics/arrays-and-dictionaries): 1-based arrays, associative arrays, mixed tables.

## Wrap-up

A table with integer keys is an array; a table with string keys is a dictionary. To change how a table behaves, use a metatable; to work with text, use the `string` library. That is the whole toolkit Lua gives you for data.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [Associative_array](https://en.wikipedia.org/wiki/Associative_array)
- [Hash_table](https://en.wikipedia.org/wiki/Hash_table)
- [PIL · Tables](https://www.lua.org/pil/12.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [README](/knowledge/README.md)
- [core-concepts](/knowledge/core-concepts.md)
