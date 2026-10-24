# Lua相关资源与社区

这里记下我查 Lua 文档、工具和社区资料时常用的入口。核对语言与 API 行为时，我通常先回到官方手册，再看社区讨论。

## 1. 官方资源

Lua 官方网站 <https://www.lua.org/> 发布版本、新闻与官方文档。Lua 5.4 参考手册 <https://www.lua.org/manual/5.4/> 是语言与标准库的权威定义，本站涉及的 API 均以此为准。各版本源码压缩包在 <https://www.lua.org/ftp/>，也可以到 <https://www.lua.org/source/> 在线浏览核心源码；GitHub 镜像在 <https://github.com/lua/lua>。

## 2. 文档与社区站点

lua-users wiki（<http://lua-users.org/wiki/>，外部社区站点）是社区维护的知识库，其中有用户贡献的教程与技巧条目，LuaCurses、SandBoxes、OptimisingUsingLocalVariables 都在里面。Lua 5.4 中文手册可在 GitHub 搜索 “lua 5.4 中文手册” 找到社区翻译版，内容以官方手册为准。我临时验证小段代码时会用 Lua 官网的在线演示（<https://www.lua.org/demo.html>）。

## 3. 工具与包管理

- LuaRocks：<https://luarocks.org/> 是 Lua 的包管理器，用它安装第三方库：

  ```bash
  luarocks install luafilesystem
  ```

- LuaJIT：<https://luajit.org/>，高性能 Lua 实现，附带 FFI 库，源码在 <https://github.com/LuaJIT/LuaJIT>。
- ZeroBrane Studio：<https://studio.zerobrane.com/>，轻量级 Lua IDE，内置调试器。
- EmmyLua / Lua 语言服务器：为 VS Code 等编辑器提供补全、跳转与静态检查。

## 4. 社区与求助渠道

- lua-l 邮件列表：<https://www.lua.org/lua-l.html>，官方邮件列表，Lua 作者与核心维护者活跃于此，讨论语言设计、内部实现与版本演进问题。
- GitHub：搜索 `lua` 相关项目；第三方库的 issue 区是报告兼容性问题的首选渠道。
- Stack Overflow：使用 `lua` 标签提问，历史问答覆盖了绝大多数常见错误。
- 中文社区：云风翻译的《Lua 5.3 参考手册》与相关博客、游戏开发社区（如知乎、掘金的 Lua 专题）是中文资料较集中的地方。

## 5. 常用参考书

- 《Programming in Lua》（第 4 版，Lua 5.3），官方作者撰写，第 1 版可在官网免费阅读：<https://www.lua.org/pil/>。
- 《Lua 程序设计（第 2 版）》，第 1 版的中译本。
- 《Lua 设计与实现》/《Lua 源码剖析》类中文书籍，涉及虚拟机与 GC 实现。

## 我的查阅顺序

我通常先查官方手册的语言、标准库和 C API 部分，再用 LuaRocks 装库做小项目，之后结合 `lua-users wiki` 与源码看虚拟机、垃圾回收等内部机制。遇到具体问题时，我会用官方手册和 lua-l 邮件列表存档核对。源码阅读顺序与论文记录见[延伸阅读与参考资料](/zh/appendix/further-reading)。

## 参考资料

- [Lua 官方文档索引](https://www.lua.org/docs.html)
- [Lua 下载页](https://www.lua.org/download.html)
- [LuaRocks 包管理器首页](https://luarocks.org/)

<!-- BACKLINKS-AUTO -->
## 相关页面

- [further-reading](further-reading.md)
- [glossary](/zh/glossary.md)
- [README](/zh/knowledge/README.md)
- [books](/zh/knowledge/books.md)
- [official-docs](/zh/knowledge/official-docs.md)
