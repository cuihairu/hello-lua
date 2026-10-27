# Calling Lua Code from C

Calling Lua code from C goes through the Lua C API: executing Lua scripts, calling Lua functions, and handling return values all revolve around a `lua_State` and its stack.

## 1. Initializing the Lua Environment

Everything is based on a Lua state (`lua_State`); the first step is to create it.

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

int main() {
    lua_State *L = luaL_newstate();  // Create a new Lua state
    luaL_openlibs(L);                // Open the Lua standard libraries

    // Write your code here...

    lua_close(L);                    // Close the Lua state
    return 0;
}
```

`luaL_newstate` creates the state and `luaL_openlibs` loads the Lua standard libraries; before exiting, use `lua_close` to close the state and release resources.

## 2. Loading and Executing Lua Scripts

The code can come from a file or from a string, each with its own entry point.

Load from a file:

```c
if (luaL_dofile(L, "script.lua") != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // Handle the error
}
```

Load from a string:

```c
const char *lua_code = "print('Hello from Lua!')";
if (luaL_dostring(L, lua_code) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // Handle the error
}
```

The two entry points match the two sources: `luaL_dofile` reads a file and `luaL_dostring` executes a string. On failure, the error message sits on top of the stack; retrieve it with `lua_tostring(L, -1)`.

## 3. Calling Lua Functions

A call has three steps: push the function onto the stack, push the arguments, and after the call retrieve the return values.

```c
// Call a Lua function
lua_getglobal(L, "my_function");  // Get the global Lua function
lua_pushnumber(L, 10);            // Push argument 1
lua_pushnumber(L, 20);            // Push argument 2

if (lua_pcall(L, 2, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // Handle the error
} else {
    double result = lua_tonumber(L, -1);  // Get the return value
    printf("Result: %f\n", result);
    lua_pop(L, 1);  // Clean the stack
}
```

`lua_getglobal` pushes the global function onto the stack, `lua_pushnumber` pushes the arguments, `lua_pcall` initiates the call and receives the return values, and `lua_tonumber` reads the result from the stack.

## 4. Handling Lua Tables and Functions

A function may also be a field of a table. Get the table, then get the function from it; the calling process is unchanged.

```c
// Call a function in a Lua table
lua_getglobal(L, "my_table");       // Get the Lua table
lua_getfield(L, -1, "my_function"); // Get the function from the table
lua_pushnumber(L, 10);              // Push an argument

if (lua_pcall(L, 1, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // Handle the error
} else {
    double result = lua_tonumber(L, -1);  // Get the return value
    printf("Result: %f\n", result);
    lua_pop(L, 1);  // Clean the stack
}
```

The only difference from the previous snippet is how the function is obtained: `lua_getfield` reads a field (here, a function) from the table on top of the stack rather than from the global environment.

## 5. Cleanup and Shutdown

When you are done, `lua_close` closes the Lua state and releases resources:

```c
lua_close(L);  // Close the Lua state
```

## References

- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html#4)
- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html#6.3)
- [Resource_acquisition_is_initialization](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
