# Introduction to LuaJIT

## What Is LuaJIT?

LuaJIT is a just-in-time compiler implementation of Lua that dynamically compiles Lua code into machine code, executing faster than the standard interpreter while remaining highly compatible with the Lua language.

## LuaJIT's Main Features

Speed is its biggest selling point. JIT compiles Lua bytecode into low-level machine code, and compared with the standard interpreter it usually delivers several-fold to tens-of-fold improvements. For compatibility, LuaJIT aligns with the vast majority of Lua 5.1 features and supports only part of Lua 5.2 and 5.3. The FFI (Foreign Function Interface) library lets Lua scripts call C functions and use C data structures directly, so interop does not require writing another extension layer. It also has its own garbage collection implementation, different from standard Lua, discussed separately below.

## LuaJIT's Main Components

The JIT compiler compiles bytecode into machine code at runtime, identifying frequently executed code paths and optimizing them specifically.

The FFI library handles Lua–C interop, removing the extension-writing step and lowering call overhead.

The garbage collector is also based on the mark-and-sweep algorithm (run incrementally) and optimized for LuaJIT's own object model. It does not use reference counting, and Lua 5.4's generational collection has no counterpart in LuaJIT 2.1.

## Using LuaJIT

You can download the source from the [official website](http://luajit.org/) or install it with a package manager. On Linux:

- Install LuaJIT:
    ```sh
    sudo apt-get install luajit
    ```
- Run a script:
    ```sh
    luajit your_script.lua
    ```

Watch for differences from standard Lua: LuaJIT is highly compatible with Lua 5.1, but not all Lua 5.2 and 5.3 features are present, so confirm the script does not hit any gap before migrating.

## LuaJIT Application Scenarios

Performance-sensitive applications such as game development and real-time data processing use it a lot. Embedded systems and resource-constrained environments are also a fit, valuing its fast execution and low memory footprint. Where you need to work with existing C libraries, FFI comes into play.

## References

- [LuaJIT official home](https://luajit.org/luajit.html)
- [LuaJIT extensions documentation](https://luajit.org/extensions.html)
- [LuaJIT](https://en.wikipedia.org/wiki/LuaJIT)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
