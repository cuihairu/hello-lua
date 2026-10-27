# The Design Behind Coroutines

Coroutines implement non-preemptive multitasking within a single thread. Lua's coroutine design centers on several principles: lightness, cooperative scheduling, state saving and restoration, simplified asynchronous programming, controllability, and easy integration.

## 1. Lightweight

The design goal is to avoid the cost of traditional threads. Coroutines run in the same thread, so there is no context-switch penalty, and creation and destruction are both inexpensive: they use less memory and fewer processor resources than threads, and switching happens between coroutines rather than between threads, which is much faster.

## 2. Cooperative Scheduling

Scheduling is explicitly controlled by the programmer. Unlike preemptive threads, a coroutine must explicitly suspend and resume in its own code, so scheduling behavior is predictable and controllable: `coroutine.yield()` suspends, `coroutine.resume()` resumes, and the coroutine is never interrupted by the system.

## 3. State Saving and Restoring

When a coroutine suspends, it saves its execution state, including local variables and the call stack; on resume, it continues from the suspension point. Saving and restoring this context is the foundation for repeatedly interrupting and resuming a coroutine.

## 4. Simplified Asynchronous Programming

Coroutines make asynchronous operations look synchronous, so code is easier to understand and maintain. Asynchronous code can be written in sequential form, avoiding callback hell and complex asynchronous models; managing multiple asynchronous tasks is also simpler because they can be written and debugged in a linear fashion.

## 5. Flexibility and Control

Developers control coroutine creation, execution, and scheduling. Since coroutines have multiple states (for example `suspended`, `running`, and `dead`), they are flexible enough to manage; when to suspend and when to resume is decided by the developer, fitting a range of concurrent programming needs.

## 6. Easy Integration

Coroutines integrate naturally with the rest of Lua: they work closely with standard-library functions (`coroutine.resume`, `coroutine.yield`) and are compatible with core language features such as tables and functions.

## Summary

Lightness and cooperative scheduling define the coroutine cost model; state saving and restoration decide whether it can resume correctly; simplified asynchronous programming is the direct benefit to users. Together these principles make Lua's coroutines a practical concurrent programming tool.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [Continuation](https://en.wikipedia.org/wiki/Continuation)

<!-- BACKLINKS-AUTO -->
## Related pages

- [coroutines](coroutines.md)
- [glossary](/glossary.md)
- [books](/knowledge/books.md)
