# LuaJIT Performance Optimization

LuaJIT raises the execution performance of Lua code through just-in-time compilation (JIT) and a set of other optimizations. This page breaks them down step by step.

## 1. Just-In-Time Compilation (JIT)

The JIT compiler compiles Lua bytecode into machine code at runtime, bypassing interpreted execution overhead and optimizing while compiling. It only targets frequently executed paths, the "hot code": hot spots are detected automatically by LuaJIT and compiled into efficient machine code, and overall performance rises with them.

## 2. Bytecode Optimization

Compiled JIT traces are cached in the process as machine code and reused directly on later executions of the same hot path, avoiding recompilation. The bytecode itself is also optimized during compilation; constant folding, arithmetic optimizations, and similar techniques reduce computation and memory-access overhead.

## 3. FFI (Foreign Function Interface)

FFI lets Lua call C functions and use C data structures directly, so the call overhead between Lua and C is much lower. Declarations also allow static type checking and optimization at compile time, further guaranteeing interop performance.

## 4. Memory Management

The garbage collector also uses the mark-and-sweep algorithm (run incrementally) and is optimized for LuaJIT's object model, so its pause characteristics differ from standard Lua's generational collection, and so does the tuning approach. Machine code produced by JIT lives in a dedicated code area (the mcode area) managed like a cache: when the area runs out, old traces are reclaimed first, and if no space can be freed, the affected path degrades to interpreted execution.

## 5. Exception Handling and Debugging Optimizations

Exception handling is optimized, so the performance loss from error handling is kept small. Debugging information and tools are used to locate performance bottlenecks; debug information slightly affects JIT compiler optimizations, so LuaJIT uses a flexible debugging strategy to balance debugging against performance.

## 6. Compiler Optimizations

The compiler adapts to runtime execution with self-optimizations, including dynamic optimization of hot paths, inlining, and code merging. The generated machine code is also targeted at the platform: CPU instruction selection and register allocation are arranged, usually far faster than interpreted execution.

## 7. Platform-Specific Optimizations

LuaJIT provides dedicated machine-code backends for different hardware platforms and operating systems (x86, x64, ARM, and so on). The generated instructions follow the platform's calling convention and may use platform instruction features where available (for example SSE2 floating-point operations on x64).

## References

- [LuaJIT optimization documentation](https://luajit.org/ext_jit.html)
- [Tracing_just-in-time_compilation](https://en.wikipedia.org/wiki/Tracing_just-in-time_compilation)

<!-- BACKLINKS-AUTO -->
## Related pages

- [memory-gc](memory-gc.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
