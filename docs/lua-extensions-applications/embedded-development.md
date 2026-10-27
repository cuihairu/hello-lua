# Embedded Development

Lua is small and low-overhead, so it is often embedded into resource-constrained environments. This page covers how to integrate it, what you can do with it, and the issues you will run into.

## 1. Why Use Lua

The main reason is size: Lua has very low code and memory overhead, making it suited to resource-constrained embedded systems. Scripts can be loaded and executed at runtime, so changing configuration or adding features does not require recompiling; the C API is also simple, so embedding into C/C++ code is easy.

## 2. Integrating Lua in Embedded Development

### 2.1 Getting the Lua Source

Download the source from the Lua official website:

```bash
wget https://www.lua.org/ftp/lua-5.4.8.tar.gz
tar -zxvf lua-5.4.8.tar.gz
cd lua-5.4.8
```

### 2.2 Compiling Lua

In an embedded system, Lua usually has to be compiled into a library suited to the target platform.

Build natively:

```bash
make linux
```

Moving to a different embedded platform means cross-compiling, for example with `arm-none-eabi-gcc`. Lua's Makefile has no `CROSS` variable, so supply the toolchain via `CC` (the `generic` target depends on no platform-specific library and suits bare-metal scenarios, among others):

```bash
make generic CC=arm-none-eabi-gcc
```

### 2.3 Integrating Lua into the Embedded System

Using Lua in C/C++ code has four steps.

1. Initialize the Lua environment

```c
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"

lua_State *L = luaL_newstate();
luaL_openlibs(L);
```

2. Load and execute a Lua script

```c
if (luaL_dofile(L, "script.lua") != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
}
```

3. Call Lua functions from C/C++

```c
lua_getglobal(L, "lua_function");
lua_pushnumber(L, 42);
if (lua_pcall(L, 1, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
} else {
    int result = lua_tonumber(L, -1);
    printf("Result: %d\n", result);
    lua_pop(L, 1);
}
```

4. Call C/C++ functions from Lua

```c
int c_function(lua_State *L) {
    int arg = luaL_checkinteger(L, 1);
    lua_pushinteger(L, arg + 1);
    return 1;
}

lua_register(L, "c_function", c_function);
```

On the Lua script side:

```lua
result = c_function(10)
print("Result from C function:", result)
```

### 2.4 Resource Management

In resource-constrained environments, remember to release the Lua state when done:

```c
lua_close(L);
```

## 3. Embedded Lua Application Examples

### 3.1 Configuration Files

A Lua script can serve as a configuration file, so users can change settings without recompiling the code.

config.lua:

```lua
setting1 = true
setting2 = "value"
```

Read it on the C side:

```c
luaL_dofile(L, "config.lua");
lua_getglobal(L, "setting1");
int setting1 = lua_toboolean(L, -1);
lua_pop(L, 1);
```

### 3.2 Dynamic Script Execution

Lua allows scripts to be loaded and executed dynamically, which suits embedded systems that need to adjust behavior at runtime.

script.lua:

```lua
function dynamic_function(x)
    return x * 2
end
```

Execute it on the C side:

```c
luaL_dofile(L, "script.lua");
lua_getglobal(L, "dynamic_function");
lua_pushnumber(L, 5);
if (lua_pcall(L, 1, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
} else {
    int result = lua_tonumber(L, -1);
    printf("Dynamic Function Result: %d\n", result);
    lua_pop(L, 1);
}
```

## 4. Challenges in Embedded Development

First, watch memory: Lua's stack and memory use must not exceed the embedded system's limits. In performance-critical applications, Lua alone is not enough; implement the hot spots in C code. Debugging is also not easy, since mixed Lua and C code is awkward to trace; logging and debugging tools help.

## References

- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html#4)
- [Dynamic_linking](https://en.wikipedia.org/wiki/Dynamic_linking)

<!-- BACKLINKS-AUTO -->
## Related pages

- [applications](/knowledge/applications.md)
- [core-concepts](/knowledge/core-concepts.md)
