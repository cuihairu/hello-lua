# Core Concepts

The site's concepts are grouped four ways: language basics, advanced abstractions, design and implementation, and extensions and engineering. Each item gives a conclusion and the source inside the site.

## Language basics

### Eight data types

nil, boolean, number, string, table, function, userdata, thread. In Lua 5.3 and later, number splits into integer and float; in 5.1/5.2 every number is a float. thread means a coroutine, not an operating-system thread.

Source: [Data types](/basics/data-types).

### Tables are the only data structure

Arrays, dictionaries, sets, and objects are all represented by tables, created with `{}`. Array indices start at 1, not 0; keys can be any non-nil value, and `person.name` is equivalent to `person["name"]`. Use `ipairs` to walk arrays and `pairs` for dictionaries, the latter making no order guarantee.

Source: [Tables](/basics/tables), [Using arrays and dictionaries](/basics/arrays-and-dictionaries), [Data structures](/basics/data-structures).

### Local versus global variables

`local` defines a local variable, scoped to its block and destroyed when the block ends; without `local` it is a global variable, which is Lua's default behavior and a habit to avoid. Locals are addressed directly in the virtual machine and are faster than globals.

Source: [Variables and assignment](/basics/variables).

### Operators

Seven arithmetic (`+` `-` `*` `/` `%` `^` `//`), six comparison (`==` `~=` `>` `<` `>=` `<=`), three logical (`and` `or` `not`), plus string concatenation `..` and assignment `=`. Three cross-language traps: not-equal is `~=` and not `!=`; `^` and `/` always return floats; an integer result requires `//`.

Source: [Operators and expressions](/basics/operators-and-expressions).

### Metatables and metamethods

A metatable defines the behavior of another table, attached with `setmetatable`. Common metamethods: `__index` (called when a key is absent), `__newindex` (called when assigning to an absent key), `__add`/`__sub`/`__mul` (operator overloading), `__call`, `__tostring`. Two cautions: reading or writing the raw table inside `__index`/`__newindex` recurses forever, so use `rawget`/`rawset` to bypass them; a heavy concentration of metamethods slows things down.

Source: [Metatables and metamethods](/basics/metatables-and-metamethods).

### String handling

Strings are immutable, so any modification produces a new string. Concatenate with `..`, measure length with `#`, and `string.sub`/`gsub`/`format`/`find`/`match`/`gmatch` cover the common operations. Lua has no built-in split; simulate one with `gmatch` and the pattern `([^,]+)`. Pattern matching resembles regular expressions but is not identical to them.

Source: [String handling](/basics/string-handling).

### Control structures

Conditionals are `if-then-elseif-else`; loops are `while`, `repeat-until`, and `for` (numeric and generic); `break` leaves a loop, and `return` returns. `repeat-until` exits when its condition is true, so the body runs at least once, the inverse of `while`.

Source: [Control structures](/basics/control-structures).

### Functions are first-class values

Functions can be assigned to variables, passed as parameters, and returned as values. Multiple return values, varargs `...`, and anonymous functions are supported. Closures capture and retain local variables from an enclosing function; in examples like `createCounter` the counter state lives in the closure.

Source: [Function definition and calling](/basics/functions).

## Advanced abstractions

### Closures

A closure is a function together with the local variables of the enclosing function that it references. After the outer function returns, those variables stay alive and only the closure can reach them. Each call to the outer function produces an independent closure with its own state; data encapsulation and function factories rest on this.

Source: [Closures](/advanced/closures).

### Higher-order functions and anonymous functions

A higher-order function takes a function as a parameter or returns a function; an anonymous function has no name and suits one-off use. Combined, they are the basis of functional style in Lua — `map`, `filter`, `compose`, and `makeAdder` together.

Source: [Higher-order functions](/advanced/higher-order-functions), [Anonymous functions](/advanced/anonymous-functions), [Functional programming](/advanced/functional-programming).

### Object orientation is tables plus metatables

