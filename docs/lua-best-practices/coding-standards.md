# Lua Coding Standards

I keep code style and coding standards in separate documents: the former is about how code looks, the latter about reducing errors. Below are the conventions commonly used in this project, covering naming, formatting, comments, scope, tables, error handling, and code organization.

## 1. Variable Naming

Names should describe their purpose; avoid meaningless abbreviations or single letters. For style, snake_case or camelCase both work, but pick one: `user_name` or `userName`. Table names use nouns, such as `user`, `config`; tables representing classes or modules can use camel case, such as `UserSettings`.

Example:

```lua
local user_name = "Alice"  -- underscore-separated
local UserName = "Alice"   -- camelCase
```

## 2. Function Naming

Function names follow "verb + noun", stating what they do and to what: `calculate_sum`, `get_user_data`. Pick one style across the codebase and don't mix.

Example:

```lua
-- Calculate the sum of two numbers
function calculate_sum(a, b)
    return a + b
end

-- Get user data
function get_user_data(user_id)
    -- implementation
end
```

## 3. Indentation and Formatting

Use 2 spaces for indentation, not tabs, so every editor displays it consistently. Keep each line within 80 to 120 characters.

Leave spaces around operators and none between parentheses and the function name: `a + b` rather than `a+b`, `function foo(arg)` rather than `function foo (arg)`.

Example:

```lua
local x = 12

-- Not recommended (valid syntax, but everything squeezed onto one line is hard to read)
if(x>10)then return x+5 end

-- Recommended
if x > 10 then
    return x + 5
end
```

## 4. Comments

Add comments to complex or non-obvious logic, describing intent in short sentences. Document functions, modules, and classes in a LuaDoc-style format, covering parameters, return values, and usage examples fully.

Example:

```lua
--- Calculate the sum of two numbers
-- @param a the first number
-- @param b the second number
-- @return the sum of the two numbers
function add(a, b)
    return a + b
end
```

## 5. Local and Global Variables

Declare variables with `local` to reduce name conflicts and access them faster. Avoid globals unless necessary; when you must use one, give it a clear prefix such as `MyApp_globalVar`. Don't put variables or functions in the global scope; organize functionality into modules.

Example:

```lua
-- Not recommended
global_var = 42

function global_function()
    return global_var
end

-- Recommended
local local_var = 42

local function local_function()
    return local_var
end
```

## 6. Tables

Group related data and methods into one table, using tables to simulate objects and data structures. When using strings as keys, prefer quoting them, `table["key"]` instead of `table.key`, especially when the key contains special characters.

Example:

```lua
-- Define a user table
local user = {
    name = "Alice",
    age = 30
}

-- Access a field in the table
print(user["name"])  -- access with a string key
```

## 7. Error Handling

Wrap code that may raise runtime errors in `pcall` instead of relying only on `assert`. Write clear error messages to save debugging time.

Example:

```lua
local success, result = pcall(function()
    -- code that may error
end)

if not success then
    print("Error: " .. result)
end
```

## 8. Code Organization

One module does one thing. Load it with `require`, and export the module table with `return` at the end of the file (the `module` function has been removed since Lua 5.2; don't use it). Keep file and directory structure clear, and don't cram all code into one file. Keep functions short: one function, one job; split long ones into smaller functions.

Example:

```lua
-- math_utils.lua
local MathUtils = {}

function MathUtils.add(a, b)
    return a + b
end

return MathUtils
```

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.2)
- [lua-users wiki](http://lua-users.org/wiki/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](/knowledge/README.md)
- [pitfalls](/knowledge/pitfalls.md)
- [code-style](code-style.md)
