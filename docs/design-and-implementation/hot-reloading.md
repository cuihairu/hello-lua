# Hot Reloading and Dynamic Updates

Hot reloading lets a program update modules at run time without restarting, suiting scenarios that need frequent updates or bug fixes. Lua's module system supports this directly.

---

## 1. The Concept of Hot Reloading

Hot reloading means dynamically loading, updating, or unloading modules while the program runs, without restarting it. You can modify and debug while the application runs: feature updates with no downtime, code changes take effect immediately, and the number of restarts during development and testing drops.

---

## 2. Hot Reloading in Lua

Lua's hot reloading revolves around `package.loaded`, the table that caches loaded modules; operating on it reloads a module. The concrete approach is to clear the old module from `package.loaded` and call `require` again.

Example: reloading a module

```lua
-- module file: mymodule.lua
local M = {}

function M.say_hello(name)
    return "Hello, " .. name
end

return M
```

```lua
-- main program
local function reload_module(module_name)
    package.loaded[module_name] = nil
    return require(module_name)
end

local mymodule = require("mymodule")
print(mymodule.say_hello("World"))

-- simulate a file update and reload
mymodule = reload_module("mymodule")
print(mymodule.say_hello("Lua"))
```

`reload_module` clears the old module from `package.loaded` and reloads it, so the module updates without restarting the program.

---

## 3. Use Cases

Typical cases: games loading a new level or fixing a bug while running; web applications updating functionality or fixing issues while the server runs; embedded systems updating firmware or config without restarting the device.

Example: dynamic update in a web application

```lua
-- Lua web application example

local function handle_request()
    local module_name = "handler_module"
    local handler = require(module_name)
    -- handle the request
    handler.process_request()
end

-- simulate file-change detection (file_changed is pseudocode, expressing the flow)
local function watch_file_changes()
    while true do
        if file_changed("handler_module.lua") then
            package.loaded["handler_module"] = nil
            print("Module updated. Reloading...")
            require("handler_module")
        end
        -- wait a bit before checking again
        os.execute("sleep 1")
    end
end

-- start the file-watching thread
watch_file_changes()
```

This example watches `handler_module.lua` for changes and reloads the module when one is detected; request handling uses the latest module logic.

---

## 4. Cautions

Three things need care. On performance, frequent hot reloading costs; balance update frequency against application performance. On state, reloading a module can lose state, so module state must be recoverable after an update. On dependencies, all dependent modules must load correctly during hot reloading, or dependency problems cause errors.

---

## Summary

Lua's hot-reloading mechanism is itself tiny: clear `package.loaded`, call `require` again. The engineering effort goes into state recovery, dependency management, and update-frequency control; once those three are solid, hot reloading is reliable.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html)
- [Dynamic_linking](https://en.wikipedia.org/wiki/Dynamic_linking)

<!-- BACKLINKS-AUTO -->
## Related pages

- [modules-and-packages](/advanced/modules-and-packages.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
