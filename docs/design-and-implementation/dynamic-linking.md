# Dynamic Linking and Module Loading

In Lua, dynamic linking and module loading are key parts of the module system: they let a Lua program load and use external modules at run time.

## 1. Overview

Dynamic linking means loading a shared library or module while the program runs, rather than linking it statically at compile time. Module loading means loading a module's code into the Lua environment so the program can use the features it provides.

## 2. Module Paths

Lua configures the search paths with `package.path` and `package.cpath`: `package.path` is for Lua script modules, searched as `.lua` files; `package.cpath` is for C extension modules, searched as shared libraries (such as `.so` or `.dll`).

Example: configuring module paths

```lua
-- Add a path to package.path
package.path = package.path .. ";./mymodules/?.lua"

-- Add a path to package.cpath
package.cpath = package.cpath .. ";./mymodules/?.so"
```

## 3. Defining and Returning a Module

A Lua module file is usually defined as a table and returned at the end of the file, which lets other scripts get its contents through `require`.

Example: defining and returning a module

```lua
-- mymodule.lua
local M = {}

function M.say_hello(name)
    return "Hello, " .. name
end

return M
```

## 4. Loading Modules

### 4.1 Loading a Lua Module

`require` loads Lua modules: it searches `package.path`, loads and runs the module file, and returns the module table. For the `mymodule` above:

Example: loading a Lua module

```lua
local mymodule = require("mymodule")
print(mymodule.say_hello("World"))  -- prints Hello, World
```

### 4.2 Loading a C Extension Module

C extension modules are written in C and compiled into shared libraries. `require` loads them too. Shared library filenames usually end in `.so` (Linux) or `.dll` (Windows).

Example: loading a C extension module

```lua
local mylib = require("mylib")  -- assume mylib.so or mylib.dll is on package.cpath
print(mylib.some_c_function())
```

## 5. Dynamically Loading C Extensions

`package.loadlib` loads a C extension dynamically. It loads a shared library and calls the named initialization function.

Example: dynamically loading a C extension

```lua
-- Load the shared library and call its init function
local mylib = package.loadlib("mylib.so", "luaopen_mylib")

-- Run the init function
if mylib then
    mylib()
end
```

## 6. Hot Reloading and Dynamic Updates

### 6.1 Hot Reloading

Hot reloading updates a module at run time without restarting the program. Watching module file changes lets you reload a module to apply new features or fix problems.

Example: simple hot reloading

```lua
local module = require("mymodule")

-- Watch for file changes and reload (pseudocode)
while true do
    if file_changed("mymodule.lua") then
        package.loaded["mymodule"] = nil
        module = require("mymodule")
    end
end
```

### 6.2 Dynamic Updates

A dynamic update modifies a module at run time: either reload the module, or change its table directly.

Example: dynamically updating a module

```lua
local mymodule = require("mymodule")

-- Add a new feature dynamically
mymodule.new_feature = function()
    return "New feature added!"
end

print(mymodule.new_feature())
```

## 7. Error Handling

Module loading can fail—the module file may be missing, the load may fail, and so on. Use the error-handling mechanism to catch these errors.

Example: error handling

```lua
local function safe_require(module_name)
    local status, module = pcall(require, module_name)
    if not status then
        print("Error loading module: " .. module_name)
        return nil
    end
    return module
end

local mymodule = safe_require("mymodule")
if mymodule then
    print(mymodule.say_hello("World"))  -- prints Hello, World
end
```

## Summary

Configuring `package.path`/`package.cpath`, loading Lua and C extension modules with `require`, clearing `package.loaded` for hot reloading, and catching load errors with `pcall`—these four things cover the everyday work of Lua dynamic linking and module loading.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#8)
- [Dynamic_linking](https://en.wikipedia.org/wiki/Dynamic_linking)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
