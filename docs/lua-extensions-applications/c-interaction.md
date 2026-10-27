# Interacting with C and Lua

The call between Lua and C is bidirectional: C can operate the Lua VM, execute scripts, and call Lua functions, and Lua can call C in turn. The interface is the Lua C API.

---

## 1. The Lua C API

The Lua C API provides a set of functions for operating the Lua VM from C: loading and executing scripts, calling functions, and retrieving data.

- Create and close a Lua state:
  ```c
  lua_State *L = luaL_newstate();  // Create a new Lua state
  luaL_openlibs(L);                // Open the Lua standard libraries
  // Execute Lua code
  lua_close(L);                    // Close the Lua state
  ```

- Execute a Lua script:
  ```c
  if (luaL_dofile(L, "script.lua") != LUA_OK) {
      fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
  }
  ```

- Call a Lua function:
  ```c
  lua_getglobal(L, "lua_function");  // Get the function from Lua
  lua_pushnumber(L, 10);             // Push an argument
  lua_pushnumber(L, 20);

  if (lua_pcall(L, 2, 1, 0) != LUA_OK) {  // Call the Lua function
      fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
  }

  double result = lua_tonumber(L, -1);  // Get the return value
  lua_pop(L, 1);                       // Pop the return value
  ```

The roles of these calls:
- `lua_getglobal` retrieves a global variable (function) from Lua.
- `lua_pushnumber` pushes data onto the Lua stack.
- `lua_pcall` calls a Lua function and handles possible errors.
- `lua_tonumber` converts data on the Lua stack into a numeric C type.
- `lua_pop` pops data off the Lua stack.

---

## 2. Writing a Lua C Extension

A C extension exposes C functions to Lua. It usually ships as a shared library, with registration done in the module entry function.

A minimal extension:

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

// C function: compute the sum of two numbers
static int l_sum(lua_State *L) {
    lua_Integer a = luaL_checkinteger(L, 1);
    lua_Integer b = luaL_checkinteger(L, 2);
    lua_pushinteger(L, a + b);
    return 1;
}

// Module function table
static const luaL_Reg mylib_funcs[] = {
    {"sum", l_sum},
    {NULL, NULL}
};

// Module entry: called automatically by Lua on require("mylib"); the return value is the module table
int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib_funcs);
    return 1;
}
```

Compile and use:
1. Compile the C code above into a shared library (adjust the header paths to your local Lua installation).
   ```sh
   gcc -shared -o mylib.so -fPIC mylib.c -I/usr/local/include
   ```
2. Load and call the C extension from a Lua script.
   ```lua
   local mylib = require("mylib")
   print(mylib.sum(10, 20))  -- Output 30
   ```
   Note: `require` returns the module table returned by `luaopen_mylib`; if the module entry does not return a table, `require("mylib")` returns `true`, and `mylib.sum` will error.

---

## 3. Calling Lua Code from C

A C program can call Lua functions, passing arguments and receiving return values. From creating the state to releasing it, one complete pass:

```c
lua_State *L = luaL_newstate();
luaL_openlibs(L);

// Load and execute a Lua script
luaL_dofile(L, "script.lua");

// Call a Lua function
lua_getglobal(L, "lua_function");  // Get the function from Lua
lua_pushnumber(L, 10);             // Push an argument
lua_pushnumber(L, 20);
if (lua_pcall(L, 2, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
}

double result = lua_tonumber(L, -1);  // Get the return value
lua_pop(L, 1);                       // Pop the return value

lua_close(L);
```

Three key calls:
- `lua_getglobal` gets the global function from Lua.
- `lua_pcall` calls the Lua function and handles errors.
- `lua_tonumber` converts the return value on the Lua stack into a numeric C type.

---

## 4. Common Issues

When calling a Lua function with `lua_pcall`, always check the return value, then use `lua_tostring` to get the detailed error message. When operating on Lua data from C, watch the data type conversions and the order of stack operations. Manage the Lua state's lifetime too: close it when you are done to avoid memory leaks.

## References

- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html#4)
- [Resource_acquisition_is_initialization](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
