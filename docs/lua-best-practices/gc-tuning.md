# 垃圾回收的调优

Lua 的垃圾回收是自动的，但参数可以调，写代码的方式也能影响它的压力。

## 1. 了解垃圾回收的工作原理

Lua 用的是基于标记-清除（mark-and-sweep）算法的垃圾回收机制。GC 有两个主要阶段：标记阶段遍历所有的活动对象，标记为“活跃”；清除阶段清理未被标记的对象，释放内存。

## 2. 手动控制垃圾回收

用 `collectgarbage` 函数控制：
- `collectgarbage("stop")`：停止垃圾回收。
- `collectgarbage("restart")`：重新启动垃圾回收（没有 `"start"` 这个选项）。
- `collectgarbage("collect")`：手动触发一次完整回收。
- `collectgarbage("setpause", value)`：设置垃圾回收的暂停阈值。`value` 是一个百分比，表示 GC 何时触发。
- `collectgarbage("setstepmul", value)`：设置垃圾回收的步进乘数。`value` 是一个乘数，用于调整 GC 的步进量。

示例：

```lua
-- 停止垃圾回收
collectgarbage("stop")

-- 执行内存密集型操作（doHeavyWork 为示意）
-- doHeavyWork()

-- 手动触发一次垃圾回收
collectgarbage("collect")

-- 重新启动垃圾回收
collectgarbage("restart")
```

## 3. 调整 GC 参数

两个关键参数：
- `setpause`：控制垃圾回收的触发频率。值越大，GC 触发频率越低（峰值内存更高）。
- `setstepmul`：控制垃圾回收的工作量。值越大，每个 GC 步骤完成的工作越多，回收越快，但单步占用 CPU 越多。

示例：

```lua
-- 设置垃圾回收的暂停阈值为 200
collectgarbage("setpause", 200)

-- 设置垃圾回收的步进乘数为 500
collectgarbage("setstepmul", 500)
```

## 4. 减少内存使用

对象能重用就不新建，减少分配；不再用的引用及时清掉，好让回收器收走。

示例：

```lua
local objectPool = {}

function getObject()
    if #objectPool > 0 then
        return table.remove(objectPool)
    else
        return {}  -- 创建新对象
    end
end

function releaseObject(obj)
    table.insert(objectPool, obj)
end
```

## 5. 优化数据结构

表结构选得合适，内存和 GC 压力都小。循环引用不用担心，标记-清除回收器能正确处理，不会泄漏；但对象之间互相引用着、且从根集可达时，它们就不会被回收。所以长期持有的容器（如缓存、注册表）要清掉不再需要的条目，或改用弱引用表，让不再使用的对象尽早被回收。

示例：

```lua
-- 用弱值表做缓存：条目没有被其他地方引用时可以被回收
local cache = setmetatable({}, { __mode = "v" })

do
    local a = {}
    local b = {a = a}
    a.b = b              -- 循环引用
    cache.a = a          -- 只有弱表持有 a
end

print("回收前条目数:", (function()
    local n = 0 for _ in pairs(cache) do n = n + 1 end return n
end)())                  -- 1
collectgarbage("collect")
print("回收后条目数:", (function()
    local n = 0 for _ in pairs(cache) do n = n + 1 end return n
end)())                  -- 0：循环引用的对象被整组回收
```

## 6. 监控和分析

调试时用 `collectgarbage("count")` 看当前内存用量：

示例：

```lua
print("Memory usage: " .. collectgarbage("count") .. " KB")
```

内存和 GC 的表现还可以用 LuaProfiler（`luaprofiler`）这类工具分析。

## 7. 避免频繁的垃圾回收

把多个小操作合并到一起做，降低 GC 触发频率；同时控制内存分配的节奏，别频繁分配又释放。

## 8. 合理使用 LuaJIT

LuaJIT 的垃圾回收更高效，还带 JIT 编译，GC 的表现和调优方式跟标准解释器不一样。

示例：

```lua
-- 在 LuaJIT 中，可以使用 FFI 来提高性能
local ffi = require("ffi")
ffi.cdef[[
    int add(int, int);
]]
local C = ffi.load("mylib")
print(C.add(1, 2))
```

## 总结

调参只改变回收的时机和节奏，减少分配才是根本：分配得少，GC 的压力自然小。
