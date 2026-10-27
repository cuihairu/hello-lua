# LuaJIT

LuaJIT is a JIT (just-in-time) implementation of Lua that compiles Lua code into machine code for speed, executing faster than the standard interpreter.

## 1. What Is LuaJIT

For users, three points are enough to remember: it is fast, it is compatible with Lua 5.1, and it ships FFI. It adds a compilation and optimization layer on top of standard Lua semantics.

## 2. LuaJIT Features

JIT compilation turns bytecode into machine code, removing the interpretation overhead of every execution, and is usually several times to dozens of times faster than standard Lua. Compatibility is based on most Lua 5.1 features, with only partial support for 5.2 and 5.3. The FFI (Foreign Function Interface) library lets Lua call C functions and use C data structures directly, so interop does not have to go through an extra layer.

## 3. LuaJIT's Main Components

### 1. The JIT Compiler

LuaJIT's JIT compiler dynamically compiles Lua bytecode into machine code. Compilation happens in three steps: first it optimizes the bytecode at runtime so the generated machine code is more efficient; then it identifies frequently executed code paths and focuses optimization on them; the compiled machine code is cached and reused directly by later calls, removing the cost of recompilation.

### 2. FFI (Foreign Function Interface)

FFI lets Lua scripts call C functions and operate on C data structures directly. Two steps: first declare the C function prototypes and structs with `ffi.cdef`:
  ```lua
  local ffi = require("ffi")
  ffi.cdef[[
      int printf(const char *fmt, ...);
  ]]
  ```
Then call through the `ffi.C` table:
  ```lua
  ffi.C.printf("Hello, %s!\n", "world")
  ```

## 4. Using LuaJIT

### 1. Installing LuaJIT

LuaJIT can be downloaded from the [official website](http://luajit.org/) or installed with a package manager. On Linux:
```sh
sudo apt-get install luajit
```
Alternatively, download the source and compile it:
```sh
git clone https://github.com/LuaJIT/LuaJIT
cd LuaJIT
make
sudo make install
```

### 2. Running LuaJIT

Use the `luajit` command to run LuaJIT:
```sh
luajit your_script.lua
```

### 3. Differences from Standard Lua

Although LuaJIT is compatible with most standard Lua 5.1 features, some differences remain. New features introduced in Lua 5.2 and 5.3 are not supported, such as the newer module system. The standard library matches 5.1, and behavior may differ in a few edge cases.

## 5. LuaJIT Performance Optimization

Identify the performance-critical code paths in the script and LuaJIT will focus its optimizations on them. It also has an improved implementation for memory allocation and collection. For cross-language work, prefer FFI to call C functions directly; the call overhead is smaller than traditional approaches.

## 6. LuaJIT Best Practices

Use performance analysis tools such as `luajit -jdump` to watch compilation, so performance problems can be investigated. Keep C function calls few; cross-language interaction has its own cost. Before migrating to LuaJIT, verify script compatibility, especially parts that depend on specific Lua 5.1 features.

## References

- [LuaJIT official home](https://luajit.org/luajit.html)
- [LuaJIT](https://en.wikipedia.org/wiki/LuaJIT)
- [Just-in-time_compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
