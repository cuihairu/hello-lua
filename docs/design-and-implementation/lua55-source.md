# Lua 5.5 源码解析

本文基于官方源码仓库的 v5.5.1 标签逐文件阅读写成,所有结论都给出 `文件:行号` 引用;与 5.4 的对照基于 v5.4.9。行号随版本演进会漂移,引用时注意对应版本。源码里查不到的说法一律标注「未见于源码」,不替官方补台词。涉及的运行输出全部在 v5.5.1 官方构建上实测。

## 1. 源码结构与构建

开发仓库是平铺布局:三十来个 `l` 前缀的 C 文件加少量驱动,没有子目录。核心文件按职责分四组:

| 职责 | 文件 |
| --- | --- |
| 运行时核心 | `lapi.c` `lvm.c` `ldo.c` `lstate.c` `lgc.c` `lobject.c` `ltable.c` `lstring.c` `lmem.c` `ltm.c` `lfunc.c` `ldebug.c` |
| 前端 | `llex.c`(词法)`lparser.c`(语法)`lcode.c`(代码生成)`lopcodes.c`(指令元信息)`ldump.c`/`lundump.c`(字节码序列化) |
| 宿主辅助 | `lauxlib.c` `linit.c` |
| 驱动 | `lua.c`(解释器)`luac.c`(编译器)`onelua.c`(单文件合并版) |

开发版 makefile 第 1 行自述 "Developer's makefile for building Lua":默认目标 `all` 只产出 `liblua.a` 和 `lua` 可执行文件(makefile:109、makefile:113-114),没有 luac 目标。luac.c 只随发行 tarball 发布(位于 `src/luac.c`,手册页在 `doc/luac.1`);开发仓库里根本没有这个文件。onelua.c 提供单文件构建(`gcc -O2 -std=c99 -o lua onelua.c -lm`,onelua.c:5-17),其中 `MAKE_LUAC` 分支会 `#include "luac.c"`(onelua.c:134-135)。在开发仓库里执行这一步直接报 `fatal error: luac.c: No such file or directory`,原因就是上面这个布局差异。

发行 tarball 用 `make linux` 一次产出 `src/lua` 和 `src/luac`。最小验证:

```bash
./lua -v
-- 输出 Lua 5.5.1  Copyright (C) 1994-2026 Lua.org, PUC-Rio
```

解释器启动链路在 lua.c:`main`(lua.c:777)先把控制权交给 `pmain`(lua.c:731),后者调用 `luaL_newstate` 建状态(lauxlib.c:1197)、用 `luaL_openselectedlibs` 按位掩码打开标准库(linit.c:48)、处理 `LUA_INIT` 环境变量(lua.c:392 的 `handle_luainit`),最后经 `docall`(lua.c:161)跑用户脚本或进入 REPL。

仓库还带完整的回归测试 `testes/`,顶层 `all` 脚本用 `lua -W all.lua` 逐项跑全部测试文件。读源码时对照测试用例,比只看实现快得多。

## 2. 核心数据结构

### 2.1 TValue:带类型标签的值

lobject.h:60-63 的注释块标题就是 "Tagged Values"。所有 Lua 值都是 `TValue`:一个 `Value` 联合(lobject.h:49-57,含 `gc` 指针、整数、浮点、布尔等)+ 类型标签字段(`TValuefields`,lobject.h:65),合成为 `TValue`(lobject.h:67-69)。类型编号带"变体位":`makevariant`(:42)在基础类型上编码子类型,`novariant`(:80)剥掉变体位还原基础类型。整型和浮点数同为 `LUA_TNUMBER`,靠变体位区分。

顺带纠一个流传的说法:不少文章把内部类型写作 `TaggedValue`。在 5.4 与 5.5 源码里全文检索 `TaggedValue` 均为 0 次命中,类型名是 `TValue`。

Lua 栈本身是 `StackValue` 数组(lobject.h:148-153),栈位置用 `StkIdRel` 相对指针表示(:155-158),为的是栈重分配后指针可修复。

