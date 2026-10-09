# 核心概念

全站的概念按四组收拢：语言基础、进阶抽象、设计与实现、扩展与工程。每条给结论和站内出处。

## 语言基础

### 八种数据类型

nil、boolean、number、string、table、function、userdata、thread。number 在 Lua 5.3 及以后分为 integer 和 float，5.1/5.2 里所有数字都是浮点数。thread 指协程，不是操作系统线程。

来源：[数据类型](/basics/data-types)。

### 表是唯一的数据结构

数组、字典、集合、对象都由表表示，`{}` 创建。数组索引从 1 开始，不是 0；键可以是任何非 nil 值，`person.name` 与 `person["name"]` 等价。数组用 `ipairs` 遍历，字典用 `pairs`，后者的顺序不保证。

来源：[表（Tables）](/basics/tables)、[数组和字典的使用](/basics/arrays-and-dictionaries)、[数据结构](/basics/data-structures)。

### 局部变量与全局变量

`local` 定义局部变量，作用域限于所在块，块结束即销毁；不加 `local` 就是全局变量，这是 Lua 的默认行为，也是要避免的习惯。局部变量在虚拟机里直接寻址，比全局变量快。

来源：[变量和赋值](/basics/variables)。

### 操作符

算术七种（`+` `-` `*` `/` `%` `^` `//`）、比较六种（`==` `~=` `>` `<` `>=` `<=`）、逻辑三种（`and` `or` `not`），再加字符串连接 `..` 和赋值 `=`。三个跨语言易错点：不等号是 `~=` 不是 `!=`；`^` 和 `/` 恒返回浮点数；要整数结果必须用 `//`。

来源：[操作符和表达式](/basics/operators-and-expressions)。

### 元表与元方法

元表定义另一个表的行为，`setmetatable` 关联。常用元方法：`__index`（键不存在时调用）、`__newindex`（对不存在的键赋值时调用）、`__add`/`__sub`/`__mul`（运算符重载）、`__call`、`__tostring`。两条注意：`__index`/`__newindex` 里直接操作原始表会无限递归，绕开要用 `rawget`/`rawset`；元方法用得过密会拖慢性能。

来源：[元表和元方法](/basics/metatables-and-metamethods)。

### 字符串处理

字符串不可变，改动只能生成新字符串。拼接用 `..`，长度用 `#`，`string.sub`/`gsub`/`format`/`find`/`match`/`gmatch` 覆盖常用操作。Lua 没有内置 split，要用 `gmatch` 加模式 `([^,]+)` 模拟。模式匹配类似正则但不完全相同。

来源：[字符串处理](/basics/string-handling)。

### 控制结构

条件 `if-then-elseif-else`；循环 `while`、`repeat-until`、`for`（数值与泛型两种）；`break` 跳出循环，`return` 返回。`repeat-until` 在条件为真时退出，循环体至少执行一次，方向与 `while` 相反。

来源：[控制结构](/basics/control-structures)。

### 函数是一等值

函数可以赋给变量、当参数传、当返回值返回。支持多返回值、可变参数 `...`、匿名函数。闭包捕获并保存外部局部变量，`createCounter` 这类例子中计数状态就存在闭包里。

来源：[函数定义与调用](/basics/functions)。

## 进阶抽象

### 闭包

闭包是一个函数加上它引用的外部函数局部变量。外部函数返回后，这些变量依然活着，只有闭包能访问。每次调用外部函数产生独立闭包，各自维护状态；数据封装、函数工厂都建立在这上面。

来源：[闭包（Closures）](/advanced/closures)。

### 高阶函数与匿名函数

高阶函数接受函数作参数或返回函数；匿名函数没有名字，适合只用一次的场合。三者组合——`map`、`filter`、`compose`、`makeAdder`——是 Lua 里函数式写法的基础。

来源：[高阶函数](/advanced/higher-order-functions)、[匿名函数](/advanced/anonymous-functions)、[函数编程](/advanced/functional-programming)。

