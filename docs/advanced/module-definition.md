### 模块的定义与加载

在 Lua 中，模块是一种组织代码的机制，使得功能可以被封装和重用。Lua 使用表（table）来实现模块，并通过 `require` 函数来加载和使用这些模块。下面详细介绍如何定义和加载 Lua 模块。

#### 1. 模块的定义

**1.1 定义一个模块**

一个 Lua 模块通常是一个 Lua 文件，它定义了一个表，并将这个表返回。这个表包含了模块提供的功能（例如函数和数据）。以下是一个简单的模块示例：

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

**1.2 模块的命名**

模块的文件名应该与模块名称一致。比如，模块 `math_utils` 的文件名应该是 `math_utils.lua`。Lua 的 `require` 函数会根据模块的名称查找对应的文件。

#### 2. 加载模块

**2.1 使用 `require` 加载模块**

要使用定义好的模块，你需要使用 Lua 的 `require` 函数加载它。`require` 会返回模块的表，从而可以访问模块提供的功能。示例如下：

```lua
local math_utils = require("math_utils")  -- 加载模块 math_utils

print(math_utils.add(3, 5))         -- 输出 8
print(math_utils.subtract(10, 4))   -- 输出 6
```

`require` 函数会自动查找模块文件，并执行该文件中的 Lua 代码。执行后，模块的表会被返回，并且可以通过表访问模块的功能。

**2.2 模块的查找路径**

Lua 使用 `package.path` 和 `package.cpath` 来指定模块的查找路径：

- `package.path`：用于查找 Lua 脚本模块的路径，默认情况下，它包含了一些常见的路径模式，如 `./?.lua`，表示 Lua 会在当前目录下查找 `.lua` 文件。
- `package.cpath`：用于查找 C 扩展模块的路径，默认情况下，它包含了 C 扩展的路径模式，如 `./?.so`，表示 Lua 会在当前目录下查找 `.so` 文件（在 Unix-like 系统下）。

**2.3 配置模块路径**

你可以通过修改 `package.path` 和 `package.cpath` 来添加自定义的模块查找路径。例如：

```lua
package.path = package.path .. ";./my_modules/?.lua"
package.cpath = package.cpath .. ";./my_modules/?.so"
```

这里，`?.lua` 和 `?.so` 是路径模式中的占位符，`?` 会被替换为模块的名称。这样，Lua 会在 `./my_modules/` 目录下查找模块文件。

**2.4 模块的缓存**

`require` 函数会缓存已加载的模块，以避免重复加载和执行。模块会被存储在 `package.loaded` 表中。如果你需要强制重新加载模块，可以手动清除缓存。例如：

```lua
package.loaded["math_utils"] = nil
local math_utils = require("math_utils")  -- 重新加载模块
```

#### 总结

通过定义和加载模块，你可以有效地组织和重用 Lua 代码。模块的定义涉及创建一个表并将其返回，而模块的加载通过 `require` 函数来实现。配置模块路径和管理模块缓存是进一步优化模块加载过程的关键。