# Design of Lua's Module System

Lua's module system is simple to design and supports dynamic loading, modular development, and extension. This page covers goals, definition, loading, paths, hot reloading, dynamic linking, and error handling.

---

## 1. Goals of the Module System

The module system aims to provide a simple, flexible, and efficient way to organize and manage code, in four concrete points: modularity, so code split into multiple modules can be developed, tested, and maintained independently; reusability, so modular design promotes reuse and sharing; dynamic loading, so modules load and update at run time; and extensibility, so external extensions (such as C modules) add capability.

---

## 2. Defining and Returning a Module

In Lua, a module is usually defined as a table. The last line of a module file usually returns that table, letting other scripts access the module's functionality through `require`.

Example: defining and returning a module

```lua
-- mymodule.lua
local M = {}

function M.say_hello(name)
    return "Hello, " .. name
end

return M
```

This code creates a table `M` to hold the module's functionality and returns it at the end of the file; other modules load it with `require("mymodule")`.

---

## 3. Loading Modules

Lua uses the `package` library to handle module loading. `require` loads and initializes a module: it looks up Lua files by `package.path` and C extension libraries by `package.cpath`.

Example: loading a module

```lua
local mymodule = require("mymodule")
print(mymodule.say_hello("World"))
```

`require("mymodule")` searches `package.path` for and loads `mymodule.lua`; the returned table `mymodule` contains all the module's functionality.

---

## 4. Module Paths

`package.path` is the path for Lua script modules, and `package.cpath` is the path for C extension libraries.

Example: configuring module paths

```lua
package.path = package.path .. ";./mymodules/?.lua"
package.cpath = package.cpath .. ";./mymodules/?.so"
```

`package.path` specifies the search path for Lua files and can contain multiple paths and wildcards; `package.cpath` specifies the search path for C extension libraries, usually including platform-specific suffixes (such as `.so` or `.dll`).

---

## 5. Hot Reloading Modules

Hot reloading updates a module at run time without restarting the application, usually by calling `require` again to reload it.

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

The idea is to watch the module file for changes; on a detected change, clear the old module from `package.loaded` and call `require` again to load the updated module.

---

## 6. Dynamic Linking and Loading

Dynamic linking lets you load shared libraries or C extensions at run time; Lua implements this with `package.loadlib`.

Example: dynamic linking

```lua
-- Load the shared library and call its init function
local mylib = package.loadlib("mylib.so", "luaopen_mylib")

-- Run the init function
if mylib then
    mylib()
end
```

`package.loadlib` loads a shared library (such as `mylib.so`) and calls the named initialization function (such as `luaopen_mylib`).

---

## 7. Module Error Handling

Loading a module can fail—the file may be missing or the load may fail—and Lua provides mechanisms to catch and handle these errors.

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
    print(mymodule.say_hello("World"))
end
```

`pcall` catches errors inside `require`, so the program does not crash when loading fails.

---

## Summary

Modules are defined as tables, loaded with `require`, and cached in `package.loaded`; the search path is determined by `package.path`/`package.cpath`, and dynamic linking goes through `package.loadlib`. This mechanism is simple and direct, usable in both embedded scenarios and complex application development.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#6.3)
- [Module_(computer_science)](https://en.wikipedia.org/wiki/Module_(computer_science))

## Related pages

- [module-system](module-system.md)
