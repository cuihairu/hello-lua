# Package management in Lua

Lua does not ship with a built-in package manager. Installing and managing modules is done with the `package` library plus external tools like LuaRocks.

## 1. Lua's package management mechanism

### 1.1 The `package` library

The `package` library provides the basic facilities for handling modules and packages. It has four main fields:

- `package.path`: the search path used to find Lua script modules.
- `package.cpath`: the search path used to find C extension modules.
- `package.loaded`: a table holding already-loaded modules.
- `package.preload`: a table used to preload modules.

These mechanisms can be used to manage module loading and caching.

### 1.2 Custom module paths

You can add custom module search paths by modifying `package.path` and `package.cpath`. For example:

```lua
-- add a custom path for Lua modules
package.path = package.path .. ";./my_modules/?.lua"

-- add a custom path for C extension modules
package.cpath = package.cpath .. ";./my_modules/?.so"
```

## 2. Package management tools for Lua

Lua's built-in package management is quite basic, but several external tools help manage Lua packages and modules:

### 2.1 LuaRocks

LuaRocks is Lua's package manager, used to install and manage Lua modules, with a command-line tool.

- Installing LuaRocks:
  - On Linux systems, you can install it through the package manager (for example `apt-get install luarocks`).
  - You can also download and install it from the [LuaRocks website](https://luarocks.org/).

- Common commands:
  - Install a package: `luarocks install <package-name>`
  - Uninstall a package: `luarocks uninstall <package-name>`
  - List installed packages: `luarocks list`
  - Search for packages: `luarocks search <package-name>`

### 2.2 Example: installing a module with LuaRocks

```bash
luarocks install penlight
```

This downloads and installs the Lua module named `penlight` from the LuaRocks server.

### 2.3 OpenResty

OpenResty is a Lua platform based on Nginx. It ships with an integrated set of Lua modules and supports Lua scripts inside Nginx, with its own mechanism for installing and managing modules.

### 2.4 Manual management

Besides LuaRocks, you can also manage Lua modules manually: download the module source code, put it in an appropriate directory, and add those directories to `package.path` or `package.cpath`. For example, download a Lua module from GitHub, place it in the project's `libs` directory, then update `package.path`.

## 3. Best practices for package management in Lua

### 3.1 Use LuaRocks

It is recommended to manage packages with LuaRocks; it handles installation, uninstallation, versions, and dependencies.

### 3.2 Organize your modules

Organize modules by directory structure, typically putting all modules in a `modules` or `libs` directory and grouping them by feature.

### 3.3 Update and maintain

Update installed packages regularly to get new features and bug fixes. LuaRocks can check and update installed modules directly.

### 3.4 Handle dependencies

When handling dependencies, the main thing to watch for is version conflicts. LuaRocks' dependency management covers most cases.

### 3.5 Version control

Track changes to custom modules in your project with a version control tool (such as Git) so you can roll back when needed.

## Summary

Day-to-day package management comes down to four things: where modules come from (LuaRocks or manual download), which directory they live in, how to update them, and how to resolve dependency conflicts. The `package` library handles searching and caching; leave the rest to LuaRocks.

## References

- [Lua 5.4 reference manual · 6.3 Packages](https://www.lua.org/manual/5.4/manual.html#6.3)
- [Package_(software)](https://en.wikipedia.org/wiki/Package_(software))
- [LuaRocks package manager home page](https://luarocks.org/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [modules-and-packages](modules-and-packages.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
