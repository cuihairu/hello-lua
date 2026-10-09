# 错误处理

Lua 的错误处理围绕 `pcall`、`xpcall` 和 `error` 展开：先把可能出错的调用包起来，再对错误分类排查。本组两页：

- [错误处理机制](/advanced/error-handling-mechanism)：`pcall` 与 `xpcall` 的用法和差别、`error` 主动抛错、自定义错误处理函数。
- [错误类型与调试](/advanced/error-types-debugging)：语法、运行时、逻辑、类型四类错误，`debug` 库与常用调试手段。

## 结语

`pcall` 把错误变成一次带返回值的调用，`xpcall` 多给一次在错误现场加工信息的机会；分清错误类型，再用 `debug.traceback` 顺藤摸瓜，排查问题就靠这几样。
