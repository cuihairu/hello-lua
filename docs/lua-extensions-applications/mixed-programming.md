# Mixed Programming with Lua and C

In mixed C and Lua programming, the division of labor is clear: Lua supplies flexibility and dynamic features, C supplies performance and low-level control.

## 1. Creating and Initializing the Lua Environment

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

The three functions each handle a stage: `luaL_newstate` creates a new Lua state, `luaL_openlibs` loads the Lua standard libraries, and `lua_close` closes the Lua state and releases resources.

## 2. Calling Lua Scripts from C

A script can be loaded and executed from a file or a string, and can hold the functions or data the C code needs to call.

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

The two entry points match the two sources: `luaL_dofile` loads and executes a Lua script from a file, and `luaL_dostring` loads and executes Lua code from a string. On failure, get the error message with `lua_tostring(L, -1)`.

## 3. Calling Lua Functions from C

Fetch a function from the Lua script, push the arguments, call it, then handle the return values.

```c
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

The flow is the same as in the previous section: `lua_getglobal` pushes the global Lua function onto the stack, `lua_pushnumber` pushes the arguments, `lua_pcall` calls it and receives the return values, and `lua_tonumber` reads the result from the stack.

## 4. Calling C Functions from Lua

Once a C function is registered in the Lua environment, the script can call it like any ordinary function.

```c
// C function
int add_numbers(lua_State *L) {
    int a = luaL_checkinteger(L, 1);  // Get the first argument
    int b = luaL_checkinteger(L, 2);  // Get the second argument
    lua_pushinteger(L, a + b);        // Push the result
    return 1;  // Return the number of results
}

int main() {
    lua_State *L = luaL_newstate();
    luaL_openlibs(L);

    lua_register(L, "add_numbers", add_numbers);  // Register the C function

    if (luaL_dofile(L, "script.lua") != LUA_OK) {
        fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
        lua_pop(L, 1);  // Handle the error
    }

    lua_close(L);
    return 0;
}
```

script.lua:

```lua
local result = add_numbers(5, 10)
print("Result from C function: " .. result)
```

`lua_register` registers a C function in the Lua environment so it can be called from Lua; `luaL_checkinteger` gets an integer argument from the Lua stack, and `lua_pushinteger` pushes the result back onto the stack.

## 5. Handling Lua Tables

Lua tables can also be brought over to the C side and operated on.

```c
lua_getglobal(L, "my_table");       // Get the Lua table
lua_getfield(L, -1, "key1");        // Get a field from the table
if (lua_isstring(L, -1)) {
    const char *value = lua_tostring(L, -1);
    printf("Value: %s\n", value);
}
lua_pop(L, 1);  // Clean the stack
```

`lua_getfield` gets a field from a Lua table, and `lua_tostring` gets a string value from the Lua stack.

## 6. Error Handling

When calling Lua code from C, error handling cannot be skipped. `lua_pcall` catches errors in the Lua script, and `lua_tostring` retrieves the error message:

```c
if (lua_pcall(L, 2, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // Clean the error message
}
```

## 7. Cleanup and Shutdown

Cleanup is a single call: `lua_close` closes the Lua state and releases resources:

```c
lua_close(L);  // Close the Lua state
```

## References

- [Lua 5.4 manual](https://www.lua.org/manual/5.4/manual.html#4)
- [LuaJIT C API documentation](https://luajit.org/ext_c_api.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
