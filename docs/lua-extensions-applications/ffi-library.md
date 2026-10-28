# Using LuaJIT's FFI Library

LuaJIT's FFI (Foreign Function Interface) library lets Lua scripts call C functions and use C data structures directly. Compared to writing a C/C++ plugin and wiring it into the Lua-C interface, FFI removes those intermediate steps.

## 1. Introducing the FFI Library

Before using FFI, introduce the `ffi` module in the Lua script:

```lua
local ffi = require("ffi")
```

## 2. Defining C Functions and Data Structures

Use `ffi.cdef` to define C functions and data structures; it accepts a string argument containing the C declarations.

### Example: Defining a C Function

```lua
ffi.cdef[[
    int printf(const char *fmt, ...);
]]
```

### Example: Defining a C Struct

```lua
ffi.cdef[[
    typedef struct {
        int x;
        int y;
    } Point;
]]
```

## 3. Loading C Dynamic Libraries

Use `ffi.load` to load a C dynamic library (shared library); afterwards you can call the functions defined in it.

### Example: Loading the C Standard Library

```lua
local libc = ffi.load("c") -- loads the standard C library
```

## 4. Calling C Functions

Once declarations and loading are done, these C functions can be called directly from Lua.

### Example: Calling the `printf` Function

```lua
ffi.cdef[[
    int printf(const char *fmt, ...);
]]

local libc = ffi.load("c")
-- Lua numbers in varargs are passed to C as double; %d must be explicitly converted to int first
libc.printf("Hello from C! %d\n", ffi.new("int", 42))  -- outputs Hello from C! 42
```

## 5. Using C Data Structures

After defining a C data structure, you can create instances of it in Lua and operate on its fields.

### Example: Creating and Operating on a C Struct

```lua
ffi.cdef[[
    typedef struct {
        int x;
        int y;
    } Point;
]]

local myPoint = ffi.new("Point")
myPoint.x = 10
myPoint.y = 20

print("Point coordinates:", myPoint.x, myPoint.y)
```

## 6. Combining C Functions and Structs

C functions and structs can be used together.

### Example: Defining and Calling a C Function That Processes a Struct

```c
// mylib.c
#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

void print_point(Point *p) {
    printf("Point coordinates: x = %d, y = %d\n", p->x, p->y);
}
```

```lua
-- Lua script
ffi.cdef[[
    typedef struct {
        int x;
        int y;
    } Point;

    void print_point(Point *p);
]]

local mylib = ffi.load("mylib")  -- loads the C library
local myPoint = ffi.new("Point", 1, 2)
mylib.print_point(myPoint)
```

## 7. Error Handling

When using FFI, you need to pay particular attention to type safety and memory management. Passing an incorrect data type or accessing freed memory can cause crashes or undefined behavior.

### Example: Checking a Function's Return Value

```lua
ffi.cdef[[
    int printf(const char *fmt, ...);
]]

local libc = ffi.load("c")
local result = libc.printf("Hello from C!\n")
if result < 0 then
    error("Error calling printf")
end
```

## Summary

Using FFI is one main line: declare with `ffi.cdef`, load with `ffi.load`, then call directly. What you must watch is that declarations match the real signatures; a type or memory error is a crash or undefined behavior.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#4)
- [LuaJIT FFI documentation](https://luajit.org/ext_ffi.html)
- [LuaJIT FFI API](https://luajit.org/ext_ffi_api.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [applications](/knowledge/applications.md)
- [core-concepts](/knowledge/core-concepts.md)
