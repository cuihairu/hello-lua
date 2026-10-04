### Lua的包管理

Lua 本身没有内建的包管理工具，模块的安装和管理靠 `package` 库，再加 LuaRocks 这类外部工具。

#### 1. Lua 的包管理机制

##### 1.1 `package` 库

`package` 库提供处理模块和包的基本功能，主要字段有四个：

- `package.path`：用于查找 Lua 脚本模块的路径。
- `package.cpath`：用于查找 C 扩展模块的路径。
- `package.loaded`：存储已加载模块的表。
- `package.preload`：用于预加载模块的表。

这些机制可以用来管理模块的加载和缓存。

##### 1.2 自定义模块路径

修改 `package.path` 和 `package.cpath` 就能添加自定义的模块查找路径。例如：

```lua
-- 添加 Lua 模块的自定义路径
package.path = package.path .. ";./my_modules/?.lua"

-- 添加 C 扩展模块的自定义路径
package.cpath = package.cpath .. ";./my_modules/?.so"
```

#### 2. Lua 的包管理工具

虽然 Lua 自带的包管理功能很基础，但有一些外部工具可以帮助管理 Lua 包和模块：

##### 2.1 LuaRocks

LuaRocks 是 Lua 的包管理器，用于安装和管理 Lua 模块，提供命令行工具。

- 安装 LuaRocks：
  - 在 Linux 系统上，可以通过包管理器安装（例如 `apt-get install luarocks`）。
  - 也可以从 [LuaRocks 官网](https://luarocks.org/) 下载并安装。

- 常用命令：
  - 安装包：`luarocks install <package-name>`
  - 卸载包：`luarocks uninstall <package-name>`
  - 列出已安装的包：`luarocks list`
  - 搜索包：`luarocks search <package-name>`

##### 2.2 使用 LuaRocks 安装模块示例

```bash
luarocks install penlight
```

这将从 LuaRocks 服务器下载并安装名为 `penlight` 的 Lua 模块。

##### 2.3 OpenResty

OpenResty 是一个基于 Nginx 的 Lua 平台，自带一套集成的 Lua 模块集合，支持在 Nginx 中使用 Lua 脚本，模块的安装和管理也有自己的一套机制。

##### 2.4 手动管理

除了 LuaRocks，也可以手动管理 Lua 模块：下载模块源代码，放到适当的目录，再在 `package.path` 或 `package.cpath` 中加上这些目录。比如从 GitHub 下载 Lua 模块，放进项目的 `libs` 目录，然后更新 `package.path`。

#### 3. Lua 的包管理最佳实践

##### 3.1 使用 LuaRocks

推荐用 LuaRocks 管理包，安装、卸载、版本和依赖它都能处理。

##### 3.2 组织模块

按目录结构组织模块，通常把所有模块放在一个 `modules` 或 `libs` 目录中，再按功能分组。

##### 3.3 更新和维护

定期更新安装的包，拿到新功能和 bug 修复。LuaRocks 可以直接检查和更新已装的模块。

##### 3.4 处理依赖

处理依赖时主要防版本冲突，LuaRocks 的依赖管理能处理大部分情况。

##### 3.5 版本控制

项目里的自定义模块用版本控制工具（如 Git）跟踪变化，需要时可以回滚。

#### 总结

日常的包管理就是四件事：模块从哪来（LuaRocks 或手动下载）、放在哪个目录、怎么更新、依赖冲突怎么处理。`package` 库负责查找和缓存，剩下的交给 LuaRocks。