# 性能优化

Lua 程序的开销大头通常在全局变量查找、表的创建和字符串拼接上。本组两页：

- [Lua代码的优化技巧](/lua-best-practices/optimization-techniques)：全局变量、表、元表、函数调用、字符串、GC、LuaJIT 等十一条优化手法。
- [垃圾回收的调优](/lua-best-practices/gc-tuning)：`collectgarbage` 的参数与回收节奏控制。

## 结语

先测量再动手：用性能分析工具找到热点，改完再测一遍，确认优化真的有效。
