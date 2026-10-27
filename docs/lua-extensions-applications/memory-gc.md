# Memory Management and Garbage Collection

Memory management and garbage collection decide a Lua program's runtime memory behavior: which objects are alive and when they are released. This page covers both the mechanisms and how to tune them.

## 1. Memory Management Overview

Lua's memory management system handles allocating and freeing memory resources. It uses a garbage collection (GC) mechanism to reclaim memory automatically, reducing the risk of memory leaks.

## 2. Garbage Collection Mechanism

Lua uses a mark-and-sweep garbage collector. In the mark phase it starts from the root objects and follows reference chains to mark all reachable objects; these are the objects currently alive in the program. In the sweep phase it walks every object in memory; anything not marked is unreachable, no longer used by the program, so it is collected and its memory freed.

## 3. Lua's Garbage Collection Strategy

Collection runs in incremental stages rather than clearing all garbage at once, so GC's impact on program performance is smaller. The collection pace can be controlled with the `collectgarbage` function, for example adjusting the collection frequency or triggering collection manually.

## 4. Controlling Garbage Collection with `collectgarbage`

Lua provides the `collectgarbage` function to control garbage collection manually. Common operations:

- Adjust the garbage collection parameters:
  ```lua
  collectgarbage("incremental", 200, 100, 0)  -- Incremental mode: pause 200, step multiplier 100, step size unchanged
  ```
  Note that `collectgarbage` has no options to read parameters such as `getpause`/`getstepmul`; it can only set them. Available options include `"collect"`, `"count"`, `"stop"`, `"restart"`, `"setpause"`, `"setstepmul"`, `"incremental"`, `"generational"`, `"step"`, `"isrunning"`. Of these, `setpause`/`setstepmul` date back to 5.1 and are deprecated as of 5.4; new code should use the `incremental` form.
- Trigger garbage collection manually:
  ```lua
  collectgarbage("collect")  -- Trigger one full garbage collection
  ```

## 5. Garbage Collection Optimization Strategies

Adjust the incremental mode's `pause`/`stepmul` parameters based on the program's memory usage, so GC pressure matches the actual allocation rhythm. In performance-critical code paths, create fewer short-lived objects to avoid frequent creation and destruction. Weak tables are also useful for keeping objects from being held by strong references:

  ```lua
  local weakTable = setmetatable({}, {__mode = "v"})  -- Create a weak-value table
  ```

## 6. Memory Management Best Practices

Do not hold strong references to objects you no longer need; hand them to the collector, which is the basic skill for avoiding memory leaks. Create objects sparingly; reuse mechanisms such as object pools reduce frequent creation/destruction and memory fragmentation. Keep an eye on memory usage: `collectgarbage("count")` and memory profiling tools can both show it.

## 7. Garbage Collection in LuaJIT

If you use LuaJIT, the garbage collection mechanism differs. LuaJIT has its own garbage collector with functionality similar to Lua's, but its performance characteristics and optimization strategies may differ. LuaJIT's FFI library (Foreign Function Interface) also lets Lua call C functions directly, which affects how memory is managed.

## References

- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html#2.9)
- [Memory_management](https://en.wikipedia.org/wiki/Memory_management)
- [LuaJIT profiler documentation](https://luajit.org/ext_profiler.html)

## Related pages

- [luajit-optimization](luajit-optimization.md)
