# Performance Optimization

In Lua programs the main costs are usually global variable lookups, table creation, and string concatenation. This group has two pages:

- [Lua Code Optimization Techniques](/lua-best-practices/optimization-techniques): eleven optimization approaches covering global variables, tables, metatables, function calls, strings, GC, and LuaJIT.
- [Garbage Collection Tuning](/lua-best-practices/gc-tuning): the parameters of `collectgarbage` and controlling collection pace.

## Closing

Measure before acting: find hot spots with a performance profiling tool, measure again after changing, and confirm the optimization really helps.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.9)
- [Tracing_just-in-time_compilation](https://en.wikipedia.org/wiki/Tracing_just-in-time_compilation)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](/knowledge/README.md)
