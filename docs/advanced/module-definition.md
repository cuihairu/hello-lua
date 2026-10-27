# Defining and loading modules

A Lua module is just a Lua file that returns a table. The table holds the functions and data the module provides, and you load it with `require`.

## 1. Defining a module

### 1.1 Defining a module

A Lua module is typically a Lua file: define a table, put your functions and data in it, and return that table at the end. A simple example:

```lua
-- math_utils.lua
local M = {}  -- an empty table M to hold the module's functionality

-- define the module's functions
function M.add(a, b)
    return a + b
end

function M.subtract(a, b)
    return a - b
end

return M  -- return table M
```

In this example, the `math_utils` module provides two functions: `add` and `subtract`. These are packaged into the table `M`, which is returned as the module's interface.

### 1.2 Naming a module

A module's filename should match its module name. For example, the file for the `math_utils` module should be named `math_utils.lua`. Lua's `require` function looks up the corresponding file based on the module name.

## 2. Loading modules

### 2.1 Loading a module with `require`

`require` takes a module name, returns the module's table, and you can then access the module's functions through that table:

```lua
local math_utils = require("math_utils")  -- load the math_utils module

print(math_utils.add(3, 5))         -- prints 8
print(math_utils.subtract(10, 4))   -- prints 6
```

The `require` function automatically finds the module file and executes the Lua code in it. After execution, the module's table is returned, and you can access the module's functions through the table.

### 2.2 Module search paths

Lua uses `package.path` and `package.cpath` to specify module search paths:

- `package.path`: the path used to look up Lua script modules. By default, it contains some common path patterns like `./?.lua`, meaning Lua will look for `.lua` files in the current directory.
- `package.cpath`: the path used to look up C extension modules. By default, it contains C extension path patterns like `./?.so`, meaning Lua will look for `.so` files in the current directory (on Unix-like systems).

### 2.3 Configuring module paths

Modify `package.path` and `package.cpath` to add custom module search paths. For example:

```lua
package.path = package.path .. ";./my_modules/?.lua"
package.cpath = package.cpath .. ";./my_modules/?.so"
```

Here, `?.lua` and `?.so` are placeholders in the path pattern; `?` is replaced with the module name. This way, Lua will look for module files in the `./my_modules/` directory.

### 2.4 Module caching

`require` caches modules it has already loaded to avoid reloading and re-executing them. The cache lives in the `package.loaded` table. To force a reload, manually clear the corresponding cache entry. For example:

```lua
package.loaded["math_utils"] = nil
local math_utils = require("math_utils")  -- reload the module
```

## Summary

Defining a module is just creating a table and returning it. Loading relies on `require`, which looks up files via `package.path` and `package.cpath` and caches the result in `package.loaded`. Clear the cache, and the next `require` will re-execute the file.

## References

- [Lua 5.4 reference manual](https://www.lua.org/manual/5.4/manual.html)
- [Lua official documentation index](https://www.lua.org/docs.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [modules-and-packages](modules-and-packages.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
