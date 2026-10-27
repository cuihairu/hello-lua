# Implementing Coroutines

Coroutines are lightweight threads that allow execution to be suspended and resumed between functions, enabling non-blocking asynchronous programming. Their implementation involves scheduling, context switching, and stack management.

## Reading Boundary

This page collects notes about how Lua implements coroutines. Cooperative execution and the use and state of `create`/`resume`/`yield` are covered in the [Advanced coroutines notes](/advanced/coroutines).

For the implementation direction, continue to [The design behind coroutines](./coroutines-design.md), [Coroutines under the hood](./coroutines-implementation.md), and [Coroutine scheduling and switching](./coroutines-scheduling.md).

## State and Lifecycle

State queries and lifecycle usage are covered in the [Coroutine state and lifecycle notes](/advanced/coroutine-lifecycle). The implementation-layer details of state saving, stack management, and switching appear on the implementation pages above.

## Scheduling and Switching

The programmer-controlled `resume`/`yield` model is covered in the [Advanced coroutines notes](/advanced/coroutines). This group's scheduling policy and context-switch implementation appear in [Coroutine scheduling and switching](./coroutines-scheduling.md).

## Applications and Practice

My experience using coroutines for task scheduling is in [Coroutine use cases and best practices](/advanced/coroutine-best-practices); this page collects the implementation-related entry points.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [Official Lua source repository on GitHub](https://github.com/lua/lua)

## Related pages

- [coroutines-design](coroutines-design.md)
