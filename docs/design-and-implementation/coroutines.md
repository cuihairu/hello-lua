# 协程的实现

协程（coroutines）是一种轻量级的线程，允许在函数之间暂停和恢复执行，从而实现非阻塞的异步编程。它的实现涉及调度、上下文切换和栈管理。

## 阅读边界

这页收录 Lua 协程实现相关笔记。协作式执行、`create`/`resume`/`yield` 的使用方式与状态记录见[进阶协程笔记](/advanced/coroutines)。

实现方向继续看[协程的设计理念](./coroutines-design.md)、[协程的底层实现](./coroutines-implementation.md)和[协程的调度与切换](./coroutines-scheduling.md)。

## 状态与生命周期

状态查询和生命周期用法见[协程状态与生命周期笔记](/advanced/coroutine-lifecycle)。实现层的状态保存、栈管理与切换细节分别见上述实现专题页。

## 调度与切换

`resume`/`yield` 的程序员控制模型见[进阶协程笔记](/advanced/coroutines)。本组的调度策略和上下文切换实现见[协程的调度与切换](./coroutines-scheduling.md)。

## 应用与实践

我在任务调度里用协程的经验见[协程应用场景与最佳实践](/advanced/coroutine-best-practices)；这里集中放实现相关入口。

## 参考资料

- [Lua 5.4 官方手册](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [Lua 官方源码仓 github.com/lua/lua](https://github.com/lua/lua)

## 相关页面

- [coroutines-design](coroutines-design.md)