### 2.2 可回收对象:从 TString 到 Closure

所有要垃圾回收的对象共享 `CommonHeader` 并挂在链表上。几个关键结构:

- `TString`:短字符串内嵌数据,`hnext` 字段把它串进全局字符串表桶链(lobject.h:406-413)。
- `Proto`:函数原型,持有字节码指令数组、常量表、upvalue 描述等(lobject.h:603-626)。5.5 新增 `p->flag` 的 `PF_VATAB` 位(lobject.h:598),标记该函数声明了 vararg 表参数(见第 3 节)。
- `UpVal`:upvalue,分开放(指向栈槽)与关闭(自持值)两态(lobject.h:680-693)。
- `Closure`:联合类型,Lua 闭包 `LClosure`(:707-711)持 `Proto` 加 upvalue 数组,C 闭包 `CClosure`(:700-704)持 C 函数指针加上值数组(:714-717)。

### 2.3 Table 与它的两个部分

`Table` 结构体在 lobject.h:777-786。5.5 的数组部分布局和 5.4 完全不同:5.4 的 `Table` 里有 `alimit` 和 `lastfree` 字段(lobject.h:737-747),5.5 换成了 `asize` 加一个 `Value *array`。

数组部分采用「值倒排 + 标签数组」的紧凑布局,ltable.h:96-107 的注释画了图:`Value` 从 `array` 指针向低地址倒序排,标签字节数组排在中间一个 `unsigned` 之后向高地址排,`array` 指针停在两段交界处。这样免去了对齐填充;那个夹在中间的 `unsigned` 是 `#t` 长度提示(`lenhint`,ltable.h:118-124)。所有数组访问必须走 `getArrTag`/`getArrVal` 两个宏(ltable.h:110-113)。

哈希部分是 `Node` 数组。`Node` 把值的类型标签、冲突链 `next` 和键打包进一个联合,节省内存(lobject.h:745-760)。空表不分配节点,指向共享的 `dummynode_`(ltable.c:127-132),并用 `flags` 里的 `BITDUMMY` 位记录这一状态(ltable.h:27-36)。

定位键的散列:整数键走 `hashint`(ltable.c:145-150),通用路径在 `mainpositionTV`(:188);`lua_State` 的随机种子参与散列(global_State 的 `seed` 字段,lstate.h:337)。插入流程:`getfreepos` 找空闲节点(:828-846),找不到就 `luaH_newkey` 抢主位或链尾(:913-925),装不下触发 `rehash`(:761)重新划分数组/哈希边界,容量调整在 `luaH_resize`(:715)。

5.5 还保留 5.4 的 lastfree 槽位机制,但只在节点数达到阈值(≥8)后才维护:`LIMFORLAST` 常量在 ltable.c:49,条件判断封装在 `Limbox`(:55-63)。

写操作走了「预写」协议:`luaH_pset*` 系列先尝试原地写,返回 `HOK`/`HNOTFOUND`/`HNOTATABLE`/`HFIRSTNODE` 之一(ltable.h:67-90 的注释解释了这套返回值),VM 的 SETFIELD 等指令据此决定继续快路径还是回落 `luaV_finishset`(lvm.c:334)。读侧对应 `luaH_fastgeti`/`luaH_fastseti` 快捷宏(ltable.h:49-64)。

### 2.4 两个状态结构

`lua_State` 是每线程状态:栈顶 `top`、当前调用帧 `ci`、开放 upvalue 链、C 调用深度 `nCcalls`(:302)等(lstate.h:285-312)。`CallInfo`(:187-209)记录一帧调用:`u` 联合区分 Lua 帧(存 `savedpc`)与 C 帧(存 continuation 函数),`u2` 联合(:203-207)在不同时机存「让位值个数」「返回值个数」或「被保护调用的函数索引」,状态位段 `callstatus`(:208)的低 8 位存期望返回值数(`CIST_NRESULTS`,lstate.h:223),上限由 `MAXRESULTS` 250 给定(:216)。5.5 起函数最多返回 250 个值,超了会报错。

