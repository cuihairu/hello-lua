# 模块与包

模块和包解决的是代码的组织与重用。Lua 的模块是返回表的文件，包管理围绕标准库的 `package` 库和第三方工具展开。本组三页：

- [模块的定义与加载](/advanced/module-definition)：模块怎么写、`require` 怎么查路径和缓存。
- [Lua的包管理](/advanced/package-management)：`package` 库四个字段、LuaRocks 与依赖处理。
- [常用Lua模块介绍](/advanced/common-modules)：Penlight、LuaSocket、LuaFileSystem 等第三方库。

标准库自带的 `table`、`string`、`math`、`io`、`os` 五个模块在基础篇各有专页；运行时更新模块的做法见[热加载与动态更新](/design-and-implementation/hot-reloading)。

## 结语

模块的加载和缓存都由 `require` 一手包办，平时需要干预的地方通常只有路径配置和缓存清理。
