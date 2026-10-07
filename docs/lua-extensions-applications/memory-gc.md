# 内存管理与垃圾回收

内存管理和垃圾回收决定了一个Lua程序运行时的内存行为：哪些对象活着，什么时候释放。这一篇讲机制，也讲怎么调。

## 1. 内存管理概述

Lua的内存管理系统负责分配和释放内存资源。它使用垃圾回收（Garbage Collection, GC）机制自动处理内存回收，减少内存泄漏的风险。

## 2. 垃圾回收机制

Lua使用基于标记-清除（Mark-and-Sweep）算法的垃圾回收机制。标记阶段从根对象出发，沿着引用链把所有可达的对象标记出来，这些就是程序当前活着的对象。清除阶段遍历内存中的全部对象，没被标记的就是不可达的，程序已经不再使用，清掉并释放它们占用的内存。

## 3. Lua的垃圾回收策略

回收分阶段进行，不一口气清完所有垃圾，GC对程序性能的影响因此小一些。回收的节奏可以通过`collectgarbage`函数控制，比如调整回收的频率，或者手动触发回收。

## 4. 使用`collectgarbage`进行垃圾回收控制

Lua提供了`collectgarbage`函数用于手动控制垃圾回收。常用的操作有：

- 调整垃圾回收参数：
  ```lua
  collectgarbage("setpause", 200)  -- 设置新的暂停阈值
  ```
  注意 `collectgarbage` 没有 `getpause`/`getstepmul` 这类读取参数的选项，只能设置；可用选项包括 `"collect"`、`"count"`、`"stop"`、`"restart"`、`"setpause"`、`"setstepmul"`、`"incremental"`、`"generational"`、`"step"`、`"isrunning"`。
- 手动触发垃圾回收：
  ```lua
  collectgarbage("collect")  -- 触发一次全垃圾回收
  ```
- 设置步长倍率：
  ```lua
  collectgarbage("setstepmul", 400)  -- 设置新的步长倍率
  ```

## 5. 垃圾回收的优化策略

根据程序的内存使用情况调整`setpause`和`setstepmul`，GC的压力会贴合实际的分配节奏。性能关键的代码路径里少创建短生命周期对象，避免频繁创建和销毁。弱引用表也有用，让表里的对象不被强引用攥住：

  ```lua
  local weakTable = setmetatable({}, {__mode = "v"})  -- 创建一个弱值表
  ```

## 6. 内存管理的最佳实践

不再需要的对象别攥着强引用，交给回收器处理，这是避免内存泄漏的基本功。对象创建能省则省，对象池这类重用手段可以减少频繁的创建销毁和内存碎片化。内存用了多少要心里有数，`collectgarbage("count")`和内存分析工具都能看。

## 7. LuaJIT的垃圾回收

如果使用LuaJIT，垃圾回收机制会有所不同。LuaJIT有自己的垃圾回收器，功能与Lua类似，但性能特性和优化策略可能不一样。LuaJIT的FFI库（Foreign Function Interface）允许直接调用C函数，也会影响内存管理的方式。
