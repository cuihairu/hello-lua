# Lua代码的优化技巧

这些技巧覆盖全局变量、表、函数调用、字符串、GC 和 LuaJIT，每条给出原因和做法。

## 1. 减少全局变量的使用

全局变量访问慢，因为 Lua 要查全局环境表。用 `local` 声明变量；必须用全局变量的地方，把它缓存到局部变量里，减少查找。

示例:

```lua
-- 不推荐
function compute(value)
    result = value * 2
    return result
end

-- 推荐
function compute(value)
    local result = value * 2
    return result
end
```

## 2. 优化表的使用

能用数字索引就不用字符串索引。表尽量一次性用字面量构造好；循环里反复用的表复用，别每轮新建。键别用表或函数这类复杂类型。表嵌套层级能简则简，层级一多访问和处理的复杂性都跟着涨。`table.insert` 和 `table.remove` 在中间位置插入或删除都会移动后续元素，追加元素用 `t[#t + 1] = v` 或 `t[i] = v` 更快。

示例:

```lua
-- 不推荐：循环中每轮都新建一张表
local result = {}
for i = 1, 10000 do
    result[i] = { value = i }   -- 10000 张表，GC 压力大
end

-- 推荐：复用同一张表
local buf = {}
for i = 1, 10000 do
    buf[i] = i                  -- 数字索引、直接赋值，GC 压力小
end
```

说明：Lua 5.4 没有提供“预分配表大小”的 API（LuaJIT 提供 `table.new(narray, nhash)`，标准解释器中只能通过一次性字面量构造或直接按下标赋值来让表按需扩容）。

## 3. 慎用元表和元方法

元表和元方法能实现对象行为和操作符重载，但有额外开销。只在需要时用，频繁调用的操作里避免元方法。

示例:

```lua
-- 使用元表
local mt = { __add = function(a, b) return a.value + b.value end }
local a = { value = 10 }
local b = { value = 20 }
setmetatable(a, mt)
setmetatable(b, mt)
print(a + b)  -- 输出 30
```

## 4. 减少函数调用的开销

每次函数调用都耗栈空间和时间。短小的函数直接内联到调用点，调用层级能少则少。

示例:

```lua
-- 不推荐
function add(a, b)
    return a + b
end

function compute(value)
    return add(value, 10)
end

-- 推荐
function compute(value)
    return value + 10
end
```

## 5. 优化字符串操作

字符串不可变，每次修改都新建字符串。循环里的重复拼接换成 `table.concat` 批量拼。

示例:

```lua
-- 不推荐
local str = ""
for i = 1, 1000 do
    str = str .. i
end

-- 推荐
local t = {}
for i = 1, 1000 do
    t[i] = i
end
local str = table.concat(t)
```

## 6. 减少垃圾回收的影响

垃圾回收会带来性能波动。性能关键的代码里用 `collectgarbage` 手动控制；增量模式的触发频率和步进量用 `collectgarbage("incremental", pause, stepmul, stepsize)` 一次调好（`0` 表示保持不变），旧的 `setpause`/`setstepmul` 自 5.4 起已标记为过时。对象创建能省则省，能复用就复用，对象池这类技术可以管住对象的生命周期。

示例:

```lua
-- 增量模式：暂停值 200、步进倍率 100、步长不变
collectgarbage("incremental", 200, 100, 0)
```

## 7. 使用 LuaJIT

LuaJIT 带即时编译，执行速度比标准解释器快。把代码迁过去，调 C 函数用 FFI（Foreign Function Interface）库。

示例:

```lua
-- 使用 LuaJIT FFI
local ffi = require("ffi")
ffi.cdef[[
    int add(int, int);
]]
local C = ffi.load("mylib")
print(C.add(1, 2))
```

## 8. 避免长时间运行的代码块

长代码块会阻塞其他操作。把长任务拆成小块，耗时操作交给协程分片。

示例:

```lua
-- 使用协程
local co = coroutine.create(function()
    for i = 1, 10000 do
        -- 长时间操作
        coroutine.yield()
    end
end)

while coroutine.status(co) ~= "dead" do
    coroutine.resume(co)
end
```

## 9. 缓存函数结果

相同输入反复计算的函数，把结果缓存起来；调用越频繁越值得。

示例:

```lua
-- 使用缓存
local cache = {}
function expensiveFunction(x)
    if not cache[x] then
        -- 复杂计算
        cache[x] = x * x
    end
    return cache[x]
end
```

## 10. 合理使用表作为函数参数

按位置传参开销最小；用表打包参数反而要额外分配一张表，通常更慢，算不上优化。固定数量、顺序明确的参数直接按位置传。表打包只在参数数量可变、需要命名参数（类似关键字参数）或需要“配置对象”语义时用，图的是可读性和可扩展性，不是性能。

示例:

```lua
-- 推荐（性能优先）：位置参数，没有额外分配
function process(a, b, c)
    return a + b + c
end
process(1, 2, 3)

-- 也可用（可读性优先，但每次调用都会分配一张表）
function process_config(params)
    return params.a + params.b + params.c
end
process_config({a = 1, b = 2, c = 3})
```

## 11. 避免使用 `debug` 库

`debug` 库的操作有额外开销，生产环境里别拿它做性能分析。

示例:

```lua
-- 避免使用 debug 库
local function foo()
    -- 调试操作
end
```

## 总结

先测量再优化：用分析工具确认热点，改完再测，确认有收益。为微不足道的提升牺牲可读性，不划算。
