# Memory Management

Memory management automates allocation and reclamation and prevents leaks. It consists of three shared mechanisms: garbage collection (GC), the allocator, and string interning.

## 1. Garbage Collection

Lua uses incremental mark-and-sweep collection to reclaim unused memory periodically. The work has two phases. Marking starts from live objects and recursively traverses and marks every referenced object; sweeping then scans memory and frees every object left unmarked. To reduce the impact on program performance, collection does not run to completion in one step but is divided into small stages spread across program execution.

Tuning starts with `collectgarbage`: it can trigger collection manually and adjust collector parameters, including step size and the collection threshold, to balance performance against memory use.

## 2. Memory Allocation

The allocator allocates and frees memory for Lua objects. At `lua_newstate`, Lua registers an allocation function (`lua_Alloc`, implemented by default with `realloc`); allocation and release for every object—tables, strings, function prototypes, coroutine stacks, and others—go through this one entry point. It does not preallocate a memory pool but delegates memory management to the underlying C library, such as glibc's `malloc`, so replacing the allocator is enough to connect Lua to custom memory management. Stacks and coroutine stacks grow and shrink on demand. The slots needed by a function call are reserved together on entry, avoiding frequent one-element growth.

For tuning, passing your own allocator to `lua_newstate(alloc_func, ud)` can add memory statistics, enforce a quota—limiting how much memory Lua may use on an embedded device, for example—or connect Lua to a specialized memory pool.

## 3. Optimizing Memory Use

String interning is the main mechanism for reducing memory use. Lua interns short strings, so identical strings are stored only once throughout the state and comparison only needs to compare pointers. The Lua core does not pool tables, functions, or other objects; if an application needs a pool—for game particles, for example—it can build one from ordinary tables and weak tables. Monitoring memory use and evaluating the effect of garbage collection provide the basis for continued optimization.

## 4. Collector Challenges and Considerations

Automatic memory management has costs. Although incremental collection shortens each pause, garbage collection can still pause the program in some situations, which matters to latency-sensitive applications. Tuning also depends on judging how the program uses memory; a poor estimate can make parameter changes counterproductive. Periodic performance tests are the remedy: measure the collector's actual effect and adjust the collection strategy and parameters for the application.

## Summary

Incremental mark-and-sweep handles reclamation, while one unified allocation function and string interning reduce allocation overhead and memory use. The remaining work is matching the parameters to the application's memory behavior.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.9)
- [Memory management](https://en.wikipedia.org/wiki/Memory_management)
- [Official Lua source repository on GitHub](https://github.com/lua/lua)

<!-- BACKLINKS-AUTO -->
## Related pages

- [core-concepts](/knowledge/core-concepts.md)
