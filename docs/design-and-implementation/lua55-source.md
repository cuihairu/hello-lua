# Reading the Lua 5.5 Source

This page records my file-by-file reading of the official source repository at the v5.5.1 tag; every conclusion carries a `file:line` reference. Comparisons with 5.4 are based on v5.4.9. Line numbers drift as versions evolve, so re-check the version when citing. Claims that cannot be found in the source are marked "not found in source", and I do not put words into the official code's mouth. All runtime output was measured on an official v5.5.1 build.

## 1. Source Layout and Build

The development repository is flat: about thirty `l`-prefixed C files plus a few drivers, with no subdirectories. The core files fall into four groups by responsibility:

| Responsibility | Files |
| --- | --- |
| Runtime core | `lapi.c` `lvm.c` `ldo.c` `lstate.c` `lgc.c` `lobject.c` `ltable.c` `lstring.c` `lmem.c` `ltm.c` `lfunc.c` `ldebug.c` |
| Front end | `llex.c` (lexer) `lparser.c` (parser) `lcode.c` (code generation) `lopcodes.c` (instruction metadata) `ldump.c`/`lundump.c` (bytecode serialization) |
| Host helpers | `lauxlib.c` `linit.c` |
| Drivers | `lua.c` (interpreter) `luac.c` (compiler) `onelua.c` (single-file amalgamated build) |

Line 1 of the development makefile describes itself as "Developer's makefile for building Lua": the default target `all` produces only `liblua.a` and the `lua` executable (makefile:109, makefile:113-114), with no `luac` target. `luac.c` is distributed only in the release tarball (at `src/luac.c`, with its man page at `doc/luac.1`); the development repository simply does not contain this file. `onelua.c` provides a single-file build (`gcc -O2 -std=c99 -o lua onelua.c -lm`, onelua.c:5-17), in which the `MAKE_LUAC` branch `#include`s "luac.c" (onelua.c:134-135). Running that step in the development repository immediately reports `fatal error: luac.c: No such file or directory`, for exactly the layout reason above.

The release tarball builds `src/lua` and `src/luac` in one shot with `make linux`. Minimal verification:

```bash
./lua -v
-- prints Lua 5.5.1  Copyright (C) 1994-2026 Lua.org, PUC-Rio
```

The interpreter startup chain is in lua.c: `main` (lua.c:777) handshakes control to `pmain` (lua.c:731), which calls `luaL_newstate` to create the state (lauxlib.c:1197), opens the standard libraries with `luaL_openselectedlibs` by bit mask (linit.c:48), handles the `LUA_INIT` environment variable (lua.c:392 `handle_luainit`), and finally runs the user script or enters the REPL through `docall` (lua.c:161).

The repository also carries the full regression suite `testes/`; the top-level `all` script runs every test file one by one with `lua -W all.lua`. Reading the source against the tests is much faster than reading the implementation alone.

## 2. Core Data Structures

### 2.1 TValue: A Value with a Type Tag

The comment block at lobject.h:60-63 is titled "Tagged Values". Every Lua value is a `TValue`: a `Value` union (lobject.h:49-57, holding a `gc` pointer, integers, floats, booleans, and so on) plus a type-tag field (`TValuefields`, lobject.h:65), combined into `TValue` (lobject.h:67-69). The type number has a "variant bit": `makevariant` (:42) encodes a subtype onto the base type, and `novariant` (:80) strips the variant bit back to the base type. Integers and floats are both `LUA_TNUMBER`, distinguished by the variant bit.

Incidentally, this corrects a common claim: many articles write the internal type as `TaggedValue`. Searching the 5.4 and 5.5 sources for `TaggedValue` returns 0 hits; the type name is `TValue`.

The Lua stack itself is a `StackValue` array (lobject.h:148-153); stack positions are represented as `StkIdRel` relative pointers (:155-158), so pointers can be fixed up after a stack reallocation.

### 2.2 Collectable Objects: From TString to Closure

All garbage-collected objects share a `CommonHeader` and hang on a linked list. The key structures:

- `TString`: short strings embed their data inline; the `hnext` field links them into the global string table's bucket chain (lobject.h:406-413).
- `Proto`: a function prototype holding the bytecode instruction array, constant table, and upvalue descriptors (lobject.h:603-626). 5.5 adds the `PF_VATAB` bit of `p->flag` (lobject.h:598), marking that the function declares a vararg table parameter (see section 3).
- `UpVal`: an upvalue, in two states, open (pointing into a stack slot) and closed (holding its own value) (lobject.h:680-693).
- `Closure`: a union type; the Lua closure `LClosure` (:707-711) holds a `Proto` plus an upvalue array, and the C closure `CClosure` (:700-704) holds a C function pointer plus an upvalue array (:714-717).

### 2.3 Table and Its Two Parts

The `Table` struct is at lobject.h:777-786. 5.5's array part is laid out completely differently from 5.4: 5.4's `Table` has `alimit` and `lastfree` fields (lobject.h:737-747), while 5.5 replaces them with `asize` plus a `Value *array`.

The array part uses a compact "values in reverse order + tag array" layout; the comment at ltable.h:96-107 draws the picture: `Value`s run down from the `array` pointer toward lower addresses, the tag byte array sits after a middle `unsigned` and grows toward higher addresses, and the `array` pointer stops at the boundary between the two. This avoids alignment padding; that middle `unsigned` is a `#t` length hint (`lenhint`, ltable.h:118-124). Every array access must go through the `getArrTag`/`getArrVal` macros (ltable.h:110-113).

The hash part is a `Node` array. `Node` packs the value's type tag, the collision chain `next`, and the key into one union to save memory (lobject.h:745-760). An empty table allocates no nodes, points at a shared `dummynode_` (ltable.c:127-132), and records this state with the `BITDUMMY` bit in its `flags` (ltable.h:27-36).

Hashing for key lookup: integer keys go through `hashint` (ltable.c:145-150), and the general path is `mainpositionTV` (:188); the `lua_State` random seed participates via the `global_State` `seed` field (lstate.h:337). Insertion: `getfreepos` finds a free node (:828-846); if none is found, `luaH_newkey` takes the main position or the chain tail (:913-925); when it cannot fit, `rehash` (:761) re-partitions the array/hash boundary, and capacity is resized in `luaH_resize` (:715).

5.5 keeps 5.4's `lastfree` slot mechanism but maintains it only after the node count reaches a threshold (≥8): the constant `LIMFORLAST` is at ltable.c:49, and the condition is wrapped in `Limbox` (:55-63).

Writes follow a "prewrite" protocol: the `luaH_pset*` family first tries an in-place write and returns one of `HOK`/`HNOTFOUND`/`HNOTATABLE`/`HFIRSTNODE` (the comment at ltable.h:67-90 explains these return values); the VM's SETFIELD instruction and friends use that to decide whether to keep the fast path or fall back to `luaV_finishset` (lvm.c:334). The read side has the corresponding `luaH_fastgeti`/`luaH_fastseti` shortcut macros (ltable.h:49-64).

### 2.4 The Two State Structures

`lua_State` is the per-thread state: stack top `top`, current call frame `ci`, open-upvalue chain, C call depth `nCcalls` (:302), and so on (lstate.h:285-312). `CallInfo` (:187-209) records one call frame: a `u` union distinguishes a Lua frame (storing `savedpc`) from a C frame (storing the continuation function), a `u2` union (:203-207) stores either the "number of yielded values", the "number of return values", or the "function index of the protected call" at different times, and the low 8 bits of the `callstatus` bitfield (:208) hold the expected return count (`CIST_NRESULTS`, lstate.h:223), capped by `MAXRESULTS` of 250 (:216). From 5.5 a function may return at most 250 values; more than that raises an error.

`global_State` (:327-372) is shared by the whole VM: memory accounting `GCtotalbytes`/`GCdebt` (:330-331), the GC parameter table `gcparams` (:338), the per-generation lists (:355-362), and the string intern table (:334). The main thread is embedded directly at the end of the struct (`mainth`, :371), and the `mainthread(G)` macro (:376) looks the main thread back up from the global state.

