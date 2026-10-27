# Lua Best Practices

Most Lua code problems come from global variables, table usage, and error handling. The section is organized around code style, performance, testing and debugging, and deployment.

## 1. Code Style and Standards

**1.1 Coding standards**

Keep one consistent style across a codebase and follow the team coding standards. Names should be meaningful: `get_user_name` is better than `g_un`. Use either 2 or 4 spaces consistently for indentation. Put spaces around operators and parentheses: write `a + b`, not `a+b`.

**1.2 Lua style guide**

Group a single object into one table instead of spreading it across many variables. For classes and inheritance, simulate them with the table `__index` metamethod. Declare variables and functions as `local` whenever possible; globals can collide and make failures hard to trace. Organize code into modules loaded with `require`, instead of defining functions and variables in global scope.

Example:

```lua
-- Not recommended
x = 10
function foo()
    return x
end

-- Recommended
local x = 10
local function foo()
    return x
end
```

## 2. Performance Optimization

**2.1 Reduce table creation**

Avoid repeatedly creating tables or other data structures inside loops. Construct table contents in one pass when possible, or reuse existing tables (the standard Lua 5.4 interpreter has no API for preallocating table size).

**2.2 Use local variables**

Local variables are faster to access than globals. Prefer `local` in loops and functions.

Example:

```lua
-- Not recommended
global_var = 0
for i = 1, 1000 do
    global_var = global_var + i
end

-- Recommended
local local_var = 0
for i = 1, 1000 do
    local_var = local_var + i
end
```

**2.3 Avoid excessive table nesting**

Deeply nested tables slow access down. Keep data structures at a reasonable depth.

**2.4 Use metatables for optimization**

Attach methods to a metatable so all objects share the same method table, instead of storing one copy per object.

Example:

```lua
-- Not recommended
local obj1 = { value = 1 }
local obj2 = { value = 2 }
function obj1:increment() self.value = self.value + 1 end
function obj2:increment() self.value = self.value + 1 end

-- Recommended
local mt = {
    increment = function(self) self.value = self.value + 1 end
}

local obj1 = setmetatable({ value = 1 }, mt)
local obj2 = setmetatable({ value = 2 }, mt)
```

## 3. Testing and Debugging

**3.1 Unit testing**

Use frameworks such as `busted` or `luaunit` to exercise code across many inputs.

**3.2 Debugging tools**

Use the standard `debug` library (`debug.traceback`, `debug.getinfo`) or an IDE with a debugger such as ZeroBrane Studio. `luasocket` is a networking library, not a debugging tool.

**3.3 Error handling**

Use `pcall` and `xpcall` to catch runtime errors. Error messages should identify the location of the failure.

Example:

```lua
local function safe_divide(a, b)
    if b == 0 then
        print("Error: division by zero")
        return nil
    end
    -- a / b does not raise an error when b is 0; check for division by zero explicitly.
    -- pcall catches runtime errors such as invalid argument types.
    local status, result = pcall(function() return a / b end)
    if not status then
        print("Error: " .. tostring(result))
        return nil
    end
    return result
end

print(safe_divide(10, 2))   -- 5.0
print(safe_divide(10, 0))   -- Error: division by zero
print(safe_divide("x", 2))  -- Error: ... (arithmetic error caught by pcall)
```

## 4. Deployment and Release

**4.1 Cross-platform support**

Use the standard library where possible and avoid platform-specific features so code runs across platforms.

**4.2 Performance monitoring**

Use tools such as `LuaProfiler` in production to track script execution and locate bottlenecks.

**4.3 Code review**

Run code review before release to catch errors and inconsistencies early.

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html)
- [lua-users wiki](http://lua-users.org/wiki/)

## Related pages

- [code-style](code-style.md)
