# Lua Standard Library Reference

This lists the standard library bundled with Lua 5.4, organized by library. `luaL_openlibs` opens all libraries by default except `debug` (the `debug` library is also opened in the standard interpreter, but an embedding environment can choose). Function signatures and return values follow the Lua 5.4 manual.

## 1. base (Basic Library)

Built into the interpreter, no `require` needed; it provides the language's basic capabilities.

| Function | Description |
| --- | --- |
| `print(...)` | Prints values, separated by tabs |
| `type(v)` | Returns the type name: `"nil"`, `"boolean"`, `"number"`, `"string"`, `"table"`, `"function"`, `"thread"`, `"userdata"` |
| `tostring(v)` / `tonumber(v, [base])` | Convert to and from strings |
| `assert(v, [msg])` | Asserts; raises an error on failure |
| `error(msg, [level])` | Raises an error; `level` controls whether position info is attached |
| `pcall(f, ...)` / `xpcall(f, handler, ...)` | Protected calls |
| `next(t, [k])` | Returns the next key-value pair while traversing a table |
| `pairs(t)` / `ipairs(t)` | Iterators, traversing the whole table and the array part starting at 1, respectively |
| `select(n, ...)` | Returns the n-th argument or the total argument count (`"#"`) |
| `rawget(t, k)` / `rawset(t, k, v)` | Access a table directly, bypassing metamethods |
| `setmetatable(t, mt)` / `getmetatable(t)` | Sets / gets a metatable |
| `load(chunk, [chunkname])` / `loadfile(filename)` | Compiles a string or file and returns a function |
| `dofile(filename)` | Runs a file (raises an error directly on failure; not common) |
| `_G` / `_VERSION` | Global environment table / version string |

```lua
print(_VERSION)                        -- Lua 5.4
print(select("#", 1, 2, 3))            -- 3
print(pcall(function() error("boom") end))  -- false	[string "..."]:1: boom
```

## 2. string (String Library)

Lua strings are measured in bytes and are immutable. String methods can be called as `s:method(...)`.

| Function | Description |
| --- | --- |
| `string.len(s)` | Byte length (also equivalent to `#s`) |
| `string.sub(s, i, [j])` | Extracts a substring; indices support negatives |
| `string.rep(s, n, [sep])` | Repeats a string |
| `string.upper(s)` / `string.lower(s)` | Case conversion |
| `string.reverse(s)` | Reverses |
| `string.find(s, pattern, [init])` | Finds a pattern, returning the start and end indices |
| `string.match(s, pattern, [init])` | Captures the matching content |
| `string.gsub(s, pattern, repl, [n])` | Global replacement |
| `string.gmatch(s, pattern)` | Returns an iterator that yields each match |
| `string.format(fmt, ...)` | Formats, similar to C's `printf` |
| `string.byte(s, [i])` / `string.char(...)` | Converts between bytes and characters |
| `string.pack` / `string.unpack` / `string.packsize` | Binary packing (5.3+) |

```lua
print(string.format("%s=%d (%.1f%%)", "count", 42, 87.5))  -- count=42 (87.5%)
print(string.gsub("hello world", "o", "0"))                 -- hell0 w0rld	2
for w in string.gmatch("a,b,c", "[^,]+") do io.write(w, " ") end  -- a b c
```

## 3. table (Table Library)

| Function | Description |
| --- | --- |
| `table.insert(t, [pos,] v)` | Inserts at the end or at `pos` |
| `table.remove(t, [pos])` | Removes and returns an element |
| `table.concat(t, [sep], [i], [j])` | Concatenates the array part |
| `table.sort(t, [cmp])` | Sorts in place; `cmp` is the comparator |
| `table.move(a1, f, e, t, [a2])` | Moves elements between tables (5.3+) |
| `table.unpack(t, [i], [j])` | Unpacks into multiple return values (5.2+) |

```lua
local t = {3, 1, 2}
table.sort(t)
print(table.concat(t, ","))          -- 1,2,3
print(table.unpack({10, 20, 30}))    -- 10	20	30
```

## 4. math (Math Library)

Lua 5.4's `math.random` uses a 64-bit integer random number generator by default; integer operations do not introduce floating-point error.

