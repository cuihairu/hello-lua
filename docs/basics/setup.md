# Getting Started

Before using Lua, set up the environment: install the interpreter, pick an editor or IDE you like, and add LuaRocks for packages. The installation and editor details each have their own page; this one gives an overview of what the environment consists of, and the LuaRocks part is spelled out here.

## 1. Installing Lua

Install per platform — Windows, macOS, Linux: on Windows use the official source package or the prebuilt [LuaBinaries](https://luabinaries.sourceforge.net/); on macOS go through Homebrew; on Linux use your distribution's package manager (`apt-get`, `dnf`, `pacman`). The package manager is the least trouble; build from source only when you need a specific version or a special configuration. Verify afterwards with `lua -v`. Full steps are in [Installing Lua](/basics/install).

## 2. IDEs and editors

Lua can be written in any text editor, but one with completion and debugging support saves a lot of effort. The usual choices are VSCode (with the Lua Plus or EmmyLua extension), ZeroBrane Studio (a Lua-specific IDE that works out of the box), IntelliJ IDEA / PyCharm (EmmyLua plugin), Sublime Text, and Notepad++. For a comparison and setup instructions see [IDE recommendations](/basics/ide-recommendations).

## 3. LuaRocks: Lua's package manager

### 3.1 Installing LuaRocks

LuaRocks is the package manager for Lua, used to install and manage third-party libraries for a project. The install differs slightly per platform:

- Windows: download the Windows installer from the [LuaRocks site](https://luarocks.org/), or install it alongside LuaBinaries.
- macOS and Linux: install via Homebrew or your package manager:
    ```bash
    brew install luarocks
    ```
    Or build from source (use whatever version is currently listed on the [LuaRocks site](https://luarocks.org/)):
    ```bash
    wget https://luarocks.org/releases/luarocks-3.13.0.tar.gz
    tar zxpf luarocks-3.13.0.tar.gz
    cd luarocks-3.13.0
    ./configure; sudo make bootstrap
    ```

### 3.2 Installing packages with LuaRocks

Once installed, use LuaRocks to install and manage third-party Lua libraries. For example, to install `luasocket`:
```bash
luarocks install luasocket
```

## Wrap-up

With the environment ready, try a few snippets in the `lua` interactive mode first, install a library or two with LuaRocks, and then move on to [Syntax](/basics/syntax).

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua download page](https://www.lua.org/download.html)
- [Lua 5.4 reference manual](https://www.lua.org/manual/5.4/manual.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](/knowledge/README.md)
- [official-docs](/knowledge/official-docs.md)
