# 常见坑与误区

全站的坑收拢成一份清单，按主题分组，每条给正解和出处。查无实据的标「来源未考」。

## 语法与类型

- 数组索引从 1 开始，不是 0。从 0 索引语言迁来最容易栽在这里。
- 不等号是 `~=` 不是 `!=`；`^` 和 `/` 恒返回浮点数（`10/5` 得 `2.0`），要整数结果必须用 `//`。
- `1 / 0` 不报错，结果是 `inf`；`0 / 0` 得 `nan`。只有整数 `//` 或 `%` 除数为零才抛错。要除零报错须显式判断。
- `//` 和 `%` 都向负无穷取整：`-1 // 2` 是 -1，`-1 % 2` 是 1。
- 字符串不可变，任何「修改」都产生新字符串；`string.len`/`string.sub` 按字节操作，中文截断会切坏字符，处理 UTF-8 用 `utf8` 库。
- Lua 没有内置 split，用 `string.gmatch` 加模式 `([^,]+)` 模拟。
- `pairs` 遍历哈希部分无序，不能当有序遍历用；`ipairs` 从 1 连续遍历，遇到 nil 就停；`#t` 对含空洞的稀疏表不给出确定结果，不要当「元素个数」用。
- 不加 `local` 就是全局变量，这是默认行为，也是要避免的习惯。

来源：[操作符和表达式](/basics/operators-and-expressions)、[常见问题与解决方案](/appendix/faq)、[字符串处理](/basics/string-handling)、[Lua标准库参考](/appendix/standard-library)。

## 表与元表

- `t[{}] = "value"` 之后 `t[{}]` 取回 nil：每次 `{}` 都创建新表，写入和读取用的是两个不同对象。表作键必须存进局部变量复用。
- `__index`/`__newindex` 元方法里直接读写原始表会无限递归，绕开要用 `rawget`/`rawset`。
- `pairs` 和 `#` 都不走 `__index` 链：`pairs(instance)` 看不到类上的方法，继承来的字段不计入 `#`。
- 一张表只有一张元表，第二次 `setmetatable` 是整体替换，先挂的链会静默丢失。
- `__newindex` 一旦定义就接管写入，普通赋值不再落在本表，要写本表得用 `rawset`。

来源：[常见的编码误区](/lua-best-practices/coding-mistakes)、[元表和元方法](/basics/metatables-and-metamethods)、[面向对象的实现](/advanced/oop-implementation)。

## 面向对象

- 点号冒号混用是最多发的错误：冒号定义的方法用点号调用，`self` 为 nil 报 `attempt to index a nil value`；点号定义冒号调用则参数错位。
- 忘了 `Class.__index = Class`：元表挂上了但查找在实例处就停，实例上找不到方法。
- 子类方法里调父类同名方法必须显式传 self（`Account.withdraw(self, amount)`），写成 `Account:withdraw(amount)` 会把 Account 表本身当 self。
- 构造函数里写死类名（`setmetatable({}, Dog)`）会让子类实例全挂到父类上，要写 `setmetatable({}, self)`。
- 方法作回调传递时 `self` 会丢，用闭包绑定对象或调用时手动补。

来源：[self 的作用](/advanced/self)、[面向对象的实现](/advanced/oop-implementation)。

## 协程

- `coroutine.wrap` 没有错误保护层，协程内错误直接抛给调用者；需要容错用 `create` + `resume`，并检查第一个返回值。
- 恢复已死亡的协程得到 `cannot resume dead coroutine`，不会崩溃但也不会执行；调度器要在协程死亡时把它移出任务列表。
- 阻塞调用（`io.read`、同步网络请求、`os.execute`）会卡住整个进程，其他协程毫无办法。
- 协程不是并行：同一 Lua 状态里任意时刻只有一个协程在跑，拉高计算吞吐与协程无关。
- 同一个 Lua 状态机不是线程安全的，多线程访问要外部加锁或每线程独立状态机。

来源：[协程的应用场景与最佳实践](/advanced/coroutine-best-practices)、[协程与线程的比较](/advanced/coroutines-vs-threads)。

## 模块

- `module` 函数自 Lua 5.2 起已移除，不要再写。
- 模块文件忘了 `return`，`require` 返回 `true`；C 扩展的 `luaopen_mylib` 返回 0 也是同样效果。
- 改了模块文件后不清 `package.loaded` 缓存，`require` 拿到的仍是旧版本；热加载就是清缓存再 `require`，但注意模块状态丢失和依赖未同步重载。

来源：[Lua的编码规范](/lua-best-practices/coding-standards)、[编写Lua C扩展](/lua-extensions-applications/writing-c-extensions)、[模块的定义与加载](/advanced/module-definition)、[热加载与动态更新](/design-and-implementation/hot-reloading)。

## 错误处理

- `io.open` 打开失败不抛错，返回 `nil, errmsg`，所以 `pcall(io.open, ...)` 捕获不到「文件不存在」，真正出错的是随后对 nil 调用 `read`。先检查返回值。
- `error` 默认在消息前附加位置信息；第二个参数传 0 去掉前缀，传 2 用调用者的位置。
- 访问表中不存在的键只得到 nil，不报错；只有对 nil 本身做索引才报错。

来源：[常见的编码误区](/lua-best-practices/coding-mistakes)、[错误处理机制](/advanced/error-handling-mechanism)、[常见问题与解决方案](/appendix/faq)。

## GC 与性能

- 「Lua 用引用计数做 GC」是误传，实际是标记-清除（增量/分代）；引用计数只是个别内部场合的思想借用。循环引用不会泄漏，标记-清除能整组回收。
- `collectgarbage` 没有 `"start"` 选项，重新启动用 `"restart"`；5.4 里 `setpause`/`setstepmul` 已过时，新代码用 `collectgarbage("incremental", ...)` 形式。
- 「用表打包参数比按位置传参快」是误区：表打包要额外分配一张表，通常更慢。表传参图的是命名参数和可读性。
- 常量折叠只对两个操作数都是常量的表达式生效，有变量参与就失效。
- 元方法调用有额外开销，频繁调用的热路径避免元方法；`debug` 库操作同样有开销，别拿它做生产性能分析。
- `jit.dump` 和 `-jp` 观察的是 JIT trace 编译与采样，不是 GC 分析器；Lua 5.4 标准解释器没有内置 GC 分析器。

来源：[引用计数与标记-清除算法](/design-and-implementation/reference-counting)、[垃圾回收的调优](/lua-best-practices/gc-tuning)、[Lua代码的优化技巧](/lua-best-practices/optimization-techniques)、[代码生成与优化](/design-and-implementation/code-generation)、[垃圾回收的优化策略](/design-and-implementation/gc-optimization)。

## 实现层误传

- 「Lua 协程切换用了 setjmp/longjmp」是误传：切换只交换栈指针和 `CallInfo`，`setjmp`/`longjmp` 只用于错误恢复，所以协程只能同线程协作切换。
- 「预编译字节码块可以跨平台分发」不成立：官方明确不保证 `luac -o` 产物跨机器可移植，要在目标平台重编译。
- Lua 脚本层没有条件编译，平台判断只能在运行时做（`package.config`，LuaJIT 下可用 `jit.os`）。
- 「Lua 内部值类型叫 TaggedValue」是讹传，5.4/5.5 源码里是 `TValue`。

来源：[协程的底层实现](/design-and-implementation/coroutines-implementation)、[字节码与虚拟机](/design-and-implementation/bytecode-and-vm)、[跨平台发布Lua应用](/lua-best-practices/cross-platform-deployment)、[Lua 5.5 源码解析](/design-and-implementation/lua55-source)。
