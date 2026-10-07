### 热加载与动态更新

热加载让程序在运行时更新模块而不用重启，适合需要频繁更新或修复代码的场景。Lua 的模块系统对此有直接支持。

---

#### 1. 热加载的概念

热加载指的是在程序运行时动态地加载、更新或卸载模块，而无需重启程序。开发者可以在应用程序运行时修改和调试：功能更新不停机，代码改动立即见效，开发和测试过程中重启应用程序的次数也随之减少。

---

#### 2. Lua中的热加载机制

Lua 的热加载围绕两个东西展开：`package.loaded` 表存储已加载模块的缓存，操作这个表就能实现模块的重新加载；具体做法是清除 `package.loaded` 中的旧模块，然后再次调用 `require`。

示例：重新加载模块

```lua
-- 模块文件：mymodule.lua
local M = {}

function M.say_hello(name)
    return "Hello, " .. name
end

return M
```

```lua
-- 主程序
local function reload_module(module_name)
    package.loaded[module_name] = nil
    return require(module_name)
end

local mymodule = require("mymodule")
print(mymodule.say_hello("World"))

-- 模拟文件更新，重新加载模块
mymodule = reload_module("mymodule")
print(mymodule.say_hello("Lua"))
```

`reload_module` 函数清除 `package.loaded` 中的旧模块并重新加载，模块就这样在不重启程序的情况下完成更新。

---

#### 3. 动态更新的应用场景

游戏开发里在游戏运行时加载新关卡或修复bug，Web应用在服务器运行时更新功能或修复问题，嵌入式系统更新固件或配置而无需重启设备，这些都是典型场景。

示例：Web应用中的动态更新

```lua
-- Lua web应用示例

local function handle_request()
    local module_name = "handler_module"
    local handler = require(module_name)
    -- 处理请求
    handler.process_request()
end

-- 模拟文件变化检测（file_changed 为伪代码示意，此处只表达流程）
local function watch_file_changes()
    while true do
        if file_changed("handler_module.lua") then
            package.loaded["handler_module"] = nil
            print("Module updated. Reloading...")
            require("handler_module")
        end
        -- 等待一段时间再检查
        os.execute("sleep 1")
    end
end

-- 启动文件监视线程
watch_file_changes()
```

这个例子监视 `handler_module.lua` 文件的变化，检测到变化就重新加载模块；处理请求时用的已经是最新版本的模块逻辑。

---

#### 4. 注意事项

三件事需要留心。性能上，频繁的热加载会影响性能，更新频率和应用性能要平衡。状态上，重新加载模块可能导致状态丢失，模块的状态在更新后要能正确恢复。依赖上，所有依赖模块在热加载时也要能正确加载，否则会因依赖问题出错。

---

### 总结

Lua 的热加载机制本体很小：清 `package.loaded`、重新 `require`。工程上的功夫花在状态恢复、依赖管理和更新频率控制上，这三件事做稳了，热加载才可靠。
