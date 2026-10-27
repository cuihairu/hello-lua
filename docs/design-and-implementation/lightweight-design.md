# Lua's Lightweight Design

Lightweight design is fundamental to Lua as an embedded scripting language: it runs efficiently in constrained environments and can be embedded in host applications.

## 1. A Small Core Library

Lua's core library is only a few hundred kilobytes, a concrete advantage in embedded and low-resource environments. The core keeps only fundamental language features: tables, functions, coroutines, and basic input/output (I/O). Additional features such as regular expressions and file-system access are separate modules loaded on demand, so the core remains lean.

## 2. Low Memory Use

Low memory use is critical in limited environments such as embedded systems. Lua takes two main approaches. First, memory management uses one unified allocation function plus incremental garbage collection, which has low overhead, is replaceable, and makes memory use easier to control. Second, the object model is simple: Lua uses the table as its sole data structure, and the table implementation is optimized for memory use and efficient operations.

## 3. A Lightweight Virtual Machine

The virtual machine (VM) is simple and efficient: it executes code quickly with low system overhead. Lua uses bytecode as an intermediate representation closer to machine language than direct source execution, which also keeps the interpreter implementation simple. The VM improves efficiency with a simplified instruction set and optimized execution paths, reducing context switching and processing overhead.

## 4. A Flexible Embedding Interface

Host programs interact with Lua scripts through the C API: they call Lua functions and access Lua data. The interface balances performance and usability, making integration with C and C++ straightforward. Extensions and plugins can be added as dynamically linked libraries at low cost.

## 5. Simple Syntax and Features

The syntax is concise and consistent, avoids complex language features, and has a gentle learning curve. Tables are the primary data structure, simplifying the language while preserving room for extension. Lua keeps only the most basic programming constructs—functions, tables, and coroutines—leaving out more elaborate features and reducing both implementation and learning complexity.

## Summary

A core library of a few hundred kilobytes, low memory use, a simple VM, a C embedding API, and a minimal language feature set together make Lua suitable for embedded systems and resource-constrained environments.

## References

- [Lua (programming language)](https://en.wikipedia.org/wiki/Lua_(programming_language))
- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.2)

<!-- BACKLINKS-AUTO -->
## Related pages

- [core-concepts](/knowledge/core-concepts.md)