All collectable objects convert to and from each other through the `GCUnion` union (lstate.h:394-403); the `gco2*` macro family performs the downward casts with type assertions (:414-424).

## 3. Parser and Bytecode

### 3.1 Lexing

The reserved word table is in `luaX_tokens` (llex.c:45-47); 5.5 adds `global` (:47). The fixed reserved word list is at :79-82, and lookup goes through `isreserved` (lstring.h:48), a direct search on short strings. The lexer main loop is `llex` (llex.c:467), and `luaX_next` (:588) is the external next-token interface. Note llex.c:187-194 has a comment specifically explaining how the compatibility switch affects the lexing of `global`. This is one of the few places in the 5.5 lexer where "the implementation listens to configuration."

### 3.2 Syntax and the global Statement

The parse entry is `luaY_parser` (lparser.c:2171) → `mainfunc` (:2150) → statements one by one via `statement` (:2052). The biggest new thing in the 5.5 syntax layer is the `global` statement:

- `statement` gains a `TK_GLOBAL` branch (:2094-2115), routing to `globalstat` (global declaration, :1934) or `globalfunc` (global function, :1950).
- Declarations can carry attributes: `getglobalattribute` parses `<const>` (:1865-1876); registration happens in `checkglobal` (:1879, duplicate check) and `initglobal` (:1897, emitting initialization).
- On duplicate-check failure, `luaK_codecheckglobal` (lcode.c:714-722) emits `OP_ERRNNIL`, and at runtime it reports `global 'x' already defined` (message text in ldebug.c:817-822 `luaG_errnnil`). Verified:

```lua
global x = 1
global x = 2
-- prints global 'x' already defined
```

- There is an easy-to-trip rule in `global` semantics: any explicit `global` declaration disables the implicit block-head `global *`, and thereafter undeclared names are treated as locals or errors (manual.of:1695-1712 and manual.of:217-239). Verified:

```lua
global x = 10
print(x)
-- prints variable 'print' not declared
```

- `<const>` globals are read-only; assignment raises an error (verified output `attempt to assign to const variable 'n'`); after `global *` you can also write `global <const> *` to lock the whole wildcard declaration read-only (manual.of:1695-1712).

The compatibility switch lands in the syntax layer as a single lookahead: when `LUA_COMPAT_GLOBAL` is on (luaconf.h:344-346, on by default in the release configuration), `global` is not a reserved word; when `statement` sees `TK_NAME` it looks ahead to see whether `global` is followed by a declaration shape, and if not, treats it as an assignment or expression statement (lparser.c:2117-2134). So the manual says `global` is a reserved word in 5.5 (manual.of:9587-9590), while the official release configuration does not reserve it by default. Read this against the source when reading the manual.

`for` loop control variables are declared read-only via `RDKCONST` from 5.5 on (lparser.c:1694 and :1721); modifying one inside the loop is a compile error (manual.of:1615).

### 3.3 vararg Table Parameter

Parameter-list parsing `parlist` (lparser.c:1067) allows a name after `...` (:1081-1088); `setvararg` (:1061) records this shape and marks the Proto with the `PF_VATAB` flag. Inside the function body `...` is no longer just an expression but can also be indexed: `t` declared as `... t` is "the varargs packed into a table"; `t[k]` compiles to `VVARGIND` (lcode.c:861-866; table-validity check in `needvatab` :809). Verified:

```lua
function f(... t)
  local s = 0
  for i = 1, #t do s = s + t[i] end
  return s, t.n
end
print(f(10, 20, 30))
-- prints 60 3
```

`t.n` gives the argument count directly, no longer needing `select("#", ...)`.

### 3.4 Instruction Format and Code Generation

The instruction encoding formats are given in the comment at lopcodes.h:14-31 as six modes: iABC, ivABC, iABx, iAsBx, iAx, isJ. 5.5 adds ivABC, using a narrow B (6 bits) with a wide C (10 bits), designed specifically for `OP_NEWTABLE`/`OP_SETLIST`. Table constructors and list filling need more C space to describe bulk behavior. The operand-width table is at lopcodes.h:42-51; field macros `GET_OPCODE` (:127), `GETARG_A` (:138).

