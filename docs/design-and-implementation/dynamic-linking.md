在 Lua 中，动态链接和模块加载是模块系统的关键部分，让 Lua 程序能够在运行时加载和使用外部模块。

### 1. 动态链接与模块加载概述

动态链接是指在程序运行时动态地加载共享库或模块，而不是在编译时静态链接。模块加载是指将模块的代码载入到 Lua 环境中，使得程序可以使用这些模块提供的功能。

### 2. 模块路径

Lua 用 `package.path` 和 `package.cpath` 配置模块的查找路径：`package.path` 用于 Lua 脚本模块，Lua 在这些路径下查找 `.lua` 文件；`package.cpath` 用于 C 扩展模块，查找共享库（如 `.so`、`.dll`）。

示例：配置模块路径

```lua
-- 添加路径到 package.path
package.path = package.path .. ";./mymodules/?.lua"

-- 添加路径到 package.cpath
package.cpath = package.cpath .. ";./mymodules/?.so"
```

### 3. 模块的定义与返回

在 Lua 模块文件中，模块通常被定义为一个表（table），并在文件末尾返回。这使得其他 Lua 脚本可以通过 `require` 函数获取模块内容。

示例：定义和返回模块

```lua
-- mymodule.lua
local M = {}

function M.say_hello(name)
    return "Hello, " .. name
end

return M
```

### 4. 加载模块

#### 4.1 加载 Lua 模块

使用 `require` 函数可以加载 Lua 模块。`require` 会根据 `package.path` 查找并加载模块文件，执行后返回模块表。对上一节定义的 `mymodule`：

示例：加载 Lua 模块

```lua
local mymodule = require("mymodule")
print(mymodule.say_hello("World"))  -- 输出 Hello, World
```

#### 4.2 加载 C 扩展模块

C 扩展模块是用 C 语言编写的，并被编译成共享库。在 Lua 中使用 `require` 可以加载这些扩展模块。共享库的文件名通常以 `.so`（Linux）或 `.dll`（Windows）结尾。

示例：加载 C 扩展模块

```lua
local mylib = require("mylib")  -- 假设 mylib.so 或 mylib.dll 在 package.cpath 路径下
print(mylib.some_c_function())
```

### 5. 动态加载 C 扩展

在 Lua 中，可以使用 `package.loadlib` 函数动态加载 C 扩展。这个函数用于加载共享库，并调用指定的初始化函数。

示例：动态加载 C 扩展

```lua
-- 加载共享库，并调用初始化函数
local mylib = package.loadlib("mylib.so", "luaopen_mylib")

-- 执行初始化函数
if mylib then
    mylib()
end
```

### 6. 热加载与动态更新

#### 6.1 热加载

热加载允许在运行时更新模块而无需重新启动程序。通过监视模块文件的变化，可以重新加载模块，以便应用新的功能或修复问题。

示例：简单的热加载

```lua
local module = require("mymodule")

-- 监视文件变化并重新加载模块（伪代码）
while true do
    if file_changed("mymodule.lua") then
        package.loaded["mymodule"] = nil
        module = require("mymodule")
    end
end
```

#### 6.2 动态更新

动态更新是在运行时修改模块的内容，重新加载模块或直接修改模块表都可以。

示例：动态更新模块

```lua
local mymodule = require("mymodule")

-- 动态添加新功能
mymodule.new_feature = function()
    return "New feature added!"
end

print(mymodule.new_feature())
```

### 7. 错误处理

模块加载过程中可能会遇到错误，例如模块文件不存在、加载失败等。用错误处理机制捕捉这些错误。

示例：错误处理

```lua
local function safe_require(module_name)
    local status, module = pcall(require, module_name)
    if not status then
        print("Error loading module: " .. module_name)
        return nil
    end
    return module
end

local mymodule = safe_require("mymodule")
if mymodule then
    print(mymodule.say_hello("World"))  -- 输出 Hello, World
end
```

### 8. 总结

配置 `package.path`/`package.cpath`、用 `require` 加载 Lua 与 C 扩展模块、清除 `package.loaded` 实现热加载、`pcall` 兜底加载错误，这四件事覆盖了 Lua 动态链接和模块加载的日常工作。