| Function | Description |
| --- | --- |
| `math.max(...)` / `math.min(...)` | Maximum / minimum |
| `math.abs(n)` / `math.ceil(n)` / `math.floor(n)` | Absolute value, ceiling, floor |
| `math.fmod(x, y)` / `math.tointeger(x)` | Floating-point modulo, convert to integer |
| `math.sqrt(x)` / `math.exp(x)` / `math.log(x, [base])` | Powers and logarithms |
| `math.sin/cos/tan/asin/acos/atan` | Trigonometric functions |
| `math.tau` / `math.pi` / `math.huge` | Constants `2π`, `π`, infinity |
| `math.random([m [, n]])` | Random numbers; `math.randomseed(x)` sets the seed |
| `math.type(x)` | Returns `"integer"` or `"float"` |

```lua
print(math.floor(-1.5), math.ceil(2.1))   -- -2 3
print(math.type(3), math.type(3.0))       -- integer float
print(7 // 2, 7 % 2, 1 << 3)              -- 3 1 8
math.randomseed(os.time())
print(math.random(1, 6))
```

## 5. io (File I/O)

`io.read`/`io.write` operate on the default input/output; `io.open` returns a file handle (on failure it returns `nil, errmsg` and does not raise an error).

```lua
local f = io.open("/tmp/lua_io_demo.txt", "w")
if f then
    f:write("line1\n", "line2\n")
    f:close()
end

local f2 = io.open("/tmp/lua_io_demo.txt", "r")
if f2 then
    print(f2:read("a"))          -- reads the whole file
    f2:close()
end
```

## 6. os (Operating System Library)

| Function | Description |
| --- | --- |
| `os.time([t])` / `os.difftime(t2, t1)` | Timestamp and difference |
| `os.clock()` | CPU time used by the program |
| `os.date([format, [t]])` | Formats a time |
| `os.getenv(var)` | Reads an environment variable |
| `os.remove(filename)` / `os.rename(a, b)` | Deletes / renames a file |
| `os.tmpname()` | Temporary file name |
| `os.execute([cmd])` | Runs an external command |

```lua
print(os.date("%Y-%m-%d %H:%M:%S"))
print(os.getenv("HOME") or "not set")
```

## 7. coroutine (Coroutine Library)

| Function | Description |
| --- | --- |
| `coroutine.create(f)` | Creates a coroutine |
| `coroutine.resume(co, ...)` | Resumes execution, returning `true, ...` or `false, err` |
| `coroutine.yield(...)` | Suspends the current coroutine |
| `coroutine.status(co)` | `suspended`, `running`, `normal`, `dead` |
| `coroutine.wrap(f)` | Creates a wrapper function that can be called directly |
| `coroutine.isyieldable([co])` | Whether the current coroutine can yield |
| `coroutine.running([ismain])` | Returns the current coroutine and whether it is the main one (`ismain` is new in 5.4) |

```lua
local co = coroutine.wrap(function(a)
    local b = coroutine.yield(a + 1)
    return b * 2
end)
print(co(10))        -- 11
print(co(5))         -- 10
```

## 8. package (Module Library)

Manages module search and loading: `require`, `package.path`, `package.cpath`, `package.loaded` (cache of loaded modules), `package.preload`, `package.loadlib`, `package.searchers`.

```lua
print(package.loaded["string"] ~= nil)          -- true
package.path = package.path .. ";./mylib/?.lua"
```

## 9. utf8 (UTF-8 Library, 5.3+)

`utf8.char`, `utf8.codepoint`, `utf8.len`, `utf8.offset`, `utf8.charpattern`. Note that `string.len`/`string.sub` operate on bytes, not characters.

```lua
print(utf8.len("héllo"))                   -- 5  (6 bytes, 5 characters)
print(("héllo"):sub(1, 3))                 -- h + 2-byte é = first 3 bytes
```

## 10. debug (Debug Library)

Provides runtime introspection and debugging capabilities, including `debug.getinfo`, `debug.getlocal`, `debug.setlocal`, `debug.getupvalue`, `debug.sethook`, `debug.traceback`, `debug.getregistry`, and more. This library can break encapsulation and hurt performance, so use it with caution in production.

```lua
local function f()
    print(debug.getinfo(2, "n").name)
end
f()
```

## Summary

Lua 5.4's standard library is deliberately kept small: basic capabilities live in `base`, while the rest are split by responsibility, and each can be loaded on demand with `require` (except `base`, `coroutine`, `package`, `string`, and `table`, which are always available in `luaL_openlibs`). Beyond the ten libraries above, Lua 5.4 no longer provides a `bit32` library; bit operations are now handled by the language operators `& | ~ << >>` and so on.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#6.1)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#6.2)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#6.3)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#6.6)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#6.8)

<!-- BACKLINKS-AUTO -->
## Related pages

- [pitfalls](/knowledge/pitfalls.md)
