# Lua相关资源与社区

本章整理学习和开发 Lua 时常用的官方网站、文档、工具和社区。遇到问题时，优先查阅官方资源，再考虑社区渠道。

#### 1. 官方资源

- **Lua 官方网站**：<https://www.lua.org/> —— 发布版本、新闻与官方文档的入口。
- **Lua 5.4 参考手册**：<https://www.lua.org/manual/5.4/> —— 语言与标准库的权威定义，本书所有 API 均以此为准。
- **官方源码**：<https://www.lua.org/ftp/>（各版本压缩包）与 <https://www.lua.org/source/>（在线浏览核心源码）。
- **Lua 5.4 源码 GitHub 镜像**：<https://github.com/lua/lua>。

#### 2. 文档与学习站点

- **lua-users wiki**：<http://lua-users.org/wiki/> —— 社区维护的知识库，包含大量教程与技巧（如 LuaCurses、SandBoxes、OptimisingUsingLocalVariables 等条目）。
- **Lua 5.4 中文手册（社区翻译）**：可在 GitHub 上搜索 “lua 5.4 中文手册” 获取社区维护的翻译版本，内容以官方手册为准。
- **在线运行环境**：Lua 官网提供在线演示（<https://www.lua.org/demo.html>），可快速验证小段代码。

#### 3. 工具与包管理

- **LuaRocks**：<https://luarocks.org/> —— Lua 的包管理器，安装第三方库：

  ```bash
  luarocks install luafilesystem
  ```

- **LuaJIT**：<https://luajit.org/> —— 高性能 Lua 实现，附带 FFI 库；源码在 <https://github.com/LuaJIT/LuaJIT>。
- **ZeroBrane Studio**：<https://studio.zerobrane.com/> —— 轻量级 Lua IDE，内置调试器。
- **EmmyLua / Lua 语言服务器**：为 VS Code 等 编辑器提供补全、跳转与静态检查。

#### 4. 社区与求助渠道

- **lua-l 邮件列表**：<https://www.lua.org/lua-l.html> —— 官方邮件列表，Lua 作者与核心维护者活跃于此，讨论语言设计、内部实现与版本演进问题。
- **GitHub**：搜索 `lua` 相关项目；第三方库的 issue 区是报告兼容性问题的首选渠道。
- **Stack Overflow**：使用 `lua` 标签提问，历史问答覆盖了绝大多数常见错误。
- **中文社区**：云风翻译的《Lua 5.3 参考手册》与相关博客、游戏开发社区（如知乎、掘金的 Lua 专题）是中文资料较集中的地方。

#### 5. 常用参考书

- 《Programming in Lua》（第 4 版，Lua 5.3）—— 官方作者撰写，第 1 版可在官网免费阅读：<https://www.lua.org/pil/>。
- 《Lua 程序设计（第 2 版）》—— 第 1 版的中译本，适合入门。
- 《Lua 设计与实现》/《Lua 源码剖析》类中文书籍 —— 面向想了解虚拟机与 GC 实现的读者。

### 总结

建议的学习路径：先通读官方手册的第 1~3 章（语言、标准库、C API），再用 LuaRocks 安装一两个库完成小项目，最后结合 `lua-users wiki` 与源码深入虚拟机与垃圾回收等内部机制。遇到具体问题时，官方手册与 lua-l 邮件列表的存档通常是最可靠的答案来源。