`global_State`(:327-372)是整个虚拟机共享的:内存记账 `GCtotalbytes`/`GCdebt`(:330-331)、GC 参数表 `gcparams`(:338)、各年龄代链表(:355-362)、字符串内部表(:334)。主线程直接内嵌在结构体末尾(`mainth`,:371),`mainthread(G)` 宏(:376)从全局状态反查主线程。

所有可回收对象经 `GCUnion` 联合互转(lstate.h:394-403),`gco2*` 系列宏带类型断言完成下行转换(:414-424)。

## 3. 解析器与字节码

### 3.1 词法

保留字表在 `luaX_tokens`(llex.c:45-47),5.5 把 `global` 加了进去(:47);固定保留字列表在 :79-82,查找走 `isreserved`(lstring.h:48)对短字符串的直查。词法主循环是 `llex`(llex.c:467),`luaX_next`(:588)是对外的取下一 token 接口。注意 llex.c:187-194 有一段注释专门解释兼容开关如何影响 `global` 的词法处理。这是 5.5 词法器里少见的「实现听配置」的地方。

### 3.2 语法与 global 语句

解析入口 `luaY_parser`(lparser.c:2171)→ `mainfunc`(:2150)→ 逐条 `statement`(:2052)。5.5 语法层最大的新东西是 global 语句:

- `statement` 里新增 `TK_GLOBAL` 分支(:2094-2115),分流到 `globalstat`(全局声明,:1934)或 `globalfunc`(全局函数,:1950)。
- 声明可带属性,`getglobalattribute` 解析 `<const>`(:1865-1876);登记动作在 `checkglobal`(:1879,查重)与 `initglobal`(:1897,发射初始化)。
- 查重失败走 `luaK_codecheckglobal`(lcode.c:714-722)发射 `OP_ERRNNIL`,运行时报 `global 'x' already defined`(消息文本在 ldebug.c:817-822 的 `luaG_errnnil`)。实测:

```lua
global x = 1
global x = 2
-- 输出 global 'x' already defined
```

- global 语义有一条容易踩的规则:任何显式 global 声明都会使「块首隐式 `global *`」失效,之后未声明的名字一律按局部/报错处理(手册 manual.of:1695-1712 与 manual.of:217-239)。实测:

```lua
global x = 10
print(x)
-- 输出 variable 'print' not declared
```

- `<const>` 全局只读,赋值报错(实测输出 `attempt to assign to const variable 'n'`);`global *` 之后还能写成 `global <const> *` 把整个通配声明锁成只读(manual.of:1695-1712)。

兼容开关在语法层落地为一次前瞻:`LUA_COMPAT_GLOBAL` 打开时(luaconf.h:344-346,发行配置默认打开),`global` 不当保留字,`statement` 遇到 `TK_NAME` 时向前看是不是 `global` 跟声明形态,不是就按赋值/表达式语句走(lparser.c:2117-2134)。所以手册说 5.5 里 global 是保留词(manual.of:9587-9590),而官方发行配置默认不让它保留。读手册时这一条要对着源码理解。

for 循环控制变量 5.5 起按 `RDKCONST` 声明为只读(lparser.c:1694 与 :1721),循环体内改它直接编译报错(手册 manual.of:1615)。

### 3.3 vararg 表参数

参数表解析 `parlist`(lparser.c:1067)允许 `...` 后面再跟一个名字(:1081-1088),`setvararg`(:1061)记下这一形态并给 Proto 打 `PF_VATAB` 标。函数体内 `...` 不再只是表达式,还能下标:`... t` 声明的 `t` 是「vararg 本身打包成的表」,`t[k]` 编译为 `VVARGIND`(lcode.c:861-866,表合法性检查在 `needvatab` :809)。实测:

```lua
function f(... t)
  local s = 0
  for i = 1, #t do s = s + t[i] end
  return s, t.n
end
print(f(10, 20, 30))
-- 输出 60 3
```

