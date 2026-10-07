# 性能优化

Lua 程序的开销大头通常在全局变量查找、表的创建和字符串拼接上，下面按条列出对应的优化办法。

## 1. 减少全局变量的使用

全局变量访问慢，因为 Lua 要查全局环境表；局部变量快。做法是用 `local` 声明变量，热代码路径里尤其别碰全局变量。

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

表是 Lua 的主要数据结构，值得花心思。键尽量用字符串或数字，别用表或函数这类复杂类型。表尽量一次性构造好；确有需要就复用旧表，别反复新建。`table.insert` 和 `table.remove` 在中间位置插入或删除都会移动后续元素，`t[#t + 1] = v` 或 `t[i] = v` 更快。

示例:

```lua
-- 不推荐：反复调用 table.insert，函数调用开销大于直接赋值
local t = {}
for i = 1, 10000 do
    table.insert(t, i)
end

-- 推荐：直接按下标赋值
local t2 = {}
for i = 1, 10000 do
    t2[i] = i
end
```

说明：Lua 5.4 没有提供“预分配表大小”的 API（LuaJIT 提供 `table.new(narray, nhash)`，标准解释器中只能通过一次性字面量构造或直接按下标赋值来让表按需扩容）。

## 3. 避免不必要的垃圾回收

频繁创建销毁对象时，垃圾回收会造成性能抖动。可以调整回收的频率和阈值，或用 `collectgarbage` 手动触发、调参。

示例:

```lua
-- 调整垃圾回收参数
collectgarbage("setpause", 100)
collectgarbage("setstepmul", 500)
```

## 4. 减少函数调用开销

函数调用有堆栈操作和环境查找的开销。热路径里减少调用层级，短小的函数直接内联到调用点。

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

## 5. 使用元表和元方法

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

## 6. 优化字符串操作

字符串不可变，每次修改都新建字符串。循环拼接改用表收集，最后 `table.concat` 一次拼完。

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

## 7. 使用 LuaJIT

LuaJIT 是 Lua 的高性能实现，带即时编译（JIT）。把代码迁到 LuaJIT 环境里跑；调 C 函数用它的 FFI（Foreign Function Interface）库。

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

长时间运行的代码块会阻塞其他任务。把长任务拆成小块，或用协程分片处理。

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

## 总结

先测量再动手：用性能分析工具找到热点，改完再测一遍，确认优化真的有效。
