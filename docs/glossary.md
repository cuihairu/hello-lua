# Lua 术语表

本表收录本站 Lua 语言核心、运行时实现、工程实践与 LuaJIT 生态的核心术语，每条给出中英对照、一句话定义、权威出处与相关页。

**维护口径**：新增条目必须给出可点的权威出处；查不到就写「未找到权威出处（待核）」，不得凭印象编造链接。

## 语言核心

### 值与类型（Values and Types）
Lua 是动态类型语言；八种基本类型 nil、boolean、number、string、table、function、userdata、thread。
**出处**：[Lua 5.4 手册 §2.2](https://www.lua.org/manual/5.4/manual.html#2.2)、[维基百科 · 动态类型](https://en.wikipedia.org/wiki/Dynamic_typing)
**相关页**：[basics/data-types](/basics/data-types)、[knowledge/core-concepts](/knowledge/core-concepts)

### 表（Table）
Lua 唯一的数据结构：关联数组，可实现数组、字典、对象、命名空间与模块。
**出处**：[Lua 5.4 手册 §2.2](https://www.lua.org/manual/5.4/manual.html#2.2)、[维基百科 · 关联数组](https://en.wikipedia.org/wiki/Associative_array)
**相关页**：[basics/tables](/basics/tables)、[basics/data-structures](/basics/data-structures)

### 元表（Metatable）
定义表在特定操作下的自定义行为的表；Lua 元编程与面向对象的基石。
**出处**：[Lua 5.4 手册 §2.6](https://www.lua.org/manual/5.4/manual.html#2.6)、[PIL 第 11 章](https://www.lua.org/pil/11.html)
**相关页**：[basics/metatables-and-metamethods](/basics/metatables-and-metamethods)、[advanced/object-system](/advanced/object-system)

### 元方法（Metamethod）
元表中以双下划线命名的字段（如 __index、__newindex、__add），拦截对应操作。
**出处**：[Lua 5.4 手册 §2.6](https://www.lua.org/manual/5.4/manual.html#2.6)
**相关页**：[basics/metatables-and-metamethods](/basics/metatables-and-metamethods)、[advanced/oop-implementation](/advanced/oop-implementation)

### 闭包（Closure）
捕获外部局部变量（上值）的函数；Lua 函数是一等公民，闭包是模块化的基本构件。
**出处**：[Lua 5.4 手册 §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)、[维基百科 · 闭包](https://en.wikipedia.org/wiki/Closure_(computer_programming))
**相关页**：[advanced/closures](/advanced/closures)、[advanced/anonymous-functions](/advanced/anonymous-functions)

### 一等函数（First-class Function）
函数可存储、传递、返回；Lua 函数式编程的前提。
**出处**：[维基百科 · 一等函数](https://en.wikipedia.org/wiki/First-class_function)、[Lua 5.4 手册 §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)
**相关页**：[advanced/functional-programming](/advanced/functional-programming)、[advanced/higher-order-functions](/advanced/higher-order-functions)

### 协程（Coroutine）
可挂起与恢复的执行流；Lua 以 thread 类型与 coroutine 库实现协作式并发。
**出处**：[Lua 5.4 手册 §2.5](https://www.lua.org/manual/5.4/manual.html#2.5)、[PIL 第 10 章](https://www.lua.org/pil/10.html)、[维基百科 · 协程](https://en.wikipedia.org/wiki/Coroutine)
**相关页**：[advanced/coroutines](/advanced/coroutines)、[design-and-implementation/coroutines-design](/design-and-implementation/coroutines-design)

### 尾调用（Tail Call）
函数末尾的调用可被复用栈帧；Lua 5.4 正确实现尾调用消除，递归不溢栈。
**出处**：[维基百科 · 尾调用](https://en.wikipedia.org/wiki/Tail_call)、[Lua 5.4 手册 §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)
**相关页**：[basics/functions](/basics/functions)、[advanced/coroutine-best-practices](/advanced/coroutine-best-practices)

### 词法作用域（Lexical Scope）
名字可见性由源码结构决定；Lua 局部变量的上值捕获依赖它。
**出处**：[维基百科 · 作用域](https://en.wikipedia.org/wiki/Scope_(computer_science))
**相关页**：[basics/variables](/basics/variables)、[advanced/closures](/advanced/closures)

### 多重赋值（Multiple Assignment）
Lua 支持一次给多个变量赋值，多余变量得 nil、多余值被丢弃。
**出处**：[Lua 5.4 手册 §2.2](https://www.lua.org/manual/5.4/manual.html#2.2)、[PIL 第 2 章](https://www.lua.org/pil/2.html)
**相关页**：[basics/syntax](/basics/syntax)、[knowledge/pitfalls](/knowledge/pitfalls)

### 上值（Upvalue）
闭包捕获的外层局部变量；Lua 5.2+ 上值显式归属闭包。
**出处**：[Lua 5.4 手册 §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)
**相关页**：[advanced/closures](/advanced/closures)、[advanced/anonymous-functions](/advanced/anonymous-functions)

## 运行时与实现

### 虚拟机（Virtual Machine）
Lua 程序编译为字节码后在寄存器式虚拟机上解释执行。
**出处**：[维基百科 · 虚拟机](https://en.wikipedia.org/wiki/Virtual_machine)、[维基百科 · 字节码](https://en.wikipedia.org/wiki/Bytecode)
**相关页**：[design-and-implementation/bytecode-and-vm](/design-and-implementation/bytecode-and-vm)、[design-and-implementation/vm-architecture](/design-and-implementation/vm-architecture)

### 字节码（Bytecode）
luac 编译产物与 VM 指令集；luac -l 可反汇编查看。
**出处**：[维基百科 · 字节码](https://en.wikipedia.org/wiki/Bytecode)、[Lua 源码仓](https://github.com/lua/lua)
**相关页**：[design-and-implementation/code-generation](/design-and-implementation/code-generation)、[design-and-implementation/bytecode-and-vm](/design-and-implementation/bytecode-and-vm)

### 垃圾回收（Garbage Collection）
Lua 5.4 默认分代 GC，另有增量模式；由 collectgarbage 与 lua_State 参数调节。
**出处**：[Lua 5.4 手册 §2.7](https://www.lua.org/manual/5.4/manual.html#2.7)、[维基百科 · 垃圾回收](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))
**相关页**：[design-and-implementation/garbage-collection](/design-and-implementation/garbage-collection)、[lua-best-practices/gc-tuning](/lua-best-practices/gc-tuning)

### 弱引用表（Weak Table）
__mode 元字段标记的表，键或值可被 GC 回收；缓存与对象登记的惯用法。
**出处**：[Lua 5.4 手册 §2.7](https://www.lua.org/manual/5.4/manual.html#2.7)、[维基百科 · 弱引用](https://en.wikipedia.org/wiki/Weak_reference)
**相关页**：[design-and-implementation/garbage-collection](/design-and-implementation/garbage-collection)、[lua-best-practices/gc-tuning](/lua-best-practices/gc-tuning)

### C API（C API）
宿主程序嵌入 Lua 的 C 接口：栈式数据交换、lua_State 生命周期与注册表。
**出处**：[Lua 5.4 手册 §4](https://www.lua.org/manual/5.4/manual.html#4)
**相关页**：[lua-extensions-applications/c-interaction](/lua-extensions-applications/c-interaction)、[lua-extensions-applications/calling-lua-from-c](/lua-extensions-applications/calling-lua-from-c)

### 即时编译（Just-in-time Compilation）
运行时把热点代码编译为机器码；LuaJIT 采用追踪编译实现。
**出处**：[维基百科 · JIT](https://en.wikipedia.org/wiki/Just-in-time_compilation)、[维基百科 · 追踪 JIT](https://en.wikipedia.org/wiki/Tracing_just-in-time_compilation)
**相关页**：[lua-extensions-applications/luajit](/lua-extensions-applications/luajit)、[lua-extensions-applications/luajit-optimization](/lua-extensions-applications/luajit-optimization)

### 寄存器机（Register Machine）
Lua VM 以寄存器而非栈传递操作数；对比 Stack machine 指令更少。
**出处**：[维基百科 · 寄存器机](https://en.wikipedia.org/wiki/Register_machine)、[维基百科 · 栈机](https://en.wikipedia.org/wiki/Stack_machine)
**相关页**：[design-and-implementation/vm-architecture](/design-and-implementation/vm-architecture)

### 动态链接（Dynamic Linking）
luaopen_* + package.loadlib 在运行时装载二进制扩展模块。
**出处**：[Lua 5.4 手册 §8](https://www.lua.org/manual/5.4/manual.html#8)、[维基百科 · 动态链接](https://en.wikipedia.org/wiki/Dynamic_linking)
**相关页**：[design-and-implementation/dynamic-linking](/design-and-implementation/dynamic-linking)、[advanced/modules-and-packages](/advanced/modules-and-packages)

## 工程实践

### 模块（Module）
require 装载的代码单元；Lua 5.1+ 惯例返回 table 的 chunk。
**出处**：[Lua 5.4 手册 §6.3](https://www.lua.org/manual/5.4/manual.html#6.3)、[维基百科 · 模块](https://en.wikipedia.org/wiki/Module_(computer_science))
**相关页**：[advanced/module-definition](/advanced/module-definition)、[design-and-implementation/module-system](/design-and-implementation/module-system)

### LuaRocks（LuaRocks）
Lua 事实标准的包管理器与模块分发仓库。
**出处**：[LuaRocks 官网](https://luarocks.org/)
**相关页**：[advanced/package-management](/advanced/package-management)、[appendix/resources](/appendix/resources)

### 沙箱（Sandbox）
裁剪 os/io/load 等能力，把不可信代码关进受限环境。
**出处**：[Lua 5.4 手册 §2.7](https://www.lua.org/manual/5.4/manual.html#2.7)、[维基百科 · 沙箱](https://en.wikipedia.org/wiki/Sandbox_(computer_security))
**相关页**：[advanced/sandboxing](/advanced/sandboxing)

### 错误处理（Error Handling）
error 抛出 + pcall/xpcall 捕获；跨边界时错误对象保持类型。
**出处**：[Lua 5.4 手册 §2.4](https://www.lua.org/manual/5.4/manual.html#2.4)、[维基百科 · 异常处理](https://en.wikipedia.org/wiki/Exception_handling)
**相关页**：[advanced/error-handling](/advanced/error-handling)、[knowledge/pitfalls](/knowledge/pitfalls)

### 栈回溯（Stack Trace）
xpcall 的 debug.traceback 参数给出出错调用链。
**出处**：[维基百科 · 栈回溯](https://en.wikipedia.org/wiki/Stack_trace)
**相关页**：[advanced/error-types-debugging](/advanced/error-types-debugging)、[lua-best-practices/debugging-tools](/lua-best-practices/debugging-tools)

### 元编程（Metaprogramming）
通过元表在运行时改变语言结构行为（继承、运算符重载、惰性加载）。
**出处**：[维基百科 · 元编程](https://en.wikipedia.org/wiki/Metaprogramming)
**相关页**：[advanced/object-system](/advanced/object-system)、[advanced/oop-implementation](/advanced/oop-implementation)

### 原型继承（Prototype-based Programming）
Lua 无类：对象由对象复制（元表 __index 链）派生。
**出处**：[维基百科 · 原型编程](https://en.wikipedia.org/wiki/Prototype-based_programming)、[PIL 第 13 章](https://www.lua.org/pil/13.html)
**相关页**：[advanced/object-oriented](/advanced/object-oriented)、[advanced/inheritance-and-polymorphism](/advanced/inheritance-and-polymorphism)

## LuaJIT 生态

### LuaJIT（LuaJIT）
Lua 5.1 方言的追踪 JIT 实现，与 lua.org 解释器并列的主流运行时。
**出处**：[LuaJIT 官网](https://luajit.org/luajit.html)、[维基百科 · LuaJIT](https://en.wikipedia.org/wiki/LuaJIT)
**相关页**：[lua-extensions-applications/luajit](/lua-extensions-applications/luajit)、[lua-extensions-applications/introduction-to-luajit](/lua-extensions-applications/introduction-to-luajit)

### FFI（Foreign Function Interface）
LuaJIT 的 C 类型声明与外部函数直调库，免写 C 胶水。
**出处**：[LuaJIT FFI 文档](https://luajit.org/ext_ffi.html)、[LuaJIT FFI API](https://luajit.org/ext_ffi_api.html)
**相关页**：[lua-extensions-applications/ffi-library](/lua-extensions-applications/ffi-library)、[lua-extensions-applications/mixed-programming](/lua-extensions-applications/mixed-programming)

### 追踪编译器（Trace Compiler）
LuaJIT 记录热路径为线性追踪再编译为机器码的机制。
**出处**：[LuaJIT 优化文档](https://luajit.org/ext_jit.html)、[维基百科 · 追踪 JIT](https://en.wikipedia.org/wiki/Tracing_just-in-time_compilation)
**相关页**：[lua-extensions-applications/luajit-optimization](/lua-extensions-applications/luajit-optimization)

---

**维护口径**：新增条目必须给出可点的权威出处；查不到就写「未找到权威出处（待核）」，不得凭印象编造链接。

<!-- BACKLINKS-AUTO -->
## 相关页面

- [README](/knowledge/README.md)
