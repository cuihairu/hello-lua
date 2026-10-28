# Source Code, Papers, and Further Reading

These are the materials I have used or noted down while researching Lua design, source code, and engineering questions, grouped by topic for easy reference.

## 1. Papers: Understanding Design Decisions

*The Evolution of Lua* (Roberto Ierusalimschy et al., HOPL III, 2007) describes Lua's evolution from 1993 to 2005, explaining why Lua chose tables as its only data structure and why it prioritizes embedding. *The Implementation of Lua 5.0* (JUCS, 2005) systematically introduces Lua's register-based virtual machine, hash table implementation, and function calling conventions; it is the classic reference for the bytecode and virtual machine chapters: <https://www.lua.org/doc/jucs05.pdf>. *Revisiting Coroutines* (ACM TOPLAS, 2009) discusses the semantic differences between symmetric and asymmetric coroutines and is relevant to the coroutine topics on this site.

## 2. Official Manual and Source Code Reading

- Lua 5.5 reference manual: <https://www.lua.org/manual/5.5/>; Chapter 2 (language) and Chapter 3 (standard library) cover the new-version language and library changes. Older manuals (such as [5.4](https://www.lua.org/manual/5.4/)) are still maintained at their original addresses.
- Source code reading route (about 30 thousand lines of C, with fewer core files):
  1. `llex.c` / `lparser.c` / `lcode.c`: lexing, parsing, and code generation, producing bytecode directly without an AST;
  2. `lopcodes.h` / `lvm.c`: instruction encoding and the VM main loop `luaV_execute`;
  3. `lgc.c`: implementation of incremental mark-and-sweep and generational collection;
  4. `lapi.c` / `lstate.c`: C API and `lua_State` (coroutine thread) management;
  5. `ldo.c`: call stack and error handling (setjmp/longjmp).
- Source code browsing online: <https://www.lua.org/source/>, or the GitHub mirror <https://github.com/lua/lua>; the site's [Lua 5.5 source analysis](/design-and-implementation/lua55-source) walks through v5.5.1 file by file and can serve as a companion to this route.

## 3. Books

The 4th edition of *Programming in Lua* is the language book written by Lua's official author, Roberto Ierusalimschy; the 4th edition corresponds to Lua 5.3. The 1st edition is free: <https://www.lua.org/pil/>. *Lua Design and Implementation* (in Chinese) uses the 5.1/5.3 source code as its main thread to explain lexing, the virtual machine, and GC. The Interpreter / Bytecode chapters of *Game Programming Patterns* (Robert Nystrom) explain the motivation and trade-offs of a bytecode virtual machine in plain language.

## 4. Tooling in Practice

- `luac -l -l`: shows the real bytecode the compiler generates and is the first-hand tool for verifying virtual machine claims:

  ```bash
  echo 'local a = 10 + 5' > /tmp/t.lua
  luac -l -l /tmp/t.lua
  ```

- `collectgarbage("count")` / `collectgarbage("step")`: observe GC behavior and the memory curve.
- LuaJIT's `jit.dump` and `-jp` profiler: inspect trace compilation and sampling results, and understand the difference between JIT and the interpreter.

## 5. Community Resources

The LuaImplementations entry on the lua-users wiki (<http://lua-users.org/wiki/LuaImplementations>) compares the various Lua implementations, including Lua, LuaJIT, Ravi, and PUC Lua derivatives. The LuaJIT extensions documentation (<https://luajit.org/extensions.html>) explains FFI, the `bit` library, and the differences from Lua 5.1/5.2/5.3. awesome-lua (<https://github.com/LewisJEllis/awesome-lua>) is a list of third-party libraries and tools.

## My Source Code Reading Order

When reading source code, I first look at the actual bytecode with `luac -l -l`, then read *The Implementation of Lua 5.0* to fill in the principles, and then go down the route "parser -> virtual machine -> GC -> C API"; when questions arise, I check the official manual. This order ties together several implementation topics. Tool installation and community help channels are in [Lua resources and community](/appendix/resources).

## References

- [PIL · Advanced topics](https://www.lua.org/pil/14.html)
- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua (programming language)](https://en.wikipedia.org/wiki/Lua_(programming_language))

<!-- BACKLINKS-AUTO -->
## Related pages

- [resources](resources.md)
- [README](/knowledge/README.md)
- [books](/knowledge/books.md)
- [official-docs](/knowledge/official-docs.md)
