# Lua Resources and Community

These are the entry points I commonly use when looking up Lua documentation, tools, and community material. When verifying language and API behavior, I usually start with the official manual and then look at community discussion.

## 1. Official Resources

The official Lua website <https://www.lua.org/> publishes releases, news, and official documentation. The Lua 5.4 reference manual <https://www.lua.org/manual/5.4/> is the authoritative definition of the language and standard library, and all APIs referenced on this site follow it. Source archives for each version are at <https://www.lua.org/ftp/>, and you can also browse the core source online at <https://www.lua.org/source/>; the GitHub mirror is at <https://github.com/lua/lua>.

## 2. Documentation and Community Sites

The lua-users wiki (<http://lua-users.org/wiki/>, external community site) is a community-maintained knowledge base with user-contributed tutorials and tips, including LuaCurses, SandBoxes, and OptimisingUsingLocalVariables. A community translation of the Lua 5.4 manual in Chinese can be found by searching for "lua 5.4 中文手册" on GitHub, with the official manual as the source of truth. When I need to quickly verify small snippets, I use the online demo on the Lua website (<https://www.lua.org/demo.html>).

## 3. Tools and Package Management

- LuaRocks: <https://luarocks.org/> is Lua's package manager; use it to install third-party libraries:

  ```bash
  luarocks install luafilesystem
  ```

- LuaJIT: <https://luajit.org/>, a high-performance Lua implementation bundled with the FFI library; source at <https://github.com/LuaJIT/LuaJIT>.
- ZeroBrane Studio: <https://studio.zerobrane.com/>, a lightweight Lua IDE with a built-in debugger.
- EmmyLua / Lua language server: provides completion, jump-to-definition, and static checking for editors such as VS Code.

## 4. Community and Help Channels

- lua-l mailing list: <https://www.lua.org/lua-l.html>, the official mailing list where Lua's authors and core maintainers are active, discussing language design, internals, and version evolution.
- GitHub: search `lua`-related projects; the issue trackers of third-party libraries are the first place to report compatibility problems.
- Stack Overflow: ask with the `lua` tag; past Q&A covers the large majority of common errors.
- Chinese communities: Yunfeng's translation of the *Lua 5.3 reference manual* and related blogs, plus game development communities (such as the Lua topics on Zhihu and Juejin), are where Chinese material is concentrated.

## 5. Common Reference Books

- *Programming in Lua* (4th edition, Lua 5.3), written by the official author; the 1st edition is free to read on the official site: <https://www.lua.org/pil/>.
- *Lua Programming (2nd edition)*, the Chinese translation of the 1st edition.
- Chinese books such as *Lua Design and Implementation* / *Lua Source Code Analysis*, covering the virtual machine and GC internals.

## My Lookup Order

I usually check the language, standard library, and C API parts of the official manual first, then install libraries with LuaRocks to work on a small project, and then combine the `lua-users wiki` with the source code to look at internals such as the virtual machine and garbage collection. When a concrete problem arises, I verify against the official manual and the lua-l mailing list archives. The source code reading order and paper notes are in [Further reading and references](/appendix/further-reading).

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua download page](https://www.lua.org/download.html)
- [LuaRocks package manager homepage](https://luarocks.org/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [further-reading](further-reading.md)
- [glossary](/glossary.md)
- [README](/knowledge/README.md)
- [books](/knowledge/books.md)
- [official-docs](/knowledge/official-docs.md)
