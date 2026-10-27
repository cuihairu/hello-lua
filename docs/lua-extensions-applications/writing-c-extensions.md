# Writing Lua C Extensions

Lua C extensions expose C functions to Lua scripts for them to call. The flow is three steps: write a C file, compile it into a shared library, and `require` it in the script.

---

## 1. Writing the C Extension

First write a C file, defining the C functions to expose to Lua and registering them.

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

// C function: compute the sum of two numbers
static int l_sum(lua_State *L) {
    lua_Integer a = luaL_checkinteger(L, 1);  // Get the first argument
    lua_Integer b = luaL_checkinteger(L, 2);  // Get the second argument
    lua_pushinteger(L, a + b);               // Return the result
    return 1;                                // Return one result
}

// Module function table
static const luaL_Reg mylib_funcs[] = {
    {"sum", l_sum},
    {NULL, NULL}
};

// Module entry: called automatically by Lua on require("mylib")
int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib_funcs);   // Create the module table and register the functions
    return 1;                      // Return the module table (the return value of require)
}
```

A few key points:
- `l_sum` is a function defined in C that will perform an operation in the Lua script.
- `luaL_newlib` creates the module table and fills it with the functions from `mylib_funcs`.
- `luaopen_mylib` is the module entry name the Lua C API requires: `require("mylib")` calls it and treats the return value as the module. So it must return one value (the module table); returning 0 makes `require` return `true`, and the subsequent `mylib.sum` will error.

---

## 2. Compiling the C Extension

Lua can only load the C code once it is compiled into a shared library.

On Linux:

```sh
gcc -shared -o mylib.so -fPIC mylib.c -I/usr/local/include
```

On Windows:

```sh
gcc -shared -o mylib.dll mylib.c -I/path/to/lua/include
```

What the flags mean: `-shared` produces a shared library, `-fPIC` produces position-independent code (needed on Linux), and `-I` points to the directory holding the Lua headers, adjusted to your local Lua installation. `mylib.so` or `mylib.dll` is the build output; on Windows you usually also need to link the Lua import library (such as `-llua54`) and make sure the Lua DLL is findable at runtime.

---

## 3. Using the C Extension in a Lua Script

In the script, `require` it and you can call the extension's functions.

```lua
local mylib = require("mylib")  -- Load the C extension
print(mylib.sum(10, 20))        -- Call the C function
```

`require("mylib")` loads the shared library named `mylib`, and `mylib.sum(10, 20)` calls the `sum` function in the C extension with arguments.

---

## 4. Debugging and Error Handling

Two kinds of errors are most common. If compilation fails, first check that the C code follows the C standard and that the shared library path is correct. For runtime errors, catch them in Lua with `pcall` and print:

```lua
local status, result = pcall(function() return mylib.sum(10, "text") end)
if not status then
    print("Error:", result)
else
    print("Result:", result)
end
```

`pcall` is a protected call; any error raised while the function runs is caught by it, so the script is not crashed.

## References

- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html#4)
- [Resource_acquisition_is_initialization](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization)

<!-- BACKLINKS-AUTO -->
## Related pages

- [applications](/knowledge/applications.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