Register management in code generation lives in lcode.c: `checkstack` (:476) guarantees stack space, `reserveregs` (:488) reserves registers, expression results go through `exp2K` (:1055) to try to fit into a constant or register, assignment is in `luaK_storevar` (:1105), and functions uniformly end via `luaK_ret` (:208). The instruction-emission infrastructure is `luaK_codeABCk` (:399).

The instruction count goes from 83 in 5.4 to 85: new `OP_GETVARG` (vararg table subscript) and `OP_ERRNNIL` (global redefinition check); `OP_NEWTABLE`/`OP_SETLIST` switch to ivABC mode (compare the `luaP_opmodes` table in the two `lopcodes.c` versions); `luaP_isIT` (lopcodes.c:120) is the accompanying instruction-type predicate.

The external bytecode loading entry `luaU_undump` also changed signature: 5.5 is `(lua_State*, ZIO*, Table *anchor, int fixed)` (lundump.h:33-34), 5.4 is `(lua_State*, ZIO*, const char *name)` (lundump.h:29). The format marker changed accordingly: `LUAC_VERSION` is now computed directly as `MAJOR*16+MINOR` (lundump.h:27; 5.4 at :24), and the check word `LUAC_INT` flipped from `0x5678` to `-0x5678` (:20, 5.4 at :18). So a `.luac` file compiled with 5.4 is rejected outright by 5.5; you must recompile.

Look at a real artifact (`luac -l` measured output):

```lua
-- source:
local x = 10
local t = {a=1, b=2}
return x + t.a
```

```text
main </tmp/demochunk.lua:0,0> (11 instructions at 0x561092b3aa90)
0+ params, 3 slots, 1 upvalue, 2 locals, 4 constants, 0 functions
	1	[1]	VARARGPREP	0
	2	[1]	LOADI    	0 10
	3	[2]	NEWTABLE 	1 2 0	; 0
	4	[2]	EXTRAARG 	0
	5	[2]	SETFIELD 	1 0 1k	; "a" 1
	6	[2]	SETFIELD 	1 2 3k	; "b" 2
	7	[3]	GETFIELD 	2 1 0	; "a"
	8	[3]	ADD      	2 0 2
	9	[3]	MMBIN    	0 2 6	; __add
	10	[3]	RETURN   	2 2 1	; 1 out
	11	[3]	RETURN   	2 1 1	; 0 out
```

Three details: the main chunk is also treated as a vararg function, so the first instruction is `VARARGPREP`; `NEWTABLE` is followed by `EXTRAARG`, with the table-size description crossing an instruction boundary; `ADD` is followed by `MMBIN`, which only triggers the `__add` metamethod when the numeric fast path fails.

## 4. The Virtual Machine Main Loop

The interpreter main loop `luaV_execute` is at lvm.c:1204. The skeleton is three pieces: `vmfetch` fetches the instruction and also does stack-space checking (:1191-1197), `vmdispatch` dispatches by opcode (:1199-1201, just a `switch`), and `vmcase`/`vmbreak` define each branch's entry and exit (:1199-1201). When the compile macro `LUA_USE_JUMPTABLE` is on, `#include "ljumptab.h"` (:1211-1213) turns the switch into a jump table. ljumptab.h:9-14 expands `vmcase(x)` into labels; the internal test configuration keeps it off (ltests.h:41) so the code shape seen by breakpoints and coverage tools stays stable.

Each instruction runs between two guards: `Protect` (:1164) wraps operations that may re-enter the C layer and invalidate stack or state; `checkGC` (:1183) checks at allocation points whether the GC should take a step; `luai_threadyield` (:1176-1178) gives the host a chance to yield under cooperative scheduling.

Typical instruction handling patterns fall into a few classes:

- Table reads: `OP_GETFIELD` (:1344) first takes the `luaH_fastgeti` fast path, falling back to `luaV_finishget` (lvm.c:291) for the metatable `__index` chain; the write side symmetrically falls back to `luaV_finishset` (:334).
- Arithmetic: `OP_MMBINI` (:1572) and the rest of the MMBIN family only provide the metamethod fallback; the numeric operation was already attempted earlier.
- Calls: `OP_CALL` (:1726) expands arguments and switches `CallInfo`; `OP_TAILCALL` (:1741) reuses the current frame; returns go through `OP_RETURN` (:1769) and the fast path `OP_RETURN0` (:1800).
- Iteration: `OP_TFORCALL` (:1881) calls the iterator and saves the control variable.
- vararg: `OP_VARARGPREP` (:1959) arranges arguments at function entry, `OP_VARARG` (:1943) spreads varargs into registers, `OP_GETVARG` (:1949) handles the vararg table subscript, `OP_ERRNNIL` (:1955) blocks global redefinition.
- `OP_EXTRAARG` (:1968) always follows an instruction that needs more than 17 bits of operand.

Instructions interrupted by `yield` are completed by `luaV_finishOp` (lvm.c:861) on resume. This is the key to coroutines suspending across VM instruction boundaries (see section 6). String concatenation, length, and comparison semantics are implemented in `luaV_concat` (:690), `luaV_objlen` (:737), `luaV_lessthan` (:555) and `luaV_equalobj` (:588).

## 5. GC: From Two States to Three

### 5.1 Modes and States

The 5.4 GC mode enum has only two states, incremental `KGC_INC` and generational `KGC_GEN` (lstate.h:151-152, 5.4). 5.5 splits it into three (lstate.h:162-164): `KGC_INC` (incremental), `KGC_GENMINOR` (generational minor collection), `KGC_GENMAJOR` (generational major collection). The generational "minor/major" is no longer a phase within the same cycle but two run modes that can switch between each other.

### 5.2 Parameter System: A Whole New API

GC parameters changed from compile-time macros to a runtime-tunable byte table `gcparams[]` (lstate.h:338), with a new C API `lua_gcparam` (lua.h:331-357 new option area) and `LUA_GCP_*` parameter numbers (0-5). Defaults are concentrated at lgc.h:170-205:

| Parameter | Default | Line |
| --- | --- | --- |
| Minor-to-major trigger ratio MINORMAJOR | 70% | lgc.h:173 |
| Major-to-minor fallback ratio MAJORMINOR | 50% | lgc.h:179 |
| Minor-collection pace GENMINORMUL | 20% | lgc.h:185 |
| Pause factor GCPAUSE | 250% | lgc.h:191 |
| Step multiplier GCMUL | 200% | lgc.h:198 |
| Step granularity GCSTEPSIZE | 200 × sizeof(Table) | lgc.h:201 |

The 5.4 equivalents are `LUAI_GENMAJORMUL 100` and `LUAI_GCPAUSE 200` (lgc.h:128, lgc.h:131, 5.4). Parameters are stored as packed bytes: `luaO_codeparam` (lobject.c:62) encodes and `luaO_applyparam` (:89) decodes. On the script side this corresponds to `collectgarbage("param", ...)`. The 5.4 `"setpause"`/`"setstepmul"` options were removed from the opts table (lbaselib.c:202-208).

### 5.3 Trigger Condition Reversal

Memory accounting is `GCtotalbytes - GCdebt` (lstate.h:435). The 5.5 auto-trigger check is written as `GCdebt <= 0` (lgc.h:233 `luaC_condGC`), while 5.4 is `GCdebt > 0` (lgc.h:168-169, 5.4). The debt semantics are entirely reversed; reorient your thinking when reading the code.

### 5.4 Engine Internals

Incremental mode: driven by `luaC_step` (lgc.c:1740-1763), with `incstep` (:1710-1729) advancing the state machine `singlestep` (:1606-1614, using negative return codes to mark key transitions like `step2pause`/`atomicstep`/`step2minor`) by a step budget; the sweep phase is entered via `entersweep` (:1504), and the atomic phase is at `atomic` (:1543).