### 面向对象靠表加元表

Lua 没有 `class` 关键字，类和继承都用表与元表搭。标准三步：建类表、`Class.__index = Class`、构造函数里 `setmetatable({}, self)` 造实例。继承用原型链，子类元表是 `{ __index = Parent }`。构造函数里写 `self` 而不是写死类名，子类才能沿链继承。

来源：[面向对象编程](/advanced/object-oriented)、[面向对象的实现](/advanced/oop-implementation)、[基于表的对象系统](/advanced/object-system)。

### self 与冒号语法糖

`self` 不是关键字，只是约定参数名，由冒号自动传入：`obj:method(a)` 等价于 `obj.method(obj, a)`。点号冒号混用是最多发的错误——冒号定义用点号调用，`self` 为 nil 直接报错。方法作回调传递时 `self` 会丢，要用闭包绑定对象。

来源：[self 的作用](/advanced/self)。

### 多态与继承

方法查找沿调用对象的 `__index` 链进行，子类定义同名方法就自然覆盖父类版本，没有 `virtual` 之类的声明。字段存各实例自己身上，方法只在类表存一份、所有实例共享。

来源：[继承与多态](/advanced/inheritance-and-polymorphism)、[面向对象的实现](/advanced/oop-implementation)。

### 设计模式

单例、工厂、观察者、策略、装饰器五种模式没有用到表和元表之外的机制：单例靠缓存实例，工厂靠分支选构造函数，观察者靠一张回调列表，策略靠把函数当字段，装饰器靠包一层再转发。

来源：[面向对象设计模式](/advanced/design-patterns)。

### 协程

协程是可执行到一半暂停、之后从暂停处继续的函数，是 Lua 的原生 thread 类型。`coroutine.create` 创建后不运行，要 `coroutine.resume` 启动；`yield` 与 `resume` 构成双向数据通道。状态四种：suspended、running、normal、dead，dead 是不可逆的终点。`coroutine.wrap` 返回恢复函数而非协程对象，没有错误保护层。

来源：[协程的基本概念](/advanced/coroutines-basics)、[协程的状态与生命周期](/advanced/coroutine-lifecycle)、[协程的创建与使用](/advanced/creating-using-coroutines)。

### 协程与线程的区别

协程是协作式的，只在 `yield` 处让出，同一 Lua 状态里任意时刻只有一个协程在跑，因此没有并行、一般也不需要加锁。切换在用户态完成，开销远小于线程。代价是阻塞调用（`io.read`、同步网络请求、`os.execute`）会卡住整个进程。

来源：[协程与线程的比较](/advanced/coroutines-vs-threads)、[协程与并发编程](/advanced/coroutines)。

### 模块与包

模块就是一个返回表的 Lua 文件，文件名与模块名一致，用 `require` 加载。`require` 按 `package.path` 查 Lua 文件、`package.cpath` 查 C 扩展，并把结果缓存到 `package.loaded`。要热加载，清掉对应缓存条目再 `require` 即可。

来源：[模块的定义与加载](/advanced/module-definition)、[模块与包](/advanced/modules-and-packages)、[Lua的包管理](/advanced/package-management)。

### 错误处理

`pcall` 返回 status 和 result，`xpcall` 多接一个错误处理函数，`error` 主动抛错，`assert` 校验条件。两个容易记反的点：`1 / 0` 不报错、结果是 `inf`，只有整数 `//` 或 `%` 除数为零才抛错；访问表中不存在的键只得到 nil，不对 nil 本身做索引才报错。

来源：[错误处理机制](/advanced/error-handling-mechanism)、[错误处理](/advanced/error-handling)、[错误类型与调试](/advanced/error-types-debugging)。

## 设计与实现

### 单遍编译，不建 AST

