# Knowledge Overview

The site's 103 pages are recorded by section; these pages fold the material I have gathered into five lists: concepts, books, official documentation, applications, and pitfalls. Each item carries a conclusion and a backlink into the site, and the original pages remain the source of detail. Terminology in Chinese and English, plus sources, for the language core, runtime and implementation, engineering practice, and the LuaJIT ecosystem is in the [glossary](/glossary).

## Topic pages

| Page | Folded content | Items |
| --- | --- | --- |
| [Core concepts](/knowledge/core-concepts) | Four groups: language basics, advanced abstractions, design and implementation, extensions and engineering | 35 |
| [Highlights from key books](/knowledge/books) | 4 books and 3 papers: title, author, matching knowledge points | 7 |
| [Highlights from official docs](/knowledge/official-docs) | lua.org manuals, source code, LuaJIT, LuaRocks and third-party repositories | 21 |
| [Use cases](/knowledge/applications) | Eight areas: games, embedded, web, configuration, and more | 21 |
| [Common pitfalls](/knowledge/pitfalls) | Eight groups: syntax, metatables, coroutines, GC, implementation-layer misconceptions | 40 |

## Conventions

- Sources are the individual site pages and the appendix resource pages; items with no verifiable basis are marked "source unconfirmed".
- Version baseline: language examples target Lua 5.4, and 5.5 content is measured against the v5.5.1 source.

## Inventory correction log

The cleanup also surfaced a few inconsistencies inside the site; all were fixed on 2026-10-10:

- The compile pipeline on the [Design and implementation](/design-and-implementation/README) overview page (wrongly written as an AST plus dead-code elimination) and its GC wording (wrongly listing reference counting) were rewritten to match the measured findings on the dedicated pages.
- [Setup](/basics/setup) was turned into a navigation page, with installation and IDE detail pointed at the dedicated pages and a missing closing section added.
- The arithmetic operators on [Basic syntax](/basics/syntax) now include `//`, matching the claim of seven.
- "Lua code deployment" and [Deployment and release](/lua-best-practices/deployment) overlapped heavily; the duplicate page was removed and the topic unified under the latter.
- The 5.5 year on [Lua history and development](/basics/history-and-development) was checked against the official versions page and corrected to 2025.

## Duplicate page resolution log

The inventory found 8 groups of overlapping pages, resolved on 2026-10-10 under the following rules: check each group for a true duplicate or a complementary pair; if one draft of a shared topic covers the other, delete the covered page; if they are complementary, fold the scattered notes into the main page; leave group pages that own sidebar child pages in place and rewrite them as navigation pages. Group-by-group conclusions:

| Group | Pages | Verdict | Action |
| --- | --- | --- | --- |
| 1 | [Data structures](/basics/data-structures) | All four sections of the group page duplicated the child pages verbatim | Group page became a navigation page; all four child pages kept |
| 2 | [Error handling](/advanced/error-handling) | Every section of the group page was covered by a child page (pcall/xpcall had the same draft; error types and debugging were covered in more detail elsewhere) | Group page became a navigation page; the error-handling mechanism and error types and debugging pages are complementary and both kept |
| 3 | [Object-oriented programming](/advanced/object-oriented) | The three sections of the group page were each covered by a child page (same Dog class draft, more complete Animal/Cat, two fewer patterns) | Group page became a navigation page; all five child pages kept |
| 4 | [Modules and packages](/advanced/modules-and-packages) | Each section of the group page was covered by child pages and the hot-reloading page | Group page became a navigation page; the five standard-library module lists were folded into the navigation page |
| 5 | [Performance optimization](/lua-best-practices/performance-optimization) | Seven sections matched the optimization-techniques page, but each page had unique content (complementary) | Unique notes (`table.insert` and pre-allocation, metatable overhead) folded into [Lua optimization techniques](/lua-best-practices/optimization-techniques) (now 11 sections); group page became a navigation page |
| 6 | [Testing and debugging](/lua-best-practices/testing-debugging) | The four sections of the group page were covered by child pages and the error-handling mechanism page | Group page became a navigation page; both child pages kept |
| 7 | [Code style and standards](/lua-best-practices/code-style) | Four sections matched the coding-standards page; the group page had a few unique details (complementary) | Unique details (global variable prefixes, camelCase table names, splitting functions) folded into [Lua coding standards](/lua-best-practices/coding-standards); group page became a navigation page |
| 8 | [Lua resources and community](/appendix/resources), [Further reading and references](/appendix/further-reading) | Complementary: one page covers installation and support channels, the other covers papers, source-reading notes and bytecode measurement tools; overlap is limited to widely accepted official links | Both pages kept, with cross-links added |
| Cross-group | Lua script optimization (deleted) | Same topic with different drafts and one side covered: sections on function calls, strings, GC, debugging and LuaJIT scattered across the optimization-techniques page, the debugging-tools page and the LuaJIT performance optimization page | Unique substance folded into the optimization-techniques page (nested tables, object pools); `luac` precompilation moved to the deployment page; the "cache loop lengths first" note was dropped as inconsistent with for-loop boundary semantics (measured in Lua 5.4); the knowledge base entries were corrected to match |

Group pages (the sidebar primary links that own child pages) were not deleted for this reason: they are the navigation anchors for the whole group, and removing them would break the structure. Once the duplicated body text is removed, the navigation page keeps the group's entry points and a closing sentence, so its navigational job is unchanged.

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html)
- [PIL · Getting Started](https://www.lua.org/pil/1.html)

## Related pages

- [core-concepts](core-concepts.md)
