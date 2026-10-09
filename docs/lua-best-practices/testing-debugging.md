# 测试与调试

测试和调试回答两类问题：代码对不对，慢在哪里。本组两页：

- [Lua的单元测试框架](/lua-best-practices/unit-testing)：LuaUnit、Busted、Lunatest 与不引框架的最简做法。
- [调试工具与技术](/lua-best-practices/debugging-tools)：ZeroBrane Studio、luadebug、MobDebug、日志与性能分析器。

## 结语

临时看个变量，`print` 就够；要断点和单步，上 ZeroBrane Studio 或 luadebug；查性能瓶颈，用 LuaJIT 分析器或 LuaProfiler。