`t.n` 直接给出实参个数,不再需要 `select("#", ...)`。

### 3.4 指令格式与代码生成

指令编码格式在 lopcodes.h:14-31 的注释里给出六种模式:iABC、ivABC、iABx、iAsBx、iAx、isJ。5.5 新增的 ivABC 用小宽度 B(6 位)配大宽度 C(10 位),专为 `OP_NEWTABLE`/`OP_SETLIST` 设计。表构造器和 list 装填需要更大的 C 空间描述批量行为。各操作数位宽表在 lopcodes.h:42-51,取字段宏 `GET_OPCODE`(:127)、`GETARG_A`(:138)。

代码生成的寄存器管理在 lcode.c:`checkstack`(:476)保证栈空间、`reserveregs`(:488)划走寄存器、表达式求值结果经 `exp2K`(:1055)尽量塞进常量或寄存器,赋值在 `luaK_storevar`(:1105),函数收尾统一 `luaK_ret`(:208)。指令发射的基础设施是 `luaK_codeABCk`(:399)。

指令总数从 5.4 的 83 条变为 85 条:新增 `OP_GETVARG`(vararg 表下标)与 `OP_ERRNNIL`(全局重定义检查),`OP_NEWTABLE`/`OP_SETLIST` 改用 ivABC 模式(对照两版 lopcodes.c 的 `luaP_opmodes` 表);`luaP_isIT`(lopcodes.c:120)是配套的指令类型判定。

加载外部字节码的入口 `luaU_undump` 签名也变了:5.5 是 `(lua_State*, ZIO*, Table *anchor, int fixed)`(lundump.h:33-34),5.4 是 `(lua_State*, ZIO*, const char *name)`(lundump.h:29)。格式标识随之变化:`LUAC_VERSION` 改为 `MAJOR*16+MINOR` 直算(lundump.h:27;5.4 在 :24),校验字 `LUAC_INT` 从 `0x5678` 翻成 `-0x5678`(:20,5.4 在 :18)。因此 5.4 编译的 `.luac` 文件 5.5 会直接拒载,必须重编译。

看一段真实产物(`luac -l` 实测输出):

```lua
-- 源码:
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

三个细节:主 chunk 也按 vararg 函数对待,所以第一条是 `VARARGPREP`;`NEWTABLE` 后面跟 `EXTRAARG`,表大小描述跨了指令边界;`ADD` 后面跟 `MMBIN`,数值快速路径失败时才触发 `__add` 元方法。

## 4. 虚拟机主循环

解释器主循环 `luaV_execute` 在 lvm.c:1204。骨架三件套:`vmfetch` 取指并顺带做栈空间检查(:1191-1197),`vmdispatch` 按 opcode 分发(:1199-1201,就是个 `switch`),`vmcase`/`vmbreak` 定义各分支的入口与出口(:1199-1201)。编译宏 `LUA_USE_JUMPTABLE` 打开时,`#include "ljumptab.h"`(:1211-1213)把 switch 换成跳转表。ljumptab.h:9-14 把 `vmcase(x)` 展开成 label;内部测试配置固定关掉它(ltests.h:41),以保证断点与覆盖率工具看到的代码形态稳定。

每条指令运行在两道保护之间:`Protect`(:1164)包住可能重入 C 层、导致栈或状态失效的操作;`checkGC`(:1183)在分配点检查是否该让 GC 走一步;`luai_threadyield`(:1176-1178)在协作式调度下给宿主让路的机会。

典型指令的处理模式可以分成几类:

- 表读:`OP_GETFIELD`(:1344)先走 `luaH_fastgeti` 快路径,失败回落 `luaV_finishget`(lvm.c:291)处理元表 `__index` 链;写侧对称地回落 `luaV_finishset`(:334)。
- 算术:`OP_MMBINI`(:1572)等 MMBIN 家族只做元方法兜底,数值运算在前面已尝试。
- 调用:`OP_CALL`(:1726)展开参数、切 `CallInfo`;`OP_TAILCALL`(:1741)复用当前帧;返回走 `OP_RETURN`(:1769)与快路径 `OP_RETURN0`(:1800)。
- 迭代:`OP_TFORCALL`(:1881)调用迭代器并保存控制变量。
- vararg:`OP_VARARGPREP`(:1959)在函数入口把参数搬好,`OP_VARARG`(:1943)把可变参数铺到寄存器,`OP_GETVARG`(:1949)处理 vararg 表下标,`OP_ERRNNIL`(:1955)拦下全局重定义。
- `OP_EXTRAARG`(:1968)永远跟在需要 17 位以上操作数的指令后面补位。

被 `yield` 打断的指令靠 `luaV_finishOp`(lvm.c:861)在 resume 时补完。这是协程能跨 VM 指令边界挂起的关键(见第 6 节)。字符串连接、长度、比较的语义实现分别在 `luaV_concat`(:690)、`luaV_objlen`(:737)、`luaV_lessthan`(:555)与 `luaV_equalobj`(:588)。

## 5. GC:从两态到三态

### 5.1 模式与状态

5.4 的 GC 模式枚举只有增量 `KGC_INC` 和分代 `KGC_GEN` 两态(lstate.h:151-152,5.4)。5.5 拆成三态(lstate.h:162-164):`KGC_INC`(增量)、`KGC_GENMINOR`(分代·小收)、`KGC_GENMAJOR`(分代·大收)。分代模式的「小收/大收」不再是同一次循环里的阶段,而是两种可互相切换的运行形态。

### 5.2 参数体系:换了一整套 API

GC 参数从编译期宏改成运行时可调的字节表 `gcparams[]`(lstate.h:338),配套新 C API `lua_gcparam`(lua.h:331-357 的新选项区)与 `LUA_GCP_*` 参数编号(0-5)。默认值集中在 lgc.h:170-205:

| 参数 | 默认 | 行号 |
| --- | --- | --- |
| 小收集→大收集触发比例 MINORMAJOR | 70% | lgc.h:173 |
| 大收集→小收集回落比例 MAJORMINOR | 50% | lgc.h:179 |
| 小收集节奏 GENMINORMUL | 20% | lgc.h:185 |
| 暂停系数 GCPAUSE | 250% | lgc.h:191 |
| 步进倍率 GCMUL | 200% | lgc.h:198 |
| 步进粒度 GCSTEPSIZE | 200 × sizeof(Table) | lgc.h:201 |

5.4 同位置是 `LUAI_GENMAJORMUL 100`、`LUAI_GCPAUSE 200`(lgc.h:128、lgc.h:131,5.4)。参数以压缩字节存储:`luaO_codeparam`(lobject.c:62)编码、`luaO_applyparam`(:89)解码。脚本侧对应 `collectgarbage("param", ...)`。5.4 的 `"setpause"`/`"setstepmul"` 选项已从 opts 表删除(lbaselib.c:202-208)。

### 5.3 触发条件方向反转

内存记账是 `GCtotalbytes - GCdebt`(lstate.h:435)。5.5 的自动触发判断写成 `GCdebt <= 0`(lgc.h:233 的 `luaC_condGC`),5.4 是 `GCdebt > 0`(lgc.h:168-169,5.4)。债务语义整个反过来,读代码时先换脑子。

### 5.4 引擎内部

增量模式:`luaC_step` 驱动(lgc.c:1740-1763),内部 `incstep`(:1710-1729)按步进预算推进状态机 `singlestep`(:1606-1614,用负数返回码标记 `step2pause`/`atomicstep`/`step2minor` 等关键转移),清扫阶段从 `entersweep`(:1504)进入,原子阶段在 `atomic`(:1543)。

