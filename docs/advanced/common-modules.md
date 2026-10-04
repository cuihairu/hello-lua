### 常用 Lua 模块介绍

Lua 生态里有不少常用模块，覆盖数据结构、网络、文件、JSON 等场景。这一页挑八个最常见的，附上安装命令和文档入口。

#### 1. Penlight

Penlight 是一个功能丰富的工具库，补上标准库缺的部分：链表、队列、堆栈等数据结构，增强的文件读写，扩展的字符串操作，还有集合、映射这类常用工具。安装：`luarocks install penlight`，文档见 [Penlight GitHub 页面](https://github.com/lunarmodules/Penlight)。

#### 2. LuaSocket

LuaSocket 负责网络编程，支持 TCP、UDP、HTTP、SMTP 等协议，数据包的收发和 URL 解析都在里面，网络应用开发基本绕不开它。安装：`luarocks install luasocket`，文档见 [LuaSocket GitHub 页面](https://github.com/lunarmodules/luasocket)。

#### 3. LuaFileSystem

LuaFileSystem 补齐文件系统操作：创建、删除、移动、重命名文件和目录，读取文件大小和修改时间，递归遍历目录及其内容。安装：`luarocks install luafilesystem`，文档见 [LuaFileSystem GitHub 页面](https://github.com/lunarmodules/luafilesystem)。

#### 4. Lua CJSON

Lua CJSON 是一个 JSON 编解码库，用 C 语言实现，解析和序列化速度快，Lua 表与 JSON 字符串互转就靠它。安装：`luarocks install lua-cjson`，文档见 [Lua CJSON GitHub 页面](https://github.com/mpx/lua-cjson)。

#### 5. Luarocks

Luarocks 本身也是一个 Lua 模块，但更常用作管理其他 Lua 模块的工具：命令行安装模块、自动处理依赖关系、管理模块的版本和更新。可以从 [Luarocks 官网](https://luarocks.org/) 下载并安装，仓库在 [Luarocks GitHub 页面](https://github.com/luarocks/luarocks)。

#### 6. LuaJIT

LuaJIT 是 Lua 的一个高性能实现，兼容 Lua 5.1，带 JIT 编译器，执行速度显著提升；FFI 库还能直接调用 C 函数、访问 C 数据结构。安装：`luarocks install luajit` 或从 [LuaJIT 官网](https://luajit.org/) 下载，文档见 [LuaJIT Wiki](https://luajit.org/)。

#### 7. Luasql

Luasql 是数据库访问库，支持 SQLite、MySQL、PostgreSQL 等多种数据库，建立连接、执行查询和更新、处理结果集的接口都齐。驱动按需安装，比如 SQLite3 用 `luarocks install luasql-sqlite3`，文档见 [LuaSQL GitHub 页面](https://github.com/lunarmodules/luasql)。

#### 8. Copas

Copas 是协程驱动的异步网络库，支持 TCP 和 HTTP 服务器，非阻塞 I/O 建立在 Lua 协程之上，适合需要高并发的网络应用。安装：`luarocks install copas`，文档见 [Copas GitHub 页面](https://github.com/keplerproject/copas)。

#### 总结

这八个模块覆盖了数据结构、网络、文件系统、JSON、数据库和运行时。都能通过 LuaRocks 安装，平时按需取用即可。
