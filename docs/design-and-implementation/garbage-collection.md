# Garbage Collection

Lua's garbage collector automatically reclaims memory that is no longer used, preventing leaks. It combines mark-and-sweep with incremental collection.

## 1. Basic Concepts

Garbage collection (GC) is the process of automatically reclaiming memory that is no longer needed: the collector tracks the program's memory objects and frees an object's memory once it is no longer referenced. Lua's memory objects include tables, functions, strings, and so on; the collector cares about each object's lifetime and reference state.

## 2. Mark-and-Sweep

The algorithm has two phases. In the mark phase, starting from root objects, it walks every object in the program and marks all reachable objects. Roots include global variables and the local variables on the current call stack; this step identifies the objects still referenced. In the sweep phase, it walks all objects and frees any that were not marked as garbage—only objects missed by the mark phase are swept.

## 3. Incremental Collecting

Lua 5.4 offers two switchable collection modes, selected with `collectgarbage("incremental")` or `collectgarbage("generational")`.

The incremental mode (default) splits marking and sweeping into many small steps interleaved with program execution. Each step handles a subset of objects, so the pause from a single collection is shorter.

The generational mode assumes that most objects die young, and splits objects by age into new and old: new objects are reclaimed by frequent minor collections; old objects are only checked during the less frequent major collections. The generational and incremental modes cannot both be active—they are mutually exclusive.

Two multipliers control the frequency of minor and major collections in the generational mode: `minormul` controls how often a minor collection is triggered, and `majormul` controls how often a major one is. Passing `0` keeps that parameter's current value.

```lua
collectgarbage("incremental", 100, 100, 13) -- pause, step multiplier, step size
collectgarbage("generational", 20, 100)    -- minor multiplier, major multiplier
```

## 4. Controlling the Collector

The `collectgarbage` function queries and controls the collector's state:

```lua
-- Run one full collection
collectgarbage("collect")

-- Is the collector running?
print(collectgarbage("isrunning"))      -- true

-- Memory in use (KB)
print(collectgarbage("count"))
```

In the incremental mode, two parameters control when collection starts and how much work each step does:

```lua
-- Set GC parameters
collectgarbage("setpause", 100)    -- pause: how much memory may grow between collections
collectgarbage("setstepmul", 200)  -- step multiplier: work done per GC step
```

Lua 5.4 also lets you set both with a single call: `collectgarbage("incremental", pause, stepmul, stepsize)`. `setpause`/`setstepmul` are the legacy 5.1 interface, now deprecated in 5.4; new code should prefer the `incremental`/`generational` forms.

The effect of the two parameters: a larger `pause` triggers GC later and less often but at a higher peak memory; a larger `stepmul` does more GC work per step—each step takes longer but collection finishes faster. Adjusting them trades memory usage against pause time.

## 5. Optimizing Reclamation

Optimization has three directions: reduce memory allocation and tune object lifetimes to lower GC pressure (for example, avoid creating many short-lived objects); adjust the reclamation threshold and step size to the program's requirements, balancing performance against memory use; and monitor the collector with Lua's built-in functions and tools, continuing to adjust based on the data.

## Summary

Mark-and-sweep decides which objects are reclaimable, and incremental collection flattens collection into small steps. Understand those two layers, then tune parameters with `collectgarbage`, and you can find the balance between program performance and memory use that suits your workload.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.7)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.9)
- [Garbage_collection_(computer_science)](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
