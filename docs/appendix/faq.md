# Frequently Asked Questions and Solutions

These are the problems I keep running into when writing Lua. The examples were all verified under Lua 5.4.

## 1. How Big Is the Performance Difference Between Local and Global Variables?

Where is the difference between a `local` declaration and a global variable?

A global variable must be looked up layer by layer through the `_G` table (in fact the environment table), while a local variable is addressed directly in the virtual machine as a register or upvalue. Therefore local variables are clearly faster and do not pollute the global namespace.

```lua
-- recommended form
local name = "Lua"
local function greet()
    return "Hello, " .. name
end
print(greet())
```

In a hot loop, you can also cache a global function into a local variable before calling it:

```lua
-- cache the global function as a local variable
local floor = math.floor
local function f(x)
    return floor(x) * 2
end
print(f(3.7))
```

## 2. What's the Problem With Appending Elements Using `#t` and `t[#t + 1]`?

Why is it not recommended to keep appending with `table.insert(t, v)` or `t[#t + 1] = v` in a loop?

In Lua, both forms trigger reallocation of the table. Frequent appends produce more garbage and increase GC pressure. For a sequence of known length, prefer constructing it at once with a literal, or use bulk operations such as `table.move` and `table.concat`.

```lua
local t = {}
for i = 1, 5 do
    t[#t + 1] = i        -- works, but triggers multiple table regrows
end
print(table.concat(t, ","))   -- 1,2,3,4,5
```

Also note: `#t` does not give a deterministic result for "sparse tables" with holes, so do not use it as an "element count".

## 3. Why Does `1 / 0` Not Raise an Error?

In C, `1 / 0` is undefined behavior; why does Lua produce `inf`?

Lua's division always yields a floating-point result. Dividing by 0 gives `inf` (positive infinity) or `-inf`, and dividing `0/0` gives `nan`; none of these raise an error. Only arithmetic on `nil` or booleans raises an error.

```lua
print(1 / 0)        -- inf
print(0 / 0)        -- nan
print(-1 / 0)       -- -inf
```

If you need to trigger an error when the divisor is 0, check explicitly:

```lua
local function safe_divide(a, b)
    if b == 0 then
        return nil, "division by zero"
    end
    return a / b
end

print(safe_divide(10, 2))    -- 5
print(safe_divide(10, 0))    -- nil     division by zero
```

## 4. What Is the Behavior of `//` and `%` on Negative Numbers?

Does `math.floor(-1 / 2)` match `-1 // 2`?

They match. In Lua 5.4, both `//` (floor division) and `%` (modulo) follow the "round toward negative infinity" rule, and the sign of the result is determined by the divisor.

```lua
print(-1 // 2)          -- -1
print(-1 % 2)           -- 1
print(math.floor(-1 / 2)) -- -1
print(-7 % 3)           -- 2
```

## 5. Why Do `ipairs` and `pairs` Iterate in Different Orders?

Iterating the same table with `pairs` can give a different order each time.

A Lua table plays both roles of array and hash table: `ipairs` starts from 1 and traverses the array part by consecutive index, with a stable order; `pairs` traverses the array part and then the hash part, whose order depends on the keys' hash values and is unordered.

```lua
local t = {10, 20, 30, x = 1, y = 2}

for i, v in ipairs(t) do      -- stable order: 10 20 30
    io.write(v, " ")
end
print()
```

If you need a stable order, iterate the indices explicitly, or collect the keys into an array, sort them, and then process.

## 6. Why Can't Strings Be Modified in Place?

`s:sub(1, 3) = "abc"` raises a syntax error.

Strings in Lua are immutable (interned and read-only); any "modification" creates a new string. Repeatedly concatenating strings in a loop generates many temporaries; use `table.concat` instead.

```lua
local parts = {"Hello", " ", "world", "!"}
print(table.concat(parts))          -- Hello world!
```

## 7. What Should I Do When `require` Cannot Find a Module?

`require("mymodule")` reports `module 'mymodule' not found`.

`require` searches `package.path` (Lua files) and then `package.cpath` (C libraries), where `?` is replaced by the module name. Add the directory containing the module:

```lua
package.path = package.path .. ";./mylib/?.lua"

local ok, mod = pcall(require, "mymodule")
if not ok then
    print("load failed: " .. tostring(mod))
else
    print("load succeeded:", mod.name)
end
```

Note the module file must `return` a value, otherwise `require` returns `true`.

## 8. How Do I Safely Call Code That May Fail?

How do you avoid one error taking down the whole program?

Use `pcall` (protected call) or `xpcall` (which lets you specify an error handler) to execute possibly-failing code. When an error occurs, the first return value is `false` and the second is the error object.

```lua
local ok, err = pcall(function()
    error("something went wrong")
end)
if not ok then
    print("caught error:", err)
end
```

## 9. Why Do Error Messages Contain a File Name and Line Number?

The string from `error("oops")` is `[string "..."]:1: oops`.

`error` prepends position information to the message by default. The second argument controls it (passing `2` uses the caller's position):

```lua
local function f()
    error("oops", 2)
end

local function g()
    f()
end

local ok, err = pcall(g)
print(err)          -- prints: faq.lua:6: oops
```

The file name is taken from the script's actual saved name, and line 6 points to the line calling `f`. The second argument `2` makes the message use the caller's position rather than `error`'s own location.

## 10. What Are Weak Tables Useful For?

A cache table keeps growing; how can its entries be collected?

Put the table inside a weak table. `__mode = "v"` means values are weak references and `"k"` means keys are weak. When a key or value becomes unreachable, the corresponding entry is removed by the GC.

```lua
local cache = setmetatable({}, { __mode = "v" })

local function get_value(k)
    if not cache[k] then
        cache[k] = { computed = k * 2 }
    end
    return cache[k]
end

get_value(1)
get_value(2)
print("entry count:", (function()
    local n = 0
    for _ in pairs(cache) do n = n + 1 end
    return n
end)())
collectgarbage("collect")       -- entries are cleared when the object has no external references
print("entry count after collection:", (function()
    local n = 0
    for _ in pairs(cache) do n = n + 1 end
    return n
end)())
```

## 11. What Is the Second Argument of `xpcall` For?

What is the difference between `xpcall` and `pcall`?

`xpcall` lets you pass an error handler, which can be used to print a stack trace when an error occurs:

```lua
local function handler(err)
    print("error:", err)
    local info = debug.traceback()
    print(info)
    return err
end

local ok = xpcall(function()
    local t = nil
    return t.field      -- triggers the error
end, handler)
print("did it succeed:", ok)
```

## 12. How Do I See How Much Memory the Current Program Is Using?

How do you locate where memory growth is too fast?

`collectgarbage("count")` returns the memory currently allocated by Lua (in KB). Together with `collectgarbage("collect")`, you can manually collect and then observe the increment.

```lua
local before = collectgarbage("count")
local t = {}
for i = 1, 10000 do t[i] = {} end
local after = collectgarbage("count")
print(string.format("allocated %.1f KB", after - before))
```

## Summary

These notes cover scope, tables, strings, modules, error handling, and memory management. My troubleshooting habit is to first reproduce a minimal example, then locate the issue with `pcall` and `collectgarbage("count")`.

## References

- [LuaJIT FAQ](https://luajit.org/faq.html)
- [lua-users wiki](http://lua-users.org/wiki/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [pitfalls](/knowledge/pitfalls.md)