Generational mode: minor collection `youngcollection` (:1335) sweeps only young objects, `sweep2old` (:1136) promotes survivors directly to old; the handoff between promotion and major collection is at `atomic2gen` (:1389) and `finishgencycle` (:1292). Mode switching is decided by `checkminormajor` (:1318) based on the counter `GCmajorminor` (lstate.h:333; role comment at lgc.c:1099-1113), going through `minor2inc` (:1304) or the reverse; when a full incremental cycle is needed use `luaC_fullgc` (:1786, which can force incremental via `fullinc` :1766).

Object age migration no longer depends on the 5.4 `changeage` helper (5.4 lgc.h:120-121; absent in 5.5); it is now a linked-list marking method: each generation's boundary on lists like `allgc` is recorded by pointers (the comment at lstate.h:22-63 draws the `survival`/`old1`/`reallyold` chain boundaries in detail), and age semantics are in the comment at lgc.h:125-160 (`YOUNG0`→`TOUCHED1`→`TOUCHED2`→`OLD0`→`OLD1`).

## 6. Coroutines and yield/resume

The library layer is thin; the weight is all in the engine. `coroutine.create`/`wrap`/`yield`/`resume`/`status` are implemented at lcorolib.c:96, :106, :113, :57, :150 (`auxresume` :33 is the shared resume helper), the function registry is at :207-216, and `luaopen_coroutine` is at :220.

The resume chain: `lua_resume` (ldo.c:968) → `resume` (:918, handling the scene left by a debug-hook yield, including rolling back savedpc) → on failure `precover` (:950) finds a recovery point among protected call frames → `unroll` (:868) re-enters `luaV_execute` frame by frame.

The yield chain: `coroutine.yield` eventually reaches `lua_yieldk` (ldo.c:1008), which sets the thread state to `LUA_YIELD`, stores the number of yielded values in `ci->u2.nyield`, then calls `luaD_throw(L, LUA_YIELD)` (:1031). Yielding is implemented as "an exception throw with LUA_YIELD as the code", unwinding directly to the nearest resume. `luaD_throw` (:125-144) goes through longjmp or panic depending on whether a protected point exists; `throwbaselevel` (:150-157) handles the outermost boundary case.

Two supporting mechanisms: the high 16 bits of `nCcalls` count non-yieldable C call depth (comment at lstate.h:95-104 and field :302), and `lua_resume` entry uses `LUAI_MAXCCALLS` (ldo.h:63, value 200) to limit nesting depth (ldo.c:985); a C function must provide a continuation to yield (`ci->u.c.k`, lstate.h:198), and after resume `luaV_finishOp` (lvm.c:861) completes the interrupted instruction. This is why the C-side `lua_yieldk` takes a callback argument.

## 7. Standard Library Organization

5.5 turns "which libraries to open" into an explicit bitmask protocol: in `lualib.h`, `LUA_GLIBK` defines each library flag by shifting left from 1 (lualib.h:17-54), and the `stdlibs[]` table in `linit.c` (:29-41) maps each `luaopen_*` to its flag; the comment before the table (:26-28) explicitly requires the order to match the bit flags. The host calls `luaL_openselectedlibs` (linit.c:48-64) to open libraries by bit, and the assertion at the end of the function (:62) guarantees every passed bit is consumed; libraries not included by compile options fall back to the `package.preload` mechanism (:55-59). 5.4's approach was only a `loadedlibs[]` table plus an all-open `luaL_openlibs` (linit.c:42-52, 5.4).

The per-library template (using coroutine as the example): `luaopen_coroutine` builds the table then registers C functions in bulk with `luaL_setfuncs` (lauxlib.c:978; registry at lcorolib.c:207-216), and `luaL_requiref` (lauxlib.c:1019) hangs the library table into `package.loaded`.

The content increments are small: `table.create` is the new table function (ltablib.c:64, registered at :414); the C API layer adds `lua_pushexternalstring` (lua.h:247) for zero-copy strings, but the string library's Lua-side interface is unchanged.

## 8. Key Changes From 5.4

Comparing the official manual's compatibility section (manual.of:9575-9714, titled "Incompatibilities ... from Lua 5.4 to Lua 5.5", :9586) with the source differences, summarized:

| Change | Source |
| --- | --- |
| `global` statement: explicit declaration, `<const>` read-only, `global *` wildcard | manual.of:1695-1712;lparser.c:2094-2115 |
| `for` loop control variable read-only | manual.of:1615;lparser.c:1694/:1721 |
| vararg table parameter `function f(... t)` | manual.of:2363-2365;lparser.c:1081-1088 |
| Error object uniformly converted to string when nil | manual.of:376 |
| `__call` metamethod chain limit 15 | manual.of:9637;lstate.h:226-227 (4-bit count) |
| Function return value limit 250 | lstate.h:216 (`MAXRESULTS`) |
| Bytecode format incompatible; old `.luac` rejected | lundump.h:20-27/:33;5.4 lundump.h:18-24/:29 |
| `lua_newstate` gains a seed parameter | lua.h:163; seed generation lauxlib.c:1168-1182 |
| Registry index changed to `-(INT_MAX/2+1000)`, `LUA_RIDX_MAINTHREAD`=3 | lua.h:43, lua.h:85 |
| New `lua_pushexternalstring`, `lua_numbertocstring` | lua.h:247, lua.h:374-375 |
| `lua_resetthread` becomes `lua_closethread` macro | lua.h:440 |
| `lua_setcstacklimit` removed (compare the two lua.h) | absent from 5.5 header |
| Debug hook fields `ftransfer`/`ntransfer` changed to int | lua.h:500-502 |
| GC three-state + `lua_gcparam` API (section 5) | lstate.h:162-164;lgc.h:170-205 |

Among these, `global` is the biggest semantic change; three measured behaviors are worth remembering: an explicit declaration turns off the implicit `global *` (the "variable 'print' not declared" example above); a duplicate declaration reports `global 'x' already defined`; assigning to a `<const>` global errors. Also, the manual calls `global` a reserved word (manual.of:9587-9590), while the release configuration `LUA_COMPAT_GLOBAL` defaults to 1 (luaconf.h:344-346) turning it back into an ordinary identifier plus syntax lookahead (lparser.c:2117-2134). When porting scripts, understanding it as "not reserved, but a new statement form" is closer to actual behavior.

As for "why upgrade to 5.5", there is no official motivation statement in the manual or source comments (not found in source). Summarizing from the changes themselves: explicit `global` and read-only globals turn "who is polluting the environment" into a statically expressible constraint; the vararg table parameter folds idioms like `select("#", ...)` into the language; generational GC is reworked from 5.4's experimental two-state into switchable three-state with runtime parameters; the built-in hash seed (lauxlib.c:1168-1182) lowers the risk of key-collision injection. These four directions can be identified directly from the official repository code; the rest of the benefits are speculation and are not elaborated here.

## Conclusion

The points for reading the 5.5 source: look at the comment blocks in lobject.h and ltable.h for data structures, the instruction branches in lvm.c for interpreter behavior, and the list and age comments in lgc.h/lstate.h for lifetimes. The three big 5.5 changes (Table layout, GC three-state, `global` statement) all have corresponding comment blocks and test cases (the `testes/` directory); reading source against the tests, the things beyond line numbers (design intent) are mostly written in comments.

## Related reading

- [Virtual machine architecture](/design-and-implementation/vm-architecture)
- [Bytecode and the virtual machine](/design-and-implementation/bytecode-and-vm)
- [Code generation and optimization](/design-and-implementation/code-generation)
- [Coroutine implementation](/design-and-implementation/coroutines-implementation)
- [Garbage collection optimization strategies](/design-and-implementation/gc-optimization)
- [Garbage collection implementation details](/design-and-implementation/gc-implementation)
- [Lua 5.5 official manual](https://www.lua.org/manual/5.5/)

## References

- [Official Lua source repository github.com/lua/lua](https://github.com/lua/lua)

<!-- BACKLINKS-AUTO -->
## Related pages

- [further-reading](/appendix/further-reading.md)
- [README](README.md)
- [books](/knowledge/books.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
