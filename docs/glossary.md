# Lua Glossary

This glossary collects the core terms used across this site for the Lua language core, runtime implementation, engineering practice, and the LuaJIT ecosystem. Each entry gives a bilingual (Chinese-English) reference, a one-sentence definition, an authoritative source, and related pages.

**Maintenance rule**: new entries must cite a clickable authoritative source; if none can be found, write "no authoritative source found (to be verified)" and do not invent a link from memory.

## Language Core

### Values and Types (值与类型)
Lua is a dynamically typed language with eight basic types: nil, boolean, number, string, table, function, userdata, thread.
**Source**: [Lua 5.4 manual §2.2](https://www.lua.org/manual/5.4/manual.html#2.2), [Wikipedia · Dynamic typing](https://en.wikipedia.org/wiki/Dynamic_typing)
**Related pages**: [basics/data-types](/basics/data-types), [knowledge/core-concepts](/knowledge/core-concepts)

### Table (表)
Lua's only data structure: an associative array that can implement arrays, dictionaries, objects, namespaces, and modules.
**Source**: [Lua 5.4 manual §2.2](https://www.lua.org/manual/5.4/manual.html#2.2), [Wikipedia · Associative array](https://en.wikipedia.org/wiki/Associative_array)
**Related pages**: [basics/tables](/basics/tables), [basics/data-structures](/basics/data-structures)

### Metatable (元表)
A table that defines a table's custom behavior under specific operations; the cornerstone of Lua metaprogramming and object orientation.
**Source**: [Lua 5.4 manual §2.6](https://www.lua.org/manual/5.4/manual.html#2.6), [PIL chapter 11](https://www.lua.org/pil/11.html)
**Related pages**: [basics/metatables-and-metamethods](/basics/metatables-and-metamethods), [advanced/object-system](/advanced/object-system)

### Metamethod (元方法)
A field in a metatable named with a double underscore (such as `__index`, `__newindex`, `__add`) that intercepts the corresponding operation.
**Source**: [Lua 5.4 manual §2.6](https://www.lua.org/manual/5.4/manual.html#2.6)
**Related pages**: [basics/metatables-and-metamethods](/basics/metatables-and-metamethods), [advanced/oop-implementation](/advanced/oop-implementation)

### Closure (闭包)
A function that captures outer local variables (upvalues); Lua functions are first-class, and closures are the basic building block of modularity.
**Source**: [Lua 5.4 manual §2.4](https://www.lua.org/manual/5.4/manual.html#2.4), [Wikipedia · Closure](https://en.wikipedia.org/wiki/Closure_(computer_programming))
**Related pages**: [advanced/closures](/advanced/closures), [advanced/anonymous-functions](/advanced/anonymous-functions)

### First-class Function (一等函数)
A function can be stored, passed, and returned; this is the precondition for Lua's functional programming.
**Source**: [Wikipedia · First-class function](https://en.wikipedia.org/wiki/First-class_function), [Lua 5.4 manual §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)
**Related pages**: [advanced/functional-programming](/advanced/functional-programming), [advanced/higher-order-functions](/advanced/higher-order-functions)

### Coroutine (协程)
A suspendable and resumable execution flow; Lua implements cooperative concurrency with the thread type and the coroutine library.
**Source**: [Lua 5.4 manual §2.5](https://www.lua.org/manual/5.4/manual.html#2.5), [PIL chapter 10](https://www.lua.org/pil/10.html), [Wikipedia · Coroutine](https://en.wikipedia.org/wiki/Coroutine)
**Related pages**: [advanced/coroutines](/advanced/coroutines), [design-and-implementation/coroutines-design](/design-and-implementation/coroutines-design)

### Tail Call (尾调用)
A call at the end of a function can reuse its stack frame; Lua 5.4 correctly implements tail-call elimination, so recursion does not overflow the stack.
**Source**: [Wikipedia · Tail call](https://en.wikipedia.org/wiki/Tail_call), [Lua 5.4 manual §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)
**Related pages**: [basics/functions](/basics/functions), [advanced/coroutine-best-practices](/advanced/coroutine-best-practices)

### Lexical Scope (词法作用域)
Name visibility is determined by source structure; Lua's upvalue capture of local variables depends on it.
**Source**: [Wikipedia · Scope](https://en.wikipedia.org/wiki/Scope_(computer_science))
**Related pages**: [basics/variables](/basics/variables), [advanced/closures](/advanced/closures)

### Multiple Assignment (多重赋值)
Lua supports assigning several variables at once; extra variables get nil and extra values are discarded.
**Source**: [Lua 5.4 manual §2.2](https://www.lua.org/manual/5.4/manual.html#2.2), [PIL chapter 2](https://www.lua.org/pil/2.html)
**Related pages**: [basics/syntax](/basics/syntax), [knowledge/pitfalls](/knowledge/pitfalls)

### Upvalue (上值)
An outer local variable captured by a closure; in Lua 5.2+ an upvalue belongs explicitly to the closure.
**Source**: [Lua 5.4 manual §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)
**Related pages**: [advanced/closures](/advanced/closures), [advanced/anonymous-functions](/advanced/anonymous-functions)

## Runtime and Implementation

### Virtual Machine (虚拟机)
After compilation to bytecode, a Lua program is interpreted and executed on a register-based virtual machine.
**Source**: [Wikipedia · Virtual machine](https://en.wikipedia.org/wiki/Virtual_machine), [Wikipedia · Bytecode](https://en.wikipedia.org/wiki/Bytecode)
**Related pages**: [design-and-implementation/bytecode-and-vm](/design-and-implementation/bytecode-and-vm), [design-and-implementation/vm-architecture](/design-and-implementation/vm-architecture)

### Bytecode (字节码)
The output of `luac` and the VM instruction set; `luac -l` disassembles it for inspection.
**Source**: [Wikipedia · Bytecode](https://en.wikipedia.org/wiki/Bytecode), [Lua source repository](https://github.com/lua/lua)
**Related pages**: [design-and-implementation/code-generation](/design-and-implementation/code-generation), [design-and-implementation/bytecode-and-vm](/design-and-implementation/bytecode-and-vm)

### Garbage Collection (垃圾回收)
Lua 5.4 uses a generational GC by default, with an incremental mode also available; it is tuned through `collectgarbage` and `lua_State` parameters.
**Source**: [Lua 5.4 manual §2.7](https://www.lua.org/manual/5.4/manual.html#2.7), [Wikipedia · Garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))
**Related pages**: [design-and-implementation/garbage-collection](/design-and-implementation/garbage-collection), [lua-best-practices/gc-tuning](/lua-best-practices/gc-tuning)

### Weak Table (弱引用表)
A table marked by the `__mode` metamethod field whose keys or values can be collected by the GC; the idiomatic choice for caches and object registries.
**Source**: [Lua 5.4 manual §2.7](https://www.lua.org/manual/5.4/manual.html#2.7), [Wikipedia · Weak reference](https://en.wikipedia.org/wiki/Weak_reference)
**Related pages**: [design-and-implementation/garbage-collection](/design-and-implementation/garbage-collection), [lua-best-practices/gc-tuning](/lua-best-practices/gc-tuning)

### C API (C API)
The C interface for embedding Lua in a host program: stack-based data exchange, `lua_State` lifetime, and the registry.
**Source**: [Lua 5.4 manual §4](https://www.lua.org/manual/5.4/manual.html#4)
**Related pages**: [lua-extensions-applications/c-interaction](/lua-extensions-applications/c-interaction), [lua-extensions-applications/calling-lua-from-c](/lua-extensions-applications/calling-lua-from-c)

### Just-in-time Compilation (即时编译)
At runtime, hot code is compiled to machine code; LuaJIT implements this with trace compilation.
**Source**: [Wikipedia · JIT](https://en.wikipedia.org/wiki/Just-in-time_compilation), [Wikipedia · Tracing JIT](https://en.wikipedia.org/wiki/Tracing_just-in-time_compilation)
**Related pages**: [lua-extensions-applications/luajit](/lua-extensions-applications/luajit), [lua-extensions-applications/luajit-optimization](/lua-extensions-applications/luajit-optimization)

### Register Machine (寄存器机)
The Lua VM passes operands in registers rather than on a stack; compared with a stack machine it uses fewer instructions.
**Source**: [Wikipedia · Register machine](https://en.wikipedia.org/wiki/Register_machine), [Wikipedia · Stack machine](https://en.wikipedia.org/wiki/Stack_machine)
**Related pages**: [design-and-implementation/vm-architecture](/design-and-implementation/vm-architecture)

### Dynamic Linking (动态链接)
`luaopen_*` plus `package.loadlib` load binary extension modules at runtime.
**Source**: [Lua 5.4 manual §8](https://www.lua.org/manual/5.4/manual.html#8), [Wikipedia · Dynamic linking](https://en.wikipedia.org/wiki/Dynamic_linking)
**Related pages**: [design-and-implementation/dynamic-linking](/design-and-implementation/dynamic-linking), [advanced/modules-and-packages](/advanced/modules-and-packages)

## Engineering Practice

### Module (模块)
The code unit loaded by `require`; since Lua 5.1 the convention is that a chunk returns a table.
**Source**: [Lua 5.4 manual §6.3](https://www.lua.org/manual/5.4/manual.html#6.3), [Wikipedia · Module](https://en.wikipedia.org/wiki/Module_(computer_science))
**Related pages**: [advanced/module-definition](/advanced/module-definition), [design-and-implementation/module-system](/design-and-implementation/module-system)

### LuaRocks (LuaRocks)
Lua's de facto standard package manager and module distribution repository.
**Source**: [LuaRocks official site](https://luarocks.org/)
**Related pages**: [advanced/package-management](/advanced/package-management), [appendix/resources](/appendix/resources)

### Sandbox (沙箱)
Trims capabilities such as os/io/load to confine untrusted code to a restricted environment.
**Source**: [Lua 5.4 manual §2.7](https://www.lua.org/manual/5.4/manual.html#2.7), [Wikipedia · Sandbox](https://en.wikipedia.org/wiki/Sandbox_(computer_security))
**Related pages**: [advanced/sandboxing](/advanced/sandboxing)

### Error Handling (错误处理)
`error` throws and `pcall`/`xpcall` catches; error objects keep their type across boundaries.
**Source**: [Lua 5.4 manual §2.4](https://www.lua.org/manual/5.4/manual.html#2.4), [Wikipedia · Exception handling](https://en.wikipedia.org/wiki/Exception_handling)
**Related pages**: [advanced/error-handling](/advanced/error-handling), [knowledge/pitfalls](/knowledge/pitfalls)

### Stack Trace (栈回溯)
The `debug.traceback` argument of `xpcall` gives the failing call chain.
**Source**: [Wikipedia · Stack trace](https://en.wikipedia.org/wiki/Stack_trace)
**Related pages**: [advanced/error-types-debugging](/advanced/error-types-debugging), [lua-best-practices/debugging-tools](/lua-best-practices/debugging-tools)

### Metaprogramming (元编程)
Changes the behavior of language constructs at runtime through metatables (inheritance, operator overloading, lazy loading).
**Source**: [Wikipedia · Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming)
**Related pages**: [advanced/object-system](/advanced/object-system), [advanced/oop-implementation](/advanced/oop-implementation)

### Prototype-based Programming (原型继承)
Lua has no classes: objects are derived by copying objects (the metatable `__index` chain).
**Source**: [Wikipedia · Prototype-based programming](https://en.wikipedia.org/wiki/Prototype-based_programming), [PIL chapter 13](https://www.lua.org/pil/13.html)
**Related pages**: [advanced/object-oriented](/advanced/object-oriented), [advanced/inheritance-and-polymorphism](/advanced/inheritance-and-polymorphism)

## LuaJIT Ecosystem

### LuaJIT (LuaJIT)
A tracing JIT implementation of the Lua 5.1 dialect, a mainstream runtime alongside the lua.org interpreter.
**Source**: [LuaJIT official site](https://luajit.org/luajit.html), [Wikipedia · LuaJIT](https://en.wikipedia.org/wiki/LuaJIT)
**Related pages**: [lua-extensions-applications/luajit](/lua-extensions-applications/luajit), [lua-extensions-applications/introduction-to-luajit](/lua-extensions-applications/introduction-to-luajit)

### FFI (Foreign Function Interface)
LuaJIT's direct-call facility for C type declarations and external functions, avoiding C glue code.
**Source**: [LuaJIT FFI documentation](https://luajit.org/ext_ffi.html), [LuaJIT FFI API](https://luajit.org/ext_ffi_api.html)
**Related pages**: [lua-extensions-applications/ffi-library](/lua-extensions-applications/ffi-library), [lua-extensions-applications/mixed-programming](/lua-extensions-applications/mixed-programming)

### Trace Compiler (追踪编译器)
The mechanism by which LuaJIT records hot paths as linear traces and compiles them to machine code.
**Source**: [LuaJIT optimization documentation](https://luajit.org/ext_jit.html), [Wikipedia · Tracing JIT](https://en.wikipedia.org/wiki/Tracing_just-in-time_compilation)
**Related pages**: [lua-extensions-applications/luajit-optimization](/lua-extensions-applications/luajit-optimization)

---

**Maintenance rule**: new entries must cite a clickable authoritative source; if none can be found, write "no authoritative source found (to be verified)" and do not invent a link from memory.

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](/knowledge/README.md)
