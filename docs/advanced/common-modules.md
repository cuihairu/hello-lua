# Common Lua modules

The Lua community has a number of commonly used modules, covering data structures, networking, files, JSON, and more. This page picks the eight most common, with the install command and a documentation link for each.

## 1. Penlight

Penlight is a feature-rich toolkit that fills in the gaps of the standard library: linked lists, queues, stacks, and other data structures; enhanced file read/write; extended string manipulation; plus common utilities like sets and maps. Install with `luarocks install penlight`; see the [Penlight GitHub page](https://github.com/lunarmodules/Penlight) for documentation.

## 2. LuaSocket

LuaSocket handles network programming. It supports TCP, UDP, HTTP, SMTP, and more; packet send/receive and URL parsing are built in, so network application development almost always leans on it. Install with `luarocks install luasocket`; see the [LuaSocket GitHub page](https://github.com/lunarmodules/luasocket) for documentation.

## 3. LuaFileSystem

LuaFileSystem rounds out file system operations: creating, deleting, moving, and renaming files and directories; reading file sizes and modification times; recursively walking directories and their contents. Install with `luarocks install luafilesystem`; see the [LuaFileSystem GitHub page](https://github.com/lunarmodules/luafilesystem) for documentation.

## 4. Lua CJSON

Lua CJSON is a JSON encode/decode library implemented in C. Parsing and serialization are fast, and it's how you convert between Lua tables and JSON strings. Install with `luarocks install lua-cjson`; see the [Lua CJSON GitHub page](https://github.com/mpx/lua-cjson) for documentation.

## 5. Luarocks

Luarocks is itself a Lua module, but it's used more often as the tool for managing other Lua modules: installing modules from the command line, resolving dependencies automatically, and managing module versions and updates. You can download and install it from the [Luarocks site](https://luarocks.org/); the repository is on the [Luarocks GitHub page](https://github.com/luarocks/luarocks).

## 6. LuaJIT

LuaJIT is a high-performance implementation of Lua, compatible with Lua 5.1 and equipped with a JIT compiler that significantly speeds up execution; the FFI library also lets you call C functions directly and access C data structures. Install with `luarocks install luajit` or download from the [LuaJIT site](https://luajit.org/); see the [LuaJIT wiki](https://luajit.org/) for documentation.

## 7. Luasql

Luasql is a database access library supporting multiple databases including SQLite, MySQL, and PostgreSQL, with complete interfaces for establishing connections, executing queries and updates, and handling result sets. Install drivers as needed — for example, SQLite3 uses `luarocks install luasql-sqlite3`; see the [LuaSQL GitHub page](https://github.com/lunarmodules/luasql) for documentation.

## 8. Copas

Copas is a coroutine-driven asynchronous networking library supporting TCP and HTTP servers. Its non-blocking I/O is built on Lua coroutines, making it well suited to network applications that need high concurrency. Install with `luarocks install copas`; see the [Copas GitHub page](https://github.com/keplerproject/copas) for documentation.

## Summary

These eight modules cover data structures, networking, file systems, JSON, databases, and runtime execution. All of them can be installed through LuaRocks — grab what you need as you go.

## References

- [Lua 5.4 reference manual · 6.1 Basic library](https://www.lua.org/manual/5.4/manual.html#6.1)
- [Lua 5.4 reference manual · 6.2 Coroutine library](https://www.lua.org/manual/5.4/manual.html#6.2)
- [Lua 5.4 reference manual · 6.3 Table library](https://www.lua.org/manual/5.4/manual.html#6.3)
- [Lua official documentation index](https://www.lua.org/docs.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [modules-and-packages](modules-and-packages.md)
- [official-docs](/knowledge/official-docs.md)