词法分析用有限状态机识别记号，语法分析用递归下降（LL(1) 文法经改写避开左递归）。解析器是单遍的：每识别出一条语句或表达式，就立即由 `lcode.c` 翻译成字节码，不构造显式 AST。

来源：[词法分析与语法分析](/design-and-implementation/lexical-syntax-analysis)、[Lua解释器的实现](/design-and-implementation/interpreter-implementation)。

### 编译期优化只有四种

官方实现的编译期优化只有常量折叠、立即数指令编码、跳转指令回填、寄存器复用。公共子表达式消除、循环不变代码外提、跨指令死代码消除都不做，留给运行效率和 LuaJIT 这类带 JIT 的实现。常量折叠只对两个操作数都是常量的表达式生效。

来源：[代码生成与优化](/design-and-implementation/code-generation)。

### 寄存器虚拟机

解释器主循环是 `lvm.c` 的 `luaV_execute`。寄存器是从 Lua 栈中为当前函数划分的槽位，指令直接以寄存器编号读写，不像栈机那样反复压栈弹栈，指令数因此更少。每次函数调用对应一个 `CallInfo` 结构。

来源：[虚拟机架构](/design-and-implementation/vm-architecture)。

### 字节码不保证跨平台

同一版本的 Lua 在不同平台生成的字节码格式相同，但官方明确不保证 `luac -o` 生成的预编译块跨平台可移植——字节序、整数和浮点数宽度不同的机器之间可能加载失败。正确做法是在目标平台重新编译。

来源：[字节码与虚拟机](/design-and-implementation/bytecode-and-vm)。

### GC 是标记-清除，不是引用计数

Lua 只使用标记-清除管理对象生命周期，不采用引用计数（仅少数内部场合借用了计数思想，如对已打开 upvalue 的计数）。标记阶段从根对象（全局变量 + 当前调用栈局部变量）遍历可达对象，因此能处理循环引用。5.4 提供增量与分代两种模式，二选一。

来源：[引用计数与标记-清除算法](/design-and-implementation/reference-counting)、[垃圾回收机制](/design-and-implementation/garbage-collection)。

### 统一内存分配器

`lua_newstate` 注册的 `lua_Alloc` 是所有对象分配释放的唯一入口，默认实现基于 `realloc`，不使用预分配内存池。换掉这个函数就能接入自定义内存管理，例如嵌入式设备的内存配额。短字符串会被内部化，相同内容只存一份。

来源：[内存管理机制](/design-and-implementation/memory-management)。

### 协程的底层实现

每个协程就是一个独立的 `lua_State`，内部没有单独的 "Coroutine" 结构体。切换只交换栈指针和 `CallInfo`（其中保存指令指针），不保存或恢复 CPU 寄存器，也不涉及系统调用。`setjmp`/`longjmp` 只用于错误恢复，不用于协程切换，所以协程只能在同一线程内协作切换。

来源：[协程的底层实现](/design-and-implementation/coroutines-implementation)、[协程的调度与切换](/design-and-implementation/coroutines-scheduling)。

### 模块系统的实现

模块文件构建一张表并在末尾返回；`require` 负责加载、执行、返回，缓存已内置在 `package.loaded`，实际项目很少需要自建缓存。C 扩展用 `package.loadlib("mylib.so", "luaopen_mylib")` 动态加载。热加载清掉 `package.loaded` 条目再 `require`，但要注意模块状态丢失和依赖模块未同步重载这两个翻车点。

来源：[模块系统的实现](/design-and-implementation/module-system)、[热加载与动态更新](/design-and-implementation/hot-reloading)、[动态链接与模块加载](/design-and-implementation/dynamic-linking)。

### Lua 5.5 的主要变化

新增 `global` 语句、vararg 表参数 `function f(... t)`、`table.create`；指令总数 83 增到 85，新增 `OP_GETVARG` 与 `OP_ERRNNIL`；字节码校验字翻转，5.4 编译的 `.luac` 文件 5.5 直接拒载，必须重编译；GC 模式拆成增量与分代三态，5.4 的 `setpause`/`setstepmul` 选项已删除。行号随版本漂移，引用要对准版本。