Lua has no `class` keyword; classes and inheritance are built from tables and metatables. The standard three steps: build the class table, set `Class.__index = Class`, and in the constructor create the instance with `setmetatable({}, self)`. Inheritance is a prototype chain, so the subclass metatable is `{ __index = Parent }`. Write `self` in the constructor rather than hard-coding the class name, or subclasses cannot inherit along the chain.

Source: [Object-oriented programming](/advanced/object-oriented), [Implementing object orientation](/advanced/oop-implementation), [Table-based object system](/advanced/object-system).

### `self` and the colon shorthand

`self` is not a keyword, just a conventional parameter name that the colon passes automatically: `obj:method(a)` is equivalent to `obj.method(obj, a)`. Mixing dot and colon calls is the most frequent error — define a method with a colon and call it with a dot, and `self` is nil, which errors outright. When a method is passed as a callback, `self` is lost, so bind the object with a closure.

Source: [What `self` does](/advanced/self).

### Polymorphism and inheritance

Method lookup walks the `__index` chain of the calling object, so a subclass that defines a method of the same name naturally overrides the parent's version, with no `virtual`-style declaration. Fields live on each instance, while methods are stored once in the class table and shared by all instances.

Source: [Inheritance and polymorphism](/advanced/inheritance-and-polymorphism), [Implementing object orientation](/advanced/oop-implementation).

### Design patterns

Singleton, factory, observer, strategy, and decorator use no mechanism beyond tables and metatables: a singleton caches its instance, a factory branches on a branch to pick a constructor, an observer keeps a list of callbacks, strategy stores a function as a field, and a decorator wraps and forwards.

Source: [Object-oriented design patterns](/advanced/design-patterns).

### Sandboxing and untrusted code

Lua has no built-in sandbox, so three things are assembled by hand: the `env` parameter of `load` provides a whitelisted environment table (`io`/`os`/`package`/`debug`/`load`/`require` never go in); `debug.sethook` installs a counter hook to enforce an instruction quota and a time quota, with `collectgarbage("count")` used to observe memory usage; three holes cannot be closed — the `debug` library can read and modify hooks, C extensions bypass Lua-level checks, and interpreter-level side channels remain. Production isolation belongs at OS level (separate processes, containers, seccomp).

Source: [Sandboxing and untrusted code](/advanced/sandboxing).

### Coroutines

A coroutine is a function that can run partway, suspend, and later continue from the suspension point; it is Lua's native thread type. `coroutine.create` builds one but does not run it — `coroutine.resume` starts it — and `yield` with `resume` form a two-way data channel. There are four states: suspended, running, normal, and dead, the last an irreversible end. `coroutine.wrap` returns a resumer function rather than a coroutine object, with no error-protection layer.

Source: [Basic coroutines](/advanced/coroutines-basics), [Coroutine states and lifecycle](/advanced/coroutine-lifecycle), [Creating and using coroutines](/advanced/creating-using-coroutines).

### Coroutines versus threads

Coroutines are cooperative: they yield only at `yield`, and at any moment only one coroutine runs inside a Lua state, so there is no parallelism and usually no need to lock. Switching happens in user space and costs far less than thread switching. The price is that a blocking call (`io.read`, a synchronous network request, `os.execute`) stalls the whole process.

Source: [Coroutines versus threads](/advanced/coroutines-vs-threads), [Coroutines and concurrency](/advanced/coroutines).

### Modules and packages

A module is a Lua file that returns a table, named to match its module name and loaded with `require`. `require` searches Lua files via `package.path` and C extensions via `package.cpath`, then caches the result in `package.loaded`. For hot reloading, clear the cache entry and `require` again.

Source: [Module definition and loading](/advanced/module-definition), [Modules and packages](/advanced/modules-and-packages), [Lua package management](/advanced/package-management).

### Error handling

`pcall` returns a status and a result, `xpcall` takes an extra error-handling function, `error` raises an error, and `assert` checks a condition. Two easy-to-invert points: `1 / 0` does not error and yields `inf`, and only integer `//` or `%` with a zero divisor raises; accessing an absent key in a table only gives nil, and indexing into nil itself is what errors.

