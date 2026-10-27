# Virtual Machine Architecture

The virtual machine (VM) executes Lua code by turning source into operations a machine can run. It is central to Lua's efficient execution.

## 1. Bytecode

Bytecode is Lua's intermediate representation between source code and machine code; the VM interprets it. Source is compiled before execution through lexical analysis, syntax analysis, and code generation. The instruction set consists of concise instructions, each corresponding to one operation, so the VM can decode and execute it quickly.

## 2. The VM Executor

The executor reads and executes bytecode instructions and is the heart of the Lua runtime. Its main loop is `luaV_execute` in `lvm.c`: it reads an instruction, decodes it, performs the operation, and handles the associated data. Lua's VM is register based: instructions read and write operands by register number, and registers are actually a group of stack slots reserved for the current function.

## 3. Stack Management

The stack is the key data structure for function calls, local variables, and expression evaluation. Every call reserves a contiguous group of slots as its registers. Bytecode instructions access and store operands by register number instead of repeatedly pushing and popping as the JVM does, so fewer instructions are needed and branch prediction is friendlier. Each call also has a call-information structure (`CallInfo`) that records the function's arguments, the register range holding its local variables, and its return address.

## 4. Memory Management

The VM includes garbage collection for automatic memory management. Lua defaults to incremental mark-and-sweep (5.4 can also switch to generational mode), periodically scanning memory, marking live objects, and sweeping objects that are no longer used. When the VM is created, `lua_newstate` registers one unified allocation function (`lua_Alloc`); all object allocation and freeing goes through it. The default implementation is based on `realloc` and does not use a preallocated memory pool.

## 5. Calls

For each function call, the VM creates a new stack frame and pushes it onto the call stack; when the function returns, the frame is popped and execution resumes at the call site. Nested and recursive calls follow the same path. Arguments are passed on the stack, and the VM handles argument passing and return values during calls and returns.

## 6. Debugging and Extension

The debug interface works with the debug library and related tools for debugging and analysis. The C API allows extensions to be written in C, to modify VM behavior, or to interact with Lua.

## Summary

Bytecode as an intermediate representation, register-based stack management, one unified allocation function, and stack-frame-based calls form a design aimed at performance and simplicity. The debug interface and C API leave extension capability to host programs.

## References

- [Virtual machine](https://en.wikipedia.org/wiki/Virtual_machine)
- [Stack machine](https://en.wikipedia.org/wiki/Stack_machine)
- [Official Lua source repository on GitHub](https://github.com/lua/lua)

<!-- BACKLINKS-AUTO -->
## Related pages

- [lua55-source](lua55-source.md)
- [glossary](/glossary.md)
- [books](/knowledge/books.md)
- [core-concepts](/knowledge/core-concepts.md)