分代模式:小收集 `youngcollection`(:1335)只扫新生对象,`sweep2old`(:1136)把幸存者直接标老;晋升与大收集的衔接在 `atomic2gen`(:1389)与 `finishgencycle`(:1292)。模式切换由 `checkminormajor`(:1318)依据计数器 `GCmajorminor`(lstate.h:333,角色注释在 lgc.c:1099-1113)决定走 `minor2inc`(:1304)还是反向;需要完整增量周期时用 `luaC_fullgc`(:1786,可经 `fullinc` :1766 指定强制增量)。

对象的年龄迁移不再依赖 5.4 的 `changeage` 帮助函数(5.4 lgc.h:120-121;5.5 已无此函数),改为链表标记法:各代在 `allgc` 等链表上的分界点由指针记录(lstate.h:22-63 的注释详细画了 `survival`/`old1`/`reallyold` 各链边界),年龄语义见 lgc.h:125-160 的注释(`YOUNG0`→`TOUCHED1`→`TOUCHED2`→`OLD0`→`OLD1`)。

## 6. 协程与 yield/resume

库层很薄,重量都在引擎。`coroutine.create`/`wrap`/`yield`/`resume`/`status` 的实现分别在 lcorolib.c:96、:106、:113、:57、:150(`auxresume` :33 是共享的恢复辅助),函数注册表在 :207-216,`luaopen_coroutine` 在 :220。

恢复链路:`lua_resume`(ldo.c:968)→ `resume`(:918,处理上次因 debug 钩子让位的现场,包括回退 savedpc)→ 失败时 `precover`(:950)在受保护调用帧间找恢复点 → `unroll`(:868)逐帧重新进入 `luaV_execute`。

让位链路:`coroutine.yield` 最终到 `lua_yieldk`(ldo.c:1008),它把线程状态置 `LUA_YIELD`、把让位值个数存进 `ci->u2.nyield`,然后 `luaD_throw(L, LUA_YIELD)`(:1031)。让位被实现为一次「以 LUA_YIELD 为码的异常抛出」,直接退栈到最近的 resume。`luaD_throw`(:125-144)在有无保护点两种情形下分别走 longjmp 与 panic;`throwbaselevel`(:150-157)处理最外层的边界情况。

两个支撑机制:`nCcalls` 的高 16 位统计不可让位的 C 调用层数(lstate.h:95-104 的注释与 :302 字段),`lua_resume` 入口用 `LUAI_MAXCCALLS`(ldo.h:63,值 200)限制嵌套深度(ldo.c:985);C 函数要让位必须提供 continuation(`ci->u.c.k`,lstate.h:198),resume 后由 `luaV_finishOp`(lvm.c:861)补完被中断的那条指令。这就是 C 侧 `lua_yieldk` 带回调参数的原因。

## 7. 标准库组织

5.5 把「打开哪些库」变成显式的位掩码协议:`lualib.h` 里 `LUA_GLIBK` 从 1 开始逐位左移定义各库标志(lualib.h:17-54),`linit.c` 的 `stdlibs[]` 表(:29-41)把每个 `luaopen_*` 与标志一一对应,表前注释(:26-28)明确要求顺序与位标志一致。宿主调 `luaL_openselectedlibs`(linit.c:48-64)按位开库,函数末尾的断言(:62)保证传入的所有位都被消费;没被编译选项纳入的库落回 `package.preload` 机制(:55-59)。5.4 的做法只有一张 `loadedlibs[]` 表加一个全开的 `luaL_openlibs`(linit.c:42-52,5.4)。

单个标准库的样板(以 coroutine 为例):`luaopen_coroutine` 建表后用 `luaL_setfuncs`(lauxlib.c:978)批量注册 C 函数(注册表见 lcorolib.c:207-216),`luaL_requiref`(lauxlib.c:1019)负责把库表挂进 `package.loaded`。

内容增量不多:`table.create` 是新增的表函数(ltablib.c:64,注册于 :414);C API 层新增 `lua_pushexternalstring`(lua.h:247)支持零拷贝字符串,但字符串库的 Lua 侧接口没动。