Source: [Error handling mechanism](/advanced/error-handling-mechanism), [Error handling](/advanced/error-handling), [Error types and debugging](/advanced/error-types-debugging).

## Design and implementation

### One compile pass, no AST

Lexical analysis recognizes tokens with a finite state machine, and parsing uses recursive descent (the grammar rewritten as LL(1) to avoid left recursion). The parser is single-pass: as soon as a statement or expression is recognized it is translated straight into bytecode by `lcode.c`, with no explicit AST built.

Source: [Lexical and syntax analysis](/design-and-implementation/lexical-syntax-analysis), [Implementing the Lua interpreter](/design-and-implementation/interpreter-implementation).

### Four compile-time optimizations only

The official implementation offers only constant folding, immediate instruction encoding, jump instruction backpatching, and register reuse. Common subexpression elimination, loop invariant hoisting, and inter-instruction dead-code elimination are not done, leaving them to the runtime and to JIT-capable implementations such as LuaJIT. Constant folding applies only when both operands are constants.

Source: [Code generation and optimization](/design-and-implementation/code-generation).

### A register virtual machine

The interpreter's main loop is `luaV_execute` in `lvm.c`. Registers are slots carved out of the Lua stack for the current function; instructions read and write them directly by register number, with no repeated pushing and popping as on a stack machine, so fewer instructions are needed. Each function call corresponds to one `CallInfo` structure.

Source: [VM architecture](/design-and-implementation/vm-architecture).

### Bytecode is not guaranteed portable

The same Lua version produces identical bytecode format across platforms, but the project explicitly does not guarantee that a precompiled block from `luac -o` is portable across machines — loading may fail between machines with different byte order or integer and float widths. The right approach is to recompile on the target platform.

Source: [Bytecode and virtual machine](/design-and-implementation/bytecode-and-vm).

### GC is mark-and-sweep, not reference counting

