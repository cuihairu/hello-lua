# Optimizing Garbage Collection

Lua's garbage collector has a set of optimization strategies aimed at improving performance and reducing the collector's effect on program execution.

## 1. Modes and Parameters

The definitions of Lua 5.4's mark-and-sweep, incremental/generational modes, and the semantics of `collectgarbage` parameters are in [the garbage collection overview](/design-and-implementation/garbage-collection). This page keeps the mode trade-offs, object allocation, and measurement methods, to avoid re-maintaining algorithm facts.

## 2. Optimizing Allocation

You can lower GC pressure on the allocation side. An object pool reuses objects, avoiding frequent create/destroy; high-frequency code should create as few short-lived objects as possible, which lowers young-generation collection pressure.

## 3. Debugging and Profiling

For a memory curve, sample `collectgarbage("count")` periodically and compare the value before and after a collection to learn about allocation and reclamation:

```lua
local function mem()
    return string.format("%.1f KB", collectgarbage("count"))
end
print("before GC:", mem())
collectgarbage("collect")
print("after GC:", mem())
```

Tool boundaries matter: `luajit`'s `-jdump` (the `jit.dump` library) observes JIT trace compilation and is unrelated to GC itself; the Lua 5.4 standard interpreter has no built-in GC profiler, so you usually pair it with external sampling or logging to observe GC behavior. Optimize the code's memory-management strategy based on the monitoring results, and reclamation cost keeps dropping.

## 4. Measuring Incremental versus Generational

Mode definitions and parameters are in [the garbage collection overview](/design-and-implementation/garbage-collection). Incremental mode can serve as the comparison baseline for a steady allocation-rate workload; if there are many short-lived objects, include generational mode in the comparison. After switching, use `collectgarbage("count")` and timing to compare memory peaks and pauses, then decide based on your target workload.

## Summary

Incremental collection, generational collection, parameter tuning, allocation optimization, and profiling all aim at the same goal: making collection interrupt the program less. Quantify the current state with `collectgarbage("count")`, then choose a mode and tune parameters.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.9)
- [Garbage_collection_(computer_science)](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))
- [Manual_memory_management](https://en.wikipedia.org/wiki/Manual_memory_management)

<!-- BACKLINKS-AUTO -->
## Related pages

- [lua55-source](lua55-source.md)
- [pitfalls](/knowledge/pitfalls.md)
