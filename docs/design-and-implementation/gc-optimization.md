# 垃圾回收的优化策略

Lua 的垃圾回收机制有一组优化策略，目标是提高性能、减少回收对程序运行的影响。

## 1. 回收模式与参数

Lua 5.4 标记-清除、增量/分代模式的定义及 `collectgarbage` 参数语义见[垃圾回收机制总览](/design-and-implementation/garbage-collection)。本页保留模式取舍、对象分配和测量方法，避免重复维护算法事实。

## 4. 优化对象分配

减少垃圾回收的压力可以从分配端入手。对象池（Object Pool）技术重复使用对象，避免频繁创建和销毁；高频操作中尽量少创建短期对象，年轻代的回收压力随之下降。

## 5. 调试与性能分析

内存曲线监控用 `collectgarbage("count")` 定期采样内存占用，对比回收前后的差值，可以了解对象的分配和回收情况：

```lua
local function mem()
    return string.format("%.1f KB", collectgarbage("count"))
end
print("回收前:", mem())
collectgarbage("collect")
print("回收后:", mem())
```

工具方面要分清边界：`luajit` 的 `-jdump`（`jit.dump` 库）用于观察 JIT trace 的编译过程，与垃圾回收本身无关；Lua 5.4 标准解释器没有内置的 GC 分析器，通常配合外部采样或日志来观察 GC 行为。根据监控结果优化代码中的内存管理策略，回收的开销就能继续压低。

## 6. 增量与分代模式的实测取舍

模式定义与参数见[垃圾回收机制总览](/design-and-implementation/garbage-collection)。增量模式可作为分配速率稳定负载的比较基线；短生命周期对象较多时，可把分代模式纳入对照。切换后用 `collectgarbage("count")` 和计时对比内存峰值与停顿，再按目标负载决定。

## 总结

增量收集、分代收集、参数调优、对象分配优化、性能分析，五条路都指向同一个目标：让回收更少地打断程序。先用 `collectgarbage("count")` 量化现状，再选模式和调参数。

## 参考资料

- [Lua 5.4 官方手册](https://www.lua.org/manual/5.4/manual.html#2.9)
- [Garbage_collection_(computer_science)](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))
- [Manual_memory_management](https://en.wikipedia.org/wiki/Manual_memory_management)

<!-- BACKLINKS-AUTO -->
## 相关页面

- [lua55-source](lua55-source.md)
- [pitfalls](/knowledge/pitfalls.md)