Lua uses only mark-and-sweep for object lifetime and does not use reference counting (the counting idea is borrowed in a few internal cases, such as counting references to open upvalues). The mark phase walks from root objects (global variables plus the current call stack's locals) over reachable objects, so cyclic references are handled. 5.4 offers incremental and generational modes, one at a time.

Source: [Reference counting and mark-and-sweep](/design-and-implementation/reference-counting), [Garbage collection mechanism](/design-and-implementation/garbage-collection).

### A single memory allocator

The `lua_Alloc` registered with `lua_newstate` is the only entry point for allocating and freeing objects; the default implementation is based on `realloc` and does not use a preallocated memory pool. Swapping that function in is how custom memory management is added, for example memory quotas on embedded devices. Short strings are interned, so identical content is stored once.

Source: [Memory management](/design-and-implementation/memory-management).

### How coroutines work underneath

Every coroutine is a separate `lua_State`; there is no dedicated "Coroutine" struct inside. Switching swaps only the stack pointer and `CallInfo` (which holds the instruction pointer); it neither saves nor restores CPU registers and involves no system call. `setjmp`/`longjmp` exist for error recovery only, not for coroutine switching, so coroutines can only switch cooperatively within a single thread.

Source: [Coroutines under the hood](/design-and-implementation/coroutines-implementation), [Coroutine scheduling and switching](/design-and-implementation/coroutines-scheduling).

### Implementing the module system

A module file builds a table and returns it at the end; `require` loads, runs, and returns it, with caching already built into `package.loaded`, so real projects rarely need their own cache. C extensions are loaded dynamically with `package.loadlib("mylib.so", "luaopen_mylib")`. Hot reloading clears the `package.loaded` entry and calls `require` again, but watch two failure modes: lost module state and dependencies that were not reloaded in step.

Source: [Implementing the module system](/design-and-implementation/module-system), [Hot reloading and dynamic updates](/design-and-implementation/hot-reloading), [Dynamic linking and module loading](/design-and-implementation/dynamic-linking).

### The main changes in Lua 5.5

A new `global` statement, vararg table parameters `function f(... t)`, and `table.create`; the instruction count rises from 83 to 85 with `OP_GETVARG` and `OP_ERRNNIL` added; the bytecode validation word flips, so `.luac` files compiled under 5.4 are refused outright by 5.5 and must be recompiled; GC modes split into a three-state incremental/generational scheme, and the 5.4 `setpause`/`setstepmul` options are gone. Line numbers drift between versions, so cite the version.

Source: [Lua 5.5 source analysis](/design-and-implementation/lua55-source).

### Lightweight design

The core library keeps only tables, functions, coroutines, and basic I/O, with regex and filesystem support built as separate modules loaded on demand. Low memory use comes from a unified allocator plus incremental GC and from tables as the only data structure. The embedding interface is the C API, and extensions are added as dynamically linked libraries.

Source: [Lua's lightweight design](/design-and-implementation/lightweight-design), [Design principles of Lua](/design-and-implementation/design-principles).

## Extensions and engineering

### Two-way calling through the C API

Calls between Lua and C run in both directions over the same C API. The state lifecycle has three steps: `luaL_newstate` creates, `luaL_openlibs` opens the standard library, `lua_close` closes. To call a Lua function from C: `lua_getglobal` pushes the function, `lua_pushnumber` pushes the argument, `lua_pcall` calls, `lua_tonumber` reads the return value, and `lua_pop` cleans the stack.

Source: [Interfacing C and Lua](/lua-extensions-applications/c-interaction), [Calling Lua from C](/lua-extensions-applications/calling-lua-from-c), [Mixing Lua and C](/lua-extensions-applications/mixed-programming).

### The module entry point of a C extension

`luaopen_mylib` is the entry point that `require("mylib")` calls; it must create the module table and return one value. Returning 0 makes `require` yield `true`, after which `mylib.sum` errors. On Linux, compile with `gcc -shared -fPIC -o mylib.so mylib.c -I/usr/local/include`.

Source: [Writing Lua C extensions](/lua-extensions-applications/writing-c-extensions).

### Embedding Lua in a C program

Embedding Lua in C takes only three calls: `luaL_newstate`, `luaL_openlibs`, and `luaL_dofile`. Lua scripts often act as configuration files, so users can change settings without recompiling. When cross-compiling for embedded targets, Lua's Makefile has no `CROSS` variable — pass `CC` to select the toolchain, for example `make generic CC=arm-none-eabi-gcc`.

Source: [Embedded development](/lua-extensions-applications/embedded-development), [Using Lua in embedded systems](/lua-extensions-applications/using-lua-embedded).

### LuaJIT

LuaJIT is a Lua implementation with a JIT compiler that compiles bytecode to machine code while staying highly compatible with Lua. It aligns with most Lua 5.1 features; 5.2 and 5.3 are only partly supported, so verify scripts before migrating. It ships its own GC, mark-and-sweep run incrementally, with no reference counting.

Source: [Introduction to LuaJIT](/lua-extensions-applications/introduction-to-luajit), [LuaJIT](/lua-extensions-applications/luajit), [LuaJIT performance optimization](/lua-extensions-applications/luajit-optimization).

### The FFI library

FFI lets Lua scripts call C functions and use C data structures directly, skipping the step of writing a C plugin. The main path has three steps: `ffi.cdef` declares function prototypes and structs, `ffi.load` loads the shared library, then call it. The declaration must match the real signature, since a type or memory mismatch crashes the process.

Source: [Using LuaJIT's FFI library](/lua-extensions-applications/ffi-library).

### Optimizing scripts

Prefer local variables; let `table.concat` handle concatenating many strings; tune GC with `collectgarbage("setpause"/"setstepmul")` to match the real allocation rhythm; precompile scripts to bytecode with `luac` before packaging. Hand the performance-critical parts to C or LuaJIT.

Source: [Lua optimization techniques](/lua-best-practices/optimization-techniques), [Deployment and release](/lua-best-practices/deployment).

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.2)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.6)
- [Lua_(programming_language)](https://en.wikipedia.org/wiki/Lua_(programming_language))

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [glossary](/glossary.md)
