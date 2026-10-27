# Common Pitfalls

Every trap in the site is gathered into one list, grouped by theme, with a correct answer and a source for each item. Items with no verifiable basis are marked "source unconfirmed".

## Syntax and types

- Array indices start at 1, not 0. Coming from a zero-indexed language, this is where you trip first.
- Not-equal is `~=` and not `!=`; `^` and `/` always return floats (`10/5` gives `2.0`), and an integer result requires `//`.
- `1 / 0` does not error and yields `inf`; `0 / 0` gives `nan`. Only integer `//` or `%` with a zero divisor raises. To fail on division by zero you must check explicitly.
- `//` and `%` both round toward negative infinity: `-1 // 2` is -1 and `-1 % 2` is 1.
- Strings are immutable, so any "modification" produces a new string; `string.len`/`string.sub` work on bytes, so truncating Chinese text breaks characters mid-codepoint — use the `utf8` library for UTF-8.
- Lua has no built-in split; simulate one with `string.gmatch` and the pattern `([^,]+)`.
- `pairs` walks the hash part in no fixed order and must not be used as an ordered traversal; `ipairs` walks from 1 contiguously and stops at the first nil; `#t` gives no defined result for a sparse table with holes, so do not treat it as "the element count".
- Without `local`, a variable is global. That is the default behavior and a habit to avoid.

Source: [Operators and expressions](/basics/operators-and-expressions), [FAQ](/appendix/faq), [String handling](/basics/string-handling), [Lua standard library reference](/appendix/standard-library).

## Tables and metatables

- After `t[{}] = "value"`, `t[{}]` reads back nil: every `{}` creates a new table, so the write and the read use two different objects. A table used as a key must be kept in a local variable and reused.
- Reading or writing the raw table inside an `__index`/`__newindex` metamethod recurses forever; use `rawget`/`rawset` to bypass it.
- Neither `pairs` nor `#` walks the `__index` chain: `pairs(instance)` cannot see methods on the class, and fields inherited from a parent do not count toward `#`.
- A table can have only one metatable; a second `setmetatable` replaces it wholesale, and the previously attached chain is lost silently.
- Once `__newindex` is defined it takes over all writes, so ordinary assignment no longer lands in the table; use `rawset` to write into the table itself.

Source: [Common coding mistakes](/lua-best-practices/coding-mistakes), [Metatables and metamethods](/basics/metatables-and-metamethods), [Implementing object orientation](/advanced/oop-implementation).

## Object orientation

- Mixing dot and colon calls is the most frequent error: calling a colon-defined method with a dot leaves `self` as nil and raises `attempt to index a nil value`; defining with a dot and calling with a colon shifts the arguments.
- Forgetting `Class.__index = Class`: the metatable is attached, but lookup stops at the instance and no method is found there.
- Calling a parent method of the same name from a subclass requires passing self explicitly (`Account.withdraw(self, amount)`); writing `Account:withdraw(amount)` passes the Account table itself as self.
- Hard-coding the class name in a constructor (`setmetatable({}, Dog)`) attaches every subclass instance to the parent; write `setmetatable({}, self)` instead.
- When a method is passed as a callback, `self` is lost — bind the object with a closure or supply it manually at the call site.

Source: [What `self` does](/advanced/self), [Implementing object orientation](/advanced/oop-implementation).

## Coroutines

- `coroutine.wrap` has no error-protection layer, so an error inside the coroutine is thrown straight at the caller; for fault tolerance use `create` plus `resume` and check the first return value.
- Resuming a dead coroutine yields `cannot resume dead coroutine` — it neither crashes nor runs — so a scheduler must remove the coroutine from its task list when it dies.
- A blocking call (`io.read`, a synchronous network request, `os.execute`) stalls the whole process, and nothing else in the process can run.
- Coroutines are not parallel: at any moment only one coroutine runs inside a Lua state, so coroutines do nothing to raise computational throughput.
- A Lua state machine is not thread-safe; multi-threaded access needs external locking or a separate state machine per thread.

Source: [Coroutine use cases and best practices](/advanced/coroutine-best-practices), [Coroutines versus threads](/advanced/coroutines-vs-threads).

