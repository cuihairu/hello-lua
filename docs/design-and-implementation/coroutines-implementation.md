# Coroutines Under the Hood

Lua implements lightweight cooperative threads through low-level mechanisms in the virtual machine. What follows walks through the data structure, state management, scheduling, switching mechanism, garbage collection, and debugging.

## 1. The Coroutine Data Structure

Each coroutine is an independent `lua_State` (that is, a "thread") structure that holds the coroutine's execution state and context: the call stack, the current call-information chain (`CallInfo`), and the stack slots where local variables live. The main coroutine is also a `lua_State`; ordinary coroutines are created by `lua_newthread`. Internally, `coroutine.create` calls `lua_newthread` to obtain a new `lua_State` and pushes the entry function onto its stack. Lua has no separate "Coroutine" structure; all coroutine state is recorded in `lua_State`.

## 2. Coroutine State Management

When a coroutine is created, Lua initializes a new `lua_State` and sets it to the coroutine's running state, including the initial stack size and other runtime parameters. Suspending and resuming then save and restore the `lua_State` context: the execution stack, local variables, and program counter are all within the saved range.

## 3. Coroutine Scheduling

Scheduling is cooperative, so a coroutine must explicitly suspend and resume. When a coroutine calls `coroutine.yield()`, Lua saves the current coroutine's context and returns control to the place that resumed it, allowing other coroutines to continue; when a coroutine is resumed by `coroutine.resume()`, Lua restores execution from the saved context and continues from the suspension point.

## 4. Implementation Mechanism

Stack handling is foundational. Each coroutine has its own stack; when switching coroutines, Lua only switches the currently active stack and `CallInfo`. The original coroutine's stack data remains untouched in memory and does not need to be rebuilt on resume, which keeps the coroutine consistent through suspend and resume.

The context switch happens entirely at the C level: it exchanges data structures inside `lua_State`, such as the stack pointer and the current call information (`CallInfo`, which holds the instruction pointer `savedpc`). CPU registers are never saved or restored (`setjmp`/`longjmp` are used only for error recovery, not coroutine switching). Lua coroutines therefore switch cooperatively only within the same thread and cannot run across threads.

The virtual machine supports coroutines at a low level: it manages their execution, scheduling, and state transitions, and exposes the API used to operate on them.

## 5. Garbage Collection and Coroutines

Coroutines create and manage objects while executing, and the garbage collector handles those objects so they are correctly reclaimed when a coroutine finishes. The memory manager also adapts to coroutine creation and destruction, releasing a coroutine's memory when it is no longer used.

## 6. Debugging Coroutines

The debug library can retrieve a coroutine's state information, including the function currently executing and stack information, which helps when investigating coroutine problems. Debugging tools can also trace a coroutine's execution flow and observe its behavior in different states.

## Summary

All coroutine state lives in `lua_State`; switching exchanges only the stack pointer and `CallInfo` and never touches CPU registers. This design gives Lua cooperative threads at very little cost, at the price of switching cooperatively only within a single thread.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [Official Lua source repository on GitHub](https://github.com/lua/lua)

<!-- BACKLINKS-AUTO -->
## Related pages

- [lua55-source](lua55-source.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
