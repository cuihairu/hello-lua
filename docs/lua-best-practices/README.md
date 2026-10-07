# Lua的最佳实践

Lua 代码里的问题大多出在全局变量、表的使用和错误处理上。下面按代码风格、性能、测试调试、部署四个方面整理对应的做法。

## 1. 代码风格与规范

**1.1 编码规范**

同一份代码保持一种风格，跟团队的编码标准走。命名要有意义，`get_user_name` 胜过 `g_un`。缩进统一用 2 个或 4 个空格。操作符和括号周围留空格，写 `a + b` 不写 `a+b`。

**1.2 Lua 风格指南**

单一对象用一个表收拢，而不是摊成一堆变量；需要类和继承时，用表的 `__index` 元方法模拟。变量和函数尽量都加 `local`，全局变量容易撞名，出了问题也难查。代码按模块组织，用 `require` 加载，别在全局作用域里定义函数和变量。

示例:

```lua
-- 不推荐
x = 10
function foo()
    return x
end

-- 推荐
local x = 10
local function foo()
    return x
end
```

## 2. 性能优化

**2.1 减少表的创建**

避免在循环中重复创建表或其他数据结构。尽量一次性构造表的内容，或复用已存在的表（Lua 5.4 标准解释器没有预分配表大小的 API）。

**2.2 使用局部变量**

局部变量比全局变量访问快，循环和函数里优先用 `local`。

示例:

```lua
-- 不推荐
global_var = 0
for i = 1, 1000 do
    global_var = global_var + i
end

-- 推荐
local local_var = 0
for i = 1, 1000 do
    local_var = local_var + i
end
```

**2.3 避免过度的表嵌套**

深层嵌套的表会影响访问速度，数据结构保持在合理的深度内。

**2.4 使用元表优化**

方法挂在元表上，所有对象共享同一份，不要每个对象各存一份。

示例:

```lua
-- 不推荐
local obj1 = { value = 1 }
local obj2 = { value = 2 }
function obj1:increment() self.value = self.value + 1 end
function obj2:increment() self.value = self.value + 1 end

-- 推荐
local mt = {
    increment = function(self) self.value = self.value + 1 end
}

local obj1 = setmetatable({ value = 1 }, mt)
local obj2 = setmetatable({ value = 2 }, mt)
```

## 3. 测试与调试

**3.1 单元测试**

用 `busted` 或 `luaunit` 这类框架写测试，让代码在各种输入下都过一遍。

**3.2 调试工具**

排查问题用标准 `debug` 库（`debug.traceback`、`debug.getinfo`），或者 ZeroBrane Studio 这类带调试器的 IDE；`luasocket` 是网络库，不是调试工具。

**3.3 错误处理**

用 `pcall` 和 `xpcall` 捕获运行时错误，错误信息要写得能定位到出事的位置。

示例:

```lua
local function safe_divide(a, b)
    if b == 0 then
        print("Error: division by zero")
        return nil
    end
    -- a / b 在 b 为 0 时不会报错，除零需要显式判断；
    -- pcall 用于捕获参数类型不对等运行时错误
    local status, result = pcall(function() return a / b end)
    if not status then
        print("Error: " .. tostring(result))
        return nil
    end
    return result
end

print(safe_divide(10, 2))   -- 5.0
print(safe_divide(10, 0))   -- Error: division by zero
print(safe_divide("x", 2))  -- Error: ...（pcall 捕获的算术错误）
```

## 4. 部署与发布

**4.1 跨平台支持**

尽量只用标准库，避开平台特有的功能，代码才好跨平台运行。

**4.2 性能监控**

生产环境里用 `LuaProfiler` 这类工具跟踪脚本运行，找性能瓶颈。

**4.3 代码审查**

发布前过一遍代码审查，能提前发现错误和不一致。
