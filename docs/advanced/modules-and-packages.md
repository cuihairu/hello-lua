# 模块与包

模块和包解决的是代码的组织与重用。Lua 的模块是返回表的文件，包管理则围绕标准库的 `package` 库和第三方工具展开。

## 1. 模块的定义与加载

### 1.1 模块的定义

模块是一个返回表的 Lua 文件，表里是模块的功能和数据。例如：

```lua
-- math_utils.lua
local M = {}

function M.add(a, b)
    return a + b
end

function M.subtract(a, b)
    return a - b
end

return M
```

在这个示例中，`math_utils` 模块定义了两个函数：`add` 和 `subtract`，并将它们包含在一个表 `M` 中。最后，模块将这个表返回。

### 1.2 加载模块

用 `require` 函数加载模块。它根据模块名查找文件，执行后返回模块的表。例如：

```lua
local math_utils = require("math_utils")

print(math_utils.add(1, 2))        -- 输出 3
print(math_utils.subtract(5, 3))   -- 输出 2
```

`require` 会自动查找模块文件，并且缓存已加载的模块，以避免重复加载。

## 2. Lua的包管理

### 2.1 Lua的包管理机制

标准库的 `package` 库负责模块的查找与缓存，主要字段有四个：

- `package.path`：一个字符串，用于指定 Lua 查找模块的路径。
- `package.cpath`：一个字符串，用于指定 Lua 查找 C 扩展模块的路径。
- `package.loaded`：一个表，包含了所有已加载的模块。
- `package.preload`：一个表，允许你预加载模块，以提供自定义的加载行为。

### 2.2 配置模块路径

修改 `package.path` 和 `package.cpath` 就能配置 Lua 查找模块的路径。例如：

```lua
package.path = package.path .. ";./my_modules/?.lua"
package.cpath = package.cpath .. ";./my_modules/?.so"
```

`?.lua` 和 `?.so` 是 Lua 的路径模式，其中 `?` 会被替换为模块的名称。这使得 Lua 可以在 `./my_modules/` 目录下查找模块。

### 2.3 常用Lua模块

标准库自带的常用模块有 `table`、`string`、`math`、`io` 和 `os`：

- `table`：表操作，如排序、插入、删除。
- `string`：字符串操作，如模式匹配、字符串分割。
- `math`：数学函数，如三角函数、随机数生成。
- `io`：文件和输入输出。
- `os`：操作系统相关的函数，如环境变量、时间处理。

## 3. 模块的设计与管理

### 3.1 模块的设计原则

相关的功能和数据收进一个模块，隐藏内部实现；接口只暴露必要的部分；一个模块只承担一个职责；实现别和特定应用耦合太紧，别处才能复用。

### 3.2 模块的依赖管理

模块依赖的其他模块要在代码里显式 `require`，不要留隐式依赖。模块之间耦合越松，越容易独立开发和测试。版本变化交给版本控制工具跟踪。

### 3.3 热加载与动态更新

有些场景需要在运行时更新模块。做法上就是清掉 `package.loaded` 里的缓存条目，让 `require` 重新执行文件，应用不用重启。

模块的加载和缓存都由 `require` 一手包办，平时需要干预的地方通常只有路径配置和缓存清理。
