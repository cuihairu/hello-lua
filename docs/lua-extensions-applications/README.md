# Extensions and Applications

Lua is a lightweight scripting language with a strong extension story, and the most common extension target is C/C++. This group covers three directions: interaction with C, embedded development, and LuaJIT.

---

## 1. Interaction between C and Lua

Lua and C are deeply integrated: C can call Lua, and Lua can call C, and both paths use the Lua C API — a set of C functions that manipulate a Lua state from C code. A C extension is C code written against this API, either to add features to Lua or to move hot logic into C.

A minimal C extension:

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

// C function: sum two numbers
static int l_sum(lua_State *L) {
    // Read the arguments
    lua_Integer a = luaL_checkinteger(L, 1);
    lua_Integer b = luaL_checkinteger(L, 2);

    // Compute the sum and push it onto the stack
    lua_pushinteger(L, a + b);

    // Return the number of results
    return 1;
}

// Module function table
static const luaL_Reg mylib_funcs[] = {
    {"sum", l_sum},
    {NULL, NULL}
};

// Module entry point: called automatically by Lua on require("mylib")
int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib_funcs);  // Build the module table and register the functions
    return 1;                     // Return the module table
}
```

A few key points:
- `luaL_checkinteger` reads an argument passed to the C function.
- `lua_pushinteger` pushes a result onto the Lua stack.
- `luaopen_mylib` is the module entry point: `require("mylib")` calls it and treats its **return value as the module itself**. The module table must therefore be created here (`luaL_newlib`) and one value returned. If you only register the functions globally with `lua_register` and return no table, `require("mylib")` yields `true`, and the following `mylib.sum(...)` errors.

Compile and use:
1. Compile the C extension into a shared library with `gcc` (adjust the header path for your Lua installation):

   ```sh
   gcc -shared -fPIC -o mylib.so mylib.c -I/usr/local/include
   ```

2. Load the shared library from a Lua script with `require` and call the registered C function.

```lua
-- Lua script
local mylib = require("mylib")
print(mylib.sum(10, 20))  -- prints 30
```

---

## 2. Embedded development

Lua is small in code and memory and runs fast enough that it is often embedded in resource-constrained environments. Common uses: game engines use it for game logic, routers and switches use it for configuration and automation, and applications use it as a plugin system so users can extend behavior with scripts.

Running a script from inside a C program takes just a few lines:

```c
#include <stdio.h>
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

void run_lua_script(const char *script) {
    lua_State *L = luaL_newstate();  // Create a Lua state
    luaL_openlibs(L);  // Open the Lua standard library

    if (luaL_dofile(L, script) != LUA_OK) {
        fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    }

    lua_close(L);  // Close the Lua state
}
```

Three calls:
- `luaL_newstate` creates a new Lua state.
- `luaL_openlibs` opens the Lua standard library.
- `luaL_dofile` runs a Lua script file.

---

## 3. LuaJIT

LuaJIT is a high-performance Lua implementation: faster than the standard interpreter and more capable. It adds two things standard Lua lacks: a JIT compiler that turns Lua bytecode into machine code, and an FFI library that lets Lua call C functions and use C data structures without writing a C extension.

Calling a C function with FFI:

```lua
local ffi = require("ffi")

-- Declare the C function
ffi.cdef[[
    int add(int a, int b);
]]

-- Load the C library
local mylib = ffi.load("mylib")

-- Call the C function
print(mylib.add(10, 20))  -- prints 30
```

In this script:
- `ffi.cdef` declares C functions.
- `ffi.load` loads a C shared library.
- The C function is called directly, with no C extension to write.

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#4)
- [Resource_acquisition_is_initialization](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization)

<!-- BACKLINKS-AUTO -->
## Related pages

- [applications](/knowledge/applications.md)