## 8. 与 5.4 的关键变化

对照官方手册的兼容性章节(manual.of:9575-9714,标题即 "Incompatibilities ... from Lua 5.4 to Lua 5.5",:9586)与源码差异,汇总如下:

| 变化 | 出处 |
| --- | --- |
| `global` 语句:显式声明、`<const>` 只读、`global *` 通配 | manual.of:1695-1712;lparser.c:2094-2115 |
| for 循环控制变量只读 | manual.of:1615;lparser.c:1694/:1721 |
| vararg 表参数 `function f(... t)` | manual.of:2363-2365;lparser.c:1081-1088 |
| 错误对象为 nil 时统一转成字符串 | manual.of:376 |
| `__call` 元方法链上限 15 | manual.of:9637;lstate.h:226-227(4 位计数) |
| 函数返回值上限 250 | lstate.h:216(`MAXRESULTS`) |
| 字节码格式不兼容,旧 `.luac` 拒载 | lundump.h:20-27/:33;5.4 lundump.h:18-24/:29 |
| `lua_newstate` 增加种子参数 | lua.h:163;种子生成 lauxlib.c:1168-1182 |
| 注册表索引改为 `-(INT_MAX/2+1000)`,`LUA_RIDX_MAINTHREAD`=3 | lua.h:43、lua.h:85 |
| 新增 `lua_pushexternalstring`、`lua_numbertocstring` | lua.h:247、lua.h:374-375 |
| `lua_resetthread` 改为 `lua_closethread` 的宏 | lua.h:440 |
| `lua_setcstacklimit` 删除(两版 lua.h 对照) | 5.5 头文件无此声明 |
| 调试钩子字段 `ftransfer`/`ntransfer` 改 int | lua.h:500-502 |
| GC 三态化 + `lua_gcparam` API(第 5 节) | lstate.h:162-164;lgc.h:170-205 |

其中 `global` 是语义变化最大的一项,三条实测行为值得记住:显式声明会关掉隐式 `global *`(上文 "variable 'print' not declared" 一例);重复声明报 `global 'x' already defined`;`<const>` 全局赋值报错。另外手册称 global 为保留词(manual.of:9587-9590),而发行配置 `LUA_COMPAT_GLOBAL` 默认为 1(luaconf.h:344-346)使其退回普通标识符加语法前瞻(lparser.c:2117-2134)。移植脚本时按「非保留、但新增语句形态」理解更贴近实际行为。

至于「为什么升 5.5」,手册与源码注释里没有官方动机陈述(未见于源码)。从改动本身归纳:显式 global 与只读全局把「谁在污染环境」变成可静态表达的约束;vararg 表参数把 `select("#", ...)` 这类惯用法收进语言;分代 GC 从 5.4 的实验性两态重做成可切换的三态并给了运行时参数;内置散列种子(lauxlib.c:1168-1182)降低键碰撞被注入的风险。这四类是官方仓库里能从代码直接指认的方向,其余收益属于推测,本文不展开。

## 结语

读 5.5 源码的要点:数据结构先看 lobject.h 与 ltable.h 的注释块,解释器行为看 lvm.c 的指令分支,生命周期看 lgc.h/lstate.h 的列表与年龄注释。5.5 的三处大改(Table 布局、GC 三态、global 语句)都有对应的注释块与测试用例(testes/ 目录),源码与测试对照着读,行号之外的东西(设计意图)大多写在注释里。

## 相关阅读

- [虚拟机架构](/design-and-implementation/vm-architecture)
- [字节码与虚拟机](/design-and-implementation/bytecode-and-vm)
- [代码生成与优化](/design-and-implementation/code-generation)
- [协程的底层实现](/design-and-implementation/coroutines-implementation)
- [垃圾回收的优化策略](/design-and-implementation/gc-optimization)
- [垃圾回收的实现细节](/design-and-implementation/gc-implementation)
- [Lua 5.5 官方手册](https://www.lua.org/manual/5.5/)
