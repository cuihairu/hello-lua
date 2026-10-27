# Tuning Garbage Collection

Lua's garbage collection is automatic, but the parameters can be adjusted and the way you write code also affects its pressure.

## 1. Quick Reference on the Principles

The mark-and-sweep algorithm, incremental/generational modes, and `collectgarbage` parameter semantics in Lua 5.4 are detailed in the [Garbage Collection Overview](/design-and-implementation/garbage-collection). What is recorded here is the application-side experience of tuning parameters and observing.

## 2. Manually Controlling Garbage Collection

Control it with the `collectgarbage` function:
- `collectgarbage("stop")`: stop garbage collection.
- `collectgarbage("restart")`: restart garbage collection (there is no `"start"` option).
- `collectgarbage("collect")`: manually trigger a full collection.
- `collectgarbage("incremental", pause, stepmul, stepsize)`: switch to incremental mode, setting the pause value, step multiplier, and step size at once, where `0` means keep the current value.
- `collectgarbage("setpause", value)`: set the pause threshold. `value` is a percentage indicating when GC triggers.
- `collectgarbage("setstepmul", value)`: set the step multiplier. `value` is a multiplier used to adjust how much GC does per step. These two options date back to 5.1 and have been marked deprecated since 5.4; new code uses the `incremental` form above.

Example:

```lua
-- Stop garbage collection
collectgarbage("stop")

-- Perform a memory-intensive operation (doHeavyWork is illustrative)
-- doHeavyWork()

-- Manually trigger a garbage collection
collectgarbage("collect")

-- Restart garbage collection
collectgarbage("restart")
```

## 3. Adjusting GC Parameters

Two key parameters:
- `pause` (pause value): controls how often GC triggers. The larger the value, the less often GC runs (higher peak memory).
- `stepmul` (step multiplier): controls how much work GC does. The larger the value, the more work each GC step completes and the faster collection, but each step uses more CPU.

Example:

```lua
-- Incremental mode: pause 200, step multiplier 100, step size unchanged (0 means no change)
collectgarbage("incremental", 200, 100, 0)
```

## 4. Reducing Memory Usage

Reuse objects instead of creating new ones to reduce allocation; clear references you no longer need promptly so the collector can reclaim them.

Example:

```lua
local objectPool = {}

function getObject()
    if #objectPool > 0 then
        return table.remove(objectPool)
    else
        return {}  -- create a new object
    end
end

function releaseObject(obj)
    table.insert(objectPool, obj)
end
```

## 5. Optimizing Data Structures

A well-chosen table structure reduces both memory and GC pressure. Don't worry about circular references: the mark-and-sweep collector handles them correctly without leaking. But if objects refer to each other and are reachable from the root set, they will not be collected. So long-lived containers (such as caches and registries) should clear entries no longer needed, or use weak-reference tables so unused objects are collected sooner.

Example:

```lua
-- Use a weak-value table as a cache: entries can be collected when nothing else references them
local cache = setmetatable({}, { __mode = "v" })

do
    local a = {}
    local b = {a = a}
    a.b = b              -- circular reference
    cache.a = a          -- only the weak table holds a
end

print("entries before collection:", (function()
    local n = 0 for _ in pairs(cache) do n = n + 1 end return n
end)())                  -- 1
collectgarbage("collect")
print("entries after collection:", (function()
    local n = 0 for _ in pairs(cache) do n = n + 1 end return n
end)())                  -- 0: the circularly referenced objects are collected as a group
```

## 6. Monitoring and Analysis

While debugging, use `collectgarbage("count")` to see current memory usage:

Example:

```lua
print("Memory usage: " .. collectgarbage("count") .. " KB")
```

Memory and GC behavior can also be analyzed with tools such as LuaProfiler (`luaprofiler`).

## 7. Avoiding Frequent Garbage Collection

Combine many small operations into one to lower how often GC triggers; at the same time control the pace of allocation and avoid repeatedly allocating and freeing.

## 8. Using LuaJIT Wisely

LuaJIT's garbage collection is more efficient and it also brings JIT compilation, so GC behavior and tuning differ from the standard interpreter.

Example:

```lua
-- In LuaJIT, FFI can be used to improve performance
local ffi = require("ffi")
ffi.cdef[[
    int add(int, int);
]]
local C = ffi.load("mylib")
print(C.add(1, 2))
```

## Summary

Tuning parameters only changes the timing and pace of collection; reducing allocation is the fundamental fix: allocate less and GC pressure naturally drops.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.9)
- [Garbage_collection_(computer_science)](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [pitfalls](/knowledge/pitfalls.md)
- [performance-optimization](performance-optimization.md)
