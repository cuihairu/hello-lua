# Reference Counting versus Mark-and-Sweep

In Lua's garbage collection, reference counting and mark-and-sweep are both important memory-management techniques. Lua itself uses only mark-and-sweep to manage object lifetimes; it does not use reference counting to manage objects (it borrows the idea only in a few internal spots, such as counting already-open upvalues). Comparing the two algorithms makes Lua's choice clear.

## 1. Reference Counting

### Basic idea

Reference counting keeps a counter per object that tracks how it is used: the count increments when the object is referenced and decrements when a reference is released; at zero the object is no longer used and its memory can be safely reclaimed.

### Strengths

Immediate reclamation is reference counting's biggest advantage: when the count hits zero, the memory is freed right away. The implementation is also relatively simple, and many languages use it effectively.

### Weaknesses

Cycles are unhandled: if two objects reference each other, both counts may stay nonzero and leak. Counting also has significant overhead, especially when objects are created and destroyed often.

## 2. Mark-and-Sweep

### Basic idea

Mark-and-sweep manages memory in two phases. In the mark phase, starting from root objects—global variables and locals on the current call stack—it recursively walks every reachable object and marks it live. In the sweep phase, it walks all objects and clears those not marked live, freeing their memory.

### Strengths

Cycles are handled correctly, because the algorithm decides reclamation from reachability. It also avoids the overhead and complexity of maintaining reference counts.

### Weaknesses

The pause can be long, since each collection scans every object. Collection is periodic rather than immediate, so memory use may peak in the short term.

## Lua's Garbage Collector

Lua's collector combines mark-and-sweep with incremental collection. The main algorithm is mark-and-sweep: it marks all reachable objects and uses that to decide what can be cleared. To reduce the impact on the program, Lua defaults to incremental (incremental mode), spreading collection into many small steps to shorten the pause. Lua 5.4 also offers a generational mode as the alternative: objects are split by survival time into new and old; new objects are collected more often, old objects only during the less frequent major collections. The two modes are mutually exclusive, selected with `collectgarbage("incremental")` or `collectgarbage("generational")`. The control and tuning entry point is `collectgarbage`, which can trigger a manual collection and adjust thresholds.

## Summary

Reference counting is immediate but cannot handle cycles and is costly under frequent object churn; mark-and-sweep handles cycles at the price of longer pauses. Lua chooses mark-and-sweep, layering incremental and generational collection on top to reduce pauses.

## References

- [Reference_counting](https://en.wikipedia.org/wiki/Reference_counting)
- [Lua official source repository on GitHub](https://github.com/lua/lua)

<!-- BACKLINKS-AUTO -->
## Related pages

- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
