# Coroutine Scheduling and Switching

Lua manages coroutine execution through cooperative scheduling; the core work is saving and restoring coroutine state.

## 1. Scheduling Coroutines

Cooperative means a coroutine must yield control voluntarily before any other coroutine can run. Three library functions cover the whole scheduling cycle. `coroutine.create` creates a new coroutine, initially `suspended` and not yet started. `coroutine.resume` resumes execution: the coroutine moves from `suspended` to `running` and runs until it hits `coroutine.yield` or finishes. `coroutine.yield` suspends the coroutine itself, moving it back to `suspended` and returning control to the caller.

The scheduling decision belongs to the coroutine's own execution logic. You explicitly manage switching, suspending and resuming coroutines at the right moments.

## 2. Switching Coroutines

Switching involves saving and restoring context. When a coroutine suspends, Lua only needs to keep its `lua_State`: its stack, local variables, and current call information (`CallInfo`, which records the instruction pointer) stay in place inside the structure, needing no extra copy. On resume, Lua points the "current coroutine" pointer at the resumed `lua_State`, pulls the instruction pointer from its `CallInfo`, and continues from where it last suspended.

The switch happens in C: it exchanges the stack pointer and `CallInfo` in `lua_State` rather than saving or restoring CPU registers (`setjmp`/`longjmp` are only for error recovery). This also explains why coroutines can only switch cooperatively within the same thread.

## 3. Optimizing the Switch

Switch efficiency matters to performance; Lua's implementation lowers cost in three places. The switch itself only exchanges the stack pointer and current call information—no system call or CPU-level context save—so it is cheap enough for high-frequency scheduling. Stacks are allocated on demand and grow and shrink automatically, so switching never copies stack contents; controlling the number of coroutines and collecting dead ones promptly avoids tying up memory in idle coroutines. Garbage collection is closely tied to switching, so a tuned reclamation strategy reduces its interference.

## 4. Debugging and Testing the Switch

There are a few routes to debugging coroutine switching: track coroutine state changes with a debugger to catch suspension and resume problems and expose latent switching bugs; profile the switch to confirm its cost and optimize the hot spots; and write unit tests for creation, resume, suspension, and state transitions.

## Summary

Cooperative scheduling plus lightweight context switching makes up Lua's coroutine cost model: the switch only exchanges the stack pointer and `CallInfo`, touches no CPU registers, and makes no system call. On the application side, the work is managing coroutine count and suspension timing.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [Call_stack](https://en.wikipedia.org/wiki/Call_stack)

<!-- BACKLINKS-AUTO -->
## Related pages

- [core-concepts](/knowledge/core-concepts.md)
