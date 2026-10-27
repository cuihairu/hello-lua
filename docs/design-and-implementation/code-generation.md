# Code Generation and Optimization

Code generation converts the parsed program structure into bytecode—the low-level instruction set executed by the virtual machine (VM)—while compile-time optimization minimizes the generated instruction count and reduces runtime interpretation overhead.

## 1. Code Generation

Lua's parser does not build an AST. Instead, while it parses each statement and each expression, the code generation routines in `lcode.c` (the `luaK_*` family) emit bytecode instructions immediately. The generator assigns each function a group of stack slots as registers. Local variables and intermediate expression results live in those registers and are released and reused as soon as they are no longer needed. Each function corresponds to one bytecode sequence (in Lua a function is a closure prototype); function calls generate instructions such as `CALL`, and return values are passed through registers.

Use `luac -l -l` to inspect the real bytecode that Lua 5.4 generates for:

```lua
-- source code
local a = 10 + 5
```

```plaintext
main <t.lua:0,0> (3 instructions)
	1	[1]	VARARGPREP	0
	2	[1]	LOADI    	0 15     ; 10 + 5 folded to 15 at compile time
	3	[1]	RETURN   	1 1 1	; 0 out
```

## 2. Code Optimization

Compile-time optimization in the official Lua implementation uses only four techniques.

Constant folding evaluates such expressions as arithmetic and comparisons when both operands are constants, so `10 + 5` does not generate `LOADI 10`, `LOADI 5`, and `ADD`; it generates only `LOADI 0 15`. Immediate-instruction encoding stores small integers and in-range floats directly in the instruction operands (`LOADI`, `LOADF`); small-integer arithmetic uses `ADDI`, and adding or subtracting a local variable uses `ADDK`, avoiding an extra constant-table lookup. Jump-instruction patching first emits placeholder jump instructions when generating conditionals and loops, then fills in the offsets once targets are known; `while` and `if` tests compile to `TEST`/jump combinations, avoiding unnecessary label arithmetic. Register reuse releases temporary registers as soon as an expression is evaluated so that later expressions can use them, reducing the total number of slots a function needs.

What Lua does not optimize is also explicit: the official implementation performs no common-subexpression elimination, loop-invariant code motion, or cross-instruction dead-code elimination. Those classic compiler optimizations are left to the runtime efficiency of the VM (the register-based design already reduces instruction count) and to JIT implementations such as LuaJIT.

Example:

```lua
-- source code
local a = (10 + 5) * 2
```

```plaintext
main <t.lua:0,0> (3 instructions)
	1	[1]	VARARGPREP	0
	2	[1]	LOADI    	1 30     ; (10 + 5) * 2 folded entirely to 30
	3	[1]	RETURN   	2 1 1	; 0 out
```

If the constant is replaced with a variable, folding does not occur; `local x, a = 10, 0; a = x * 2` generates `LOADI` plus `MULK`, two arithmetic instructions.

## Summary

Code generation and register allocation are performed by `lcode.c`, which emits bytecode instruction by instruction during parsing and never goes through an AST. Compile-time optimization is mainly constant folding, immediate-instruction encoding, jump patching, and register reuse, and excludes such heavyweight passes as common-subexpression elimination and loop-invariant code motion.

## References

- [Compiler](https://en.wikipedia.org/wiki/Compiler)
- [Abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
- [Official Lua source repository on GitHub](https://github.com/lua/lua)

<!-- BACKLINKS-AUTO -->
## Related pages

- [lua55-source](lua55-source.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
