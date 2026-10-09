# 官方文档要点

站内引用的官方与社区文档，按用途分组。每条给出链接和它覆盖的知识点。

## Lua 官方

- **官方网站** <https://www.lua.org/>：发布版本、新闻与官方文档。
- **Lua 5.4 参考手册** <https://www.lua.org/manual/5.4/>：语言与标准库的权威定义，站内所有 API 以此为准。覆盖数据类型、元表、标准库。
- **Lua 5.5 参考手册** <https://www.lua.org/manual/5.5/>：第 2 章（语言）与第 3 章（标准库）值得反复读；旧版手册（如 5.4）仍在原地址维护。覆盖 5.5 新增特性。
- **源码下载** <https://www.lua.org/ftp/>：各版本源码包，站内示例用 lua-5.4.8 与 lua-5.5.1。
- **源码在线浏览** <https://www.lua.org/source/>，GitHub 镜像 <https://github.com/lua/lua>。覆盖解释器实现、虚拟机、GC。
- **在线演示** <https://www.lua.org/demo.html>：快速验证小段代码。
- **Programming in Lua 第 1 版** <https://www.lua.org/pil/>：免费在线阅读。
- **lua-l 邮件列表** <https://www.lua.org/lua-l.html>：官方邮件列表，Lua 作者与核心维护者活跃，讨论语言设计、内部实现与版本演进。

## 社区与工具

- **lua-users wiki** <https://lua-users.org/wiki/>：社区维护的知识库，含 LuaImplementations（对比 Lua、LuaJIT、Ravi 等实现）、SandBoxes、OptimisingUsingLocalVariables 等条目。
- **LuaJIT** <https://luajit.org/>：高性能实现，附 FFI 库；扩展文档 <https://luajit.org/extensions.html> 说明 FFI、`bit` 库以及与 Lua 5.1/5.2/5.3 的差异；源码 <https://github.com/LuaJIT/LuaJIT>。
- **LuaRocks** <https://luarocks.org/>：Lua 的包管理器，用它安装第三方库。
- **ZeroBrane Studio** <https://studio.zerobrane.com/>：轻量级 Lua IDE，内置调试器。
- **LuaBinaries** <https://luabinaries.sourceforge.net/>：Windows 预编译包。
- **awesome-lua** <https://github.com/LewisJEllis/awesome-lua>：第三方库与工具清单。

## 第三方模块仓库

[常用 Lua 模块介绍](/advanced/common-modules)引用的仓库都在 GitHub：

- Penlight <https://github.com/lunarmodules/Penlight>
- LuaSocket <https://github.com/lunarmodules/luasocket>
- LuaFileSystem <https://github.com/lunarmodules/luafilesystem>
- Lua CJSON <https://github.com/mpx/lua-cjson>
- LuaSQL <https://github.com/lunarmodules/luasql>
- Copas <https://github.com/keplerproject/copas>
- LuaRocks <https://github.com/luarocks/luarocks>

## 来源

链接与用途取自站内的[相关资源与社区](/appendix/resources)、[扩展阅读与学习资源](/appendix/further-reading)、[环境搭建](/basics/setup)、[集成开发环境（IDE）推荐](/basics/ide-recommendations)、[常用 Lua 模块介绍](/advanced/common-modules)。