## Modules

- The `module` function was removed in Lua 5.2; do not write it.
- A module file that forgets to `return` makes `require` yield `true`; a C extension whose `luaopen_mylib` returns 0 has the same effect.
- After changing a module file, if the `package.loaded` cache is not cleared, `require` still returns the old version. Hot reloading is clearing the cache and calling `require` again, but mind lost module state and dependencies not reloaded in step.

Source: [Lua coding standards](/lua-best-practices/coding-standards), [Writing Lua C extensions](/lua-extensions-applications/writing-c-extensions), [Module definition and loading](/advanced/module-definition), [Hot reloading and dynamic updates](/design-and-implementation/hot-reloading).

## Error handling

- A failed `io.open` does not raise; it returns `nil, errmsg`, so `pcall(io.open, ...)` cannot catch "file not found" — the real error is the later `read` call on nil. Check the return value first.
- `error` appends location information to the message by default; a second argument of 0 removes the prefix, and 2 uses the caller's location.
- Accessing an absent key in a table only gives nil and does not error; only indexing into nil itself raises.

Source: [Common coding mistakes](/lua-best-practices/coding-mistakes), [Error handling mechanism](/advanced/error-handling-mechanism), [FAQ](/appendix/faq).

## GC and performance

- "Lua uses reference counting for GC" is a misconception; it actually uses mark-and-sweep (incremental or generational), and counting is borrowed only in a few internal cases. Cyclic references do not leak — mark-and-sweep reclaims the whole group.
- `collectgarbage` has no `"start"` option; use `"restart"` to restart it. In 5.4 `setpause`/`setstepmul` are outdated, and new code should use the `collectgarbage("incremental", ...)` form.
- "Packing arguments into a table is faster than positional passing" is a misconception: packing allocates an extra table and is usually slower. The table form buys named arguments and readability.
- Constant folding applies only when both operands are constants; if a variable is involved it does not fire.
- Metamethod calls carry extra overhead, so keep them out of hot paths on frequent calls; `debug` library operations are equally costly, so do not use them for production profiling.
- `jit.dump` and `-jp` observe JIT trace compilation and sampling, not a GC analyzer; the standard Lua 5.4 interpreter has no built-in GC analyzer.
- "A Lua sandbox stops malicious code" is a misconception: code in a sandbox that reaches `debug` can read and modify hooks and access the registry, C code brought in by `ffi.load` bypasses every Lua-level check, and timing and memory layout differences form side channels. A sandbox is one layer of defense in depth; hard isolation lives at the operating system.

Source: [Reference counting and mark-and-sweep](/design-and-implementation/reference-counting), [Tuning garbage collection](/lua-best-practices/gc-tuning), [Lua optimization techniques](/lua-best-practices/optimization-techniques), [Code generation and optimization](/design-and-implementation/code-generation), [Optimizing garbage collection](/design-and-implementation/gc-optimization).

## Implementation-layer misconceptions

- "Lua coroutine switching uses setjmp/longjmp" is a misconception: switching swaps only the stack pointer and `CallInfo`, and `setjmp`/`longjmp` exist for error recovery only, so coroutines can only switch cooperatively inside one thread.
- "Precompiled bytecode can be distributed across platforms" does not hold: the project explicitly does not guarantee that `luac -o` output is portable between machines, so recompile on the target platform.
- Lua has no conditional compilation at the script layer, so platform detection happens at run time (`package.config`, or `jit.os` under LuaJIT).
- "Lua's internal value type is called TaggedValue" is an error; the source in 5.4/5.5 uses `TValue`.

Source: [Coroutines under the hood](/design-and-implementation/coroutines-implementation), [Bytecode and virtual machine](/design-and-implementation/bytecode-and-vm), [Cross-platform deployment of Lua applications](/lua-best-practices/cross-platform-deployment), [Lua 5.5 source analysis](/design-and-implementation/lua55-source), [Sandboxing and untrusted code](/advanced/sandboxing).

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Exception_handling](https://en.wikipedia.org/wiki/Exception_handling)
- [Hash_table](https://en.wikipedia.org/wiki/Hash_table)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [README](README.md)
