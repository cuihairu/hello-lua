### 模块的定义与加载

Lua 的模块就是一个返回表的 Lua 文件，表里放模块提供的函数和数据，加载用 `require`。

#### 1. 模块的定义

##### 1.1 定义一个模块

一个 Lua 模块通常是一个 Lua 文件：定义一个表，把函数和数据放进去，最后返回这个表。一个简单的示例：

```lua
-- math_utils.lua
local M = {}  -- 创建一个空表 M，用于存放模块的功能

-- 定义模块的功能
function M.add(a, b)
    return a + b
end

function M.subtract(a, b)
    return a - b
end

return M  -- 返回表 M
```

在这个示例中，`math_utils` 模块提供了两个功能：`add` 和 `subtract`。这些功能被封装在表 `M` 中，并且 `M` 被返回作为模块的接口。

##### 1.2 模块的命名

模块的文件名应该与模块名称一致。比如，模块 `math_utils` 的文件名应该是 `math_utils.lua`。Lua 的 `require` 函数会根据模块的名称查找对应的文件。

#### 2. 加载模块

##### 2.1 使用 `require` 加载模块

`require` 接收模块名，返回模块的表，之后就能通过这个表访问模块的功能：

```lua
local math_utils = require("math_utils")  -- 加载模块 math_utils

print(math_utils.add(3, 5))         -- 输出 8
print(math_utils.subtract(10, 4))   -- 输出 6
```

`require` 函数会自动查找模块文件，并执行该文件中的 Lua 代码。执行后，模块的表会被返回，并且可以通过表访问模块的功能。

##### 2.2 模块的查找路径

Lua 使用 `package.path` 和 `package.cpath` 来指定模块的查找路径：

- `package.path`：用于查找 Lua 脚本模块的路径，默认情况下，它包含了一些常见的路径模式，如 `./?.lua`，表示 Lua 会在当前目录下查找 `.lua` 文件。
- `package.cpath`：用于查找 C 扩展模块的路径，默认情况下，它包含了 C 扩展的路径模式，如 `./?.so`，表示 Lua 会在当前目录下查找 `.so` 文件（在 Unix-like 系统下）。

##### 2.3 配置模块路径

修改 `package.path` 和 `package.cpath` 就能添加自定义的模块查找路径。例如：

```lua
package.path = package.path .. ";./my_modules/?.lua"
package.cpath = package.cpath .. ";./my_modules/?.so"
```

这里，`?.lua` 和 `?.so` 是路径模式中的占位符，`?` 会被替换为模块的名称。这样，Lua 会在 `./my_modules/` 目录下查找模块文件。

##### 2.4 模块的缓存

`require` 会缓存已加载的模块，避免重复加载和执行，缓存存放在 `package.loaded` 表中。需要强制重新加载时，手动清掉对应的缓存条目即可。例如：

```lua
package.loaded["math_utils"] = nil
local math_utils = require("math_utils")  -- 重新加载模块
```

#### 总结

定义模块就是建一个表并返回；加载靠 `require`，它按 `package.path` 和 `package.cpath` 查找文件，并把结果缓存到 `package.loaded`。缓存清掉，下次 `require` 就会重新执行文件。