来源：[Lua 5.5 源码解析](/design-and-implementation/lua55-source)。

### 轻量级设计

核心库只保留表、函数、协程、基本 I/O，正则、文件系统等做成独立模块按需加载。低内存占用靠统一分配函数加增量式 GC，以及用表作为唯一数据结构。嵌入接口是 C API，扩展以动态链接库形式加入。

来源：[Lua的轻量级设计](/design-and-implementation/lightweight-design)、[Lua语言的设计原理](/design-and-implementation/design-principles)。

## 扩展与工程

### C API 双向调用

Lua 与 C 的调用是双向的，走同一套 C API。状态生命周期三步：`luaL_newstate` 创建、`luaL_openlibs` 打开标准库、`lua_close` 关闭。在 C 中调 Lua 函数：`lua_getglobal` 推函数、`lua_pushnumber` 压参数、`lua_pcall` 调用、`lua_tonumber` 取返回值、`lua_pop` 清理栈。

来源：[C与Lua的交互](/lua-extensions-applications/c-interaction)、[在C中调用Lua代码](/lua-extensions-applications/calling-lua-from-c)、[使用Lua与C语言混合编程](/lua-extensions-applications/mixed-programming)。

### C 扩展的模块入口

`luaopen_mylib` 是 `require("mylib")` 会调用的入口，必须创建模块表并返回 1 个值。返回 0 会让 `require` 得到 `true`，随后的 `mylib.sum` 就会报错。Linux 编译用 `gcc -shared -fPIC -o mylib.so mylib.c -I/usr/local/include`。

来源：[编写Lua C扩展](/lua-extensions-applications/writing-c-extensions)。

### 嵌入 C 程序

在 C 里嵌入 Lua 只需三个调用：`luaL_newstate`、`luaL_openlibs`、`luaL_dofile`。Lua 脚本常作配置文件，用户改设置不必重编译。嵌入式交叉编译时 Lua 的 Makefile 没有 `CROSS` 变量，用 `CC` 指定工具链，例如 `make generic CC=arm-none-eabi-gcc`。

来源：[嵌入式开发](/lua-extensions-applications/embedded-development)、[在嵌入式系统中使用Lua](/lua-extensions-applications/using-lua-embedded)。

### LuaJIT

LuaJIT 是带 JIT 编译器的 Lua 实现，把字节码编译成机器码，同时保持与 Lua 的高度兼容。兼容性上对齐 Lua 5.1 的绝大多数特性，5.2 和 5.3 只支持一部分，迁移前要先验证脚本。自带 GC，基于标记-清除增量执行，不使用引用计数。

来源：[LuaJIT的简介](/lua-extensions-applications/introduction-to-luajit)、[LuaJIT](/lua-extensions-applications/luajit)、[LuaJIT 的性能优化](/lua-extensions-applications/luajit-optimization)。

### FFI 库

FFI 让 Lua 脚本直接调用 C 函数、使用 C 数据结构，省掉写一套 C 插件的环节。主线三步：`ffi.cdef` 声明函数原型和结构体、`ffi.load` 加载共享库、直接调用。声明必须和真实签名一致，类型或内存出错会导致崩溃。

来源：[使用 LuaJIT 的 FFI 库](/lua-extensions-applications/ffi-library)。

### 脚本优化

变量尽量局部化；多个字符串拼接交给 `table.concat`；GC 用 `collectgarbage("setpause"/"setstepmul")` 按实际分配节奏调参；脚本可在打包前用 `luac` 预编译成字节码。性能关键的部分再交给 C 或 LuaJIT。

来源：[Lua代码的优化技巧](/lua-best-practices/optimization-techniques)、[部署与发布](/lua-best-practices/deployment)。
