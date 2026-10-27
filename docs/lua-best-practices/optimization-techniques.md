# Lua Code Optimization Techniques

These techniques cover global variables, tables, function calls, strings, GC, and LuaJIT, each with the reason and the approach.

## 1. Reduce Use of Global Variables

Global variable access is slow because Lua has to look up the global environment table. Declare variables with `local`; where a global is necessary, cache it in a local variable to reduce lookups.

Example:

```lua
-- Not recommended
function compute(value)
    result = value * 2
    return result
end

-- Recommended
function compute(value)
    local result = value * 2
    return result
end
```

## 2. Optimize Table Usage

Prefer numeric indices over string indices. Build tables with one literal when possible; reuse a table used repeatedly in a loop instead of creating a new one each iteration. Don't use complex types such as tables or functions as keys. Simplify table nesting levels where possible—more levels raise the complexity of both access and processing. `table.insert` and `table.remove` at a middle position shift subsequent elements; to append, `t[#t + 1] = v` or `t[i] = v` is faster.

Example:

```lua
-- Not recommended: a new table every iteration in a loop
local result = {}
for i = 1, 10000 do
    result[i] = { value = i }   -- 10000 tables, heavy GC pressure
end

-- Recommended: reuse the same table
local buf = {}
for i = 1, 10000 do
    buf[i] = i                  -- numeric index, direct assignment, low GC pressure
end
```

Note: Lua 5.4 has no API to "preallocate table size" (LuaJIT provides `table.new(narray, nhash)`; under the standard interpreter the only options are one-shot literal construction or direct index assignment to let the table grow as needed).

## 3. Use Metatables and Metamethods Carefully

Metatables and metamethods enable object behavior and operator overloading, but carry overhead. Use them only when needed; avoid metamethods in frequently called operations.

Example:

```lua
-- Use a metatable
local mt = { __add = function(a, b) return a.value + b.value end }
local a = { value = 10 }
local b = { value = 20 }
setmetatable(a, mt)
setmetatable(b, mt)
print(a + b)  -- outputs 30
```

## 4. Reduce Function Call Overhead

Every function call costs stack space and time. Inline short functions at the call site, and keep call nesting levels as low as possible.

Example:

```lua
-- Not recommended
function add(a, b)
    return a + b
end

function compute(value)
    return add(value, 10)
end

-- Recommended
function compute(value)
    return value + 10
end
```

## 5. Optimize String Operations

Strings are immutable; every modification creates a new string. Replace repeated concatenation inside loops with batch construction using `table.concat`.

Example:

```lua
-- Not recommended
local str = ""
for i = 1, 1000 do
    str = str .. i
end

-- Recommended
local t = {}
for i = 1, 1000 do
    t[i] = i
end
local str = table.concat(t)
```

## 6. Reduce the Impact of Garbage Collection

Garbage collection causes performance fluctuation. In performance-critical code, control GC manually with `collectgarbage`; set the incremental mode's trigger frequency and step size at once with `collectgarbage("incremental", pause, stepmul, stepsize)` (`0` means no change), since the old `setpause`/`setstepmul` have been marked deprecated since 5.4. Save object creation where possible and reuse where possible; techniques such as object pools can manage object lifetimes.

Example:

```lua
-- Incremental mode: pause 200, step multiplier 100, step size unchanged
collectgarbage("incremental", 200, 100, 0)
```

## 7. Use LuaJIT

LuaJIT brings just-in-time compilation and runs faster than the standard interpreter. Move code over and call C functions with the FFI (Foreign Function Interface) library.

Example:

```lua
-- Use LuaJIT FFI
local ffi = require("ffi")
ffi.cdef[[
    int add(int, int);
]]
local C = ffi.load("mylib")
print(C.add(1, 2))
```

## 8. Avoid Long-Running Code Blocks

Long code blocks block other operations. Split long tasks into chunks, and hand time-consuming work to coroutines for slicing.

Example:

```lua
-- Use coroutines
local co = coroutine.create(function()
    for i = 1, 10000 do
        -- long-running operation
        coroutine.yield()
    end
end)

while coroutine.status(co) ~= "dead" do
    coroutine.resume(co)
end
```

## 9. Cache Function Results

For functions repeatedly computing the same input, cache the results; the more often it is called, the more worthwhile.

Example:

```lua
-- Use caching
local cache = {}
function expensiveFunction(x)
    if not cache[x] then
        -- complex computation
        cache[x] = x * x
    end
    return cache[x]
end
```

## 10. Use Tables as Function Parameters Wisely

Positional arguments cost the least; packing arguments into a table allocates an extra table and is usually slower, so it is not an optimization. For a fixed number of clearly ordered parameters, pass them positionally. Use a table only when the argument count varies, named parameters (like keyword arguments) are needed, or a "config object" semantics is wanted—for readability and extensibility, not performance.

Example:

```lua
-- Recommended (performance first): positional arguments, no extra allocation
function process(a, b, c)
    return a + b + c
end
process(1, 2, 3)

-- Also usable (readability first, but allocates a table each call)
function process_config(params)
    return params.a + params.b + params.c
end
process_config({a = 1, b = 2, c = 3})
```

## 11. Avoid the `debug` Library

Operations in the `debug` library carry overhead; don't use it for performance analysis in production.

Example:

```lua
-- Avoid using the debug library
local function foo()
    -- debugging operation
end
```

## Summary

Measure before optimizing: confirm hot spots with a profiling tool, measure again after changing, and confirm there is a gain. Sacrificing readability for a trivial improvement is not worth it.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html)
- [Just-in-time_compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](/knowledge/README.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
- [performance-optimization](performance-optimization.md)
