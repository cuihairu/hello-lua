垃圾回收（GC）调优是优化 Lua 程序性能的重要部分。Lua 的垃圾回收机制是自动的，但通过合理的配置和管理，可以减少 GC 对程序性能的影响。以下是一些垃圾回收调优的方法和技巧：

### 1. **了解垃圾回收的工作原理**

Lua 使用的是一种基于标记-清除（mark-and-sweep）算法的垃圾回收机制。GC 有两个主要阶段：
- **标记阶段**：遍历所有的活动对象，标记为“活跃”。
- **清除阶段**：清理未被标记的对象，释放内存。

### 2. **手动控制垃圾回收**

**使用 `collectgarbage` 函数**：
- `collectgarbage("stop")`：停止垃圾回收。
- `collectgarbage("restart")`：重新启动垃圾回收（没有 `"start"` 这个选项）。
- `collectgarbage("collect")`：手动触发一次完整回收。
- `collectgarbage("setpause", value)`：设置垃圾回收的暂停阈值。`value` 是一个百分比，表示 GC 何时触发。
- `collectgarbage("setstepmul", value)`：设置垃圾回收的步进乘数。`value` 是一个乘数，用于调整 GC 的步进量。

**示例**：

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

### 3. **调整 GC 参数**

**调整 GC 阈值**：
- `setpause`：控制垃圾回收的触发频率。值越大，GC 触发频率越低（峰值内存更高）。
- `setstepmul`：控制垃圾回收的工作量。值越大，每个 GC 步骤完成的工作越多，回收越快，但单步占用 CPU 越多。

**示例**：

```lua
-- 设置垃圾回收的暂停阈值为 200
collectgarbage("setpause", 200)

-- 设置垃圾回收的步进乘数为 500
collectgarbage("setstepmul", 500)
```

### 4. **减少内存使用**

**技巧**：
- **重用对象**：避免频繁创建和销毁对象，尽量重用已分配的对象。
- **清理不再需要的对象**：及时释放不再需要的对象引用，以便垃圾回收能够回收它们。

**示例**：

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

### 5. **优化数据结构**

**技巧**：
- **使用高效的数据结构**：选择适合的表结构来减少内存使用和 GC 压力。
- **及时解除不再需要的引用**：Lua 的标记-清除回收器可以正确处理循环引用，循环引用本身不会造成内存泄漏；但只要对象之间还互相引用着、且从根集可达，它们就不会被回收。因此长期持有的容器（如缓存、注册表）应清掉不再需要的条目，或改用弱引用表，让不再使用的对象能尽早被回收。

**示例**：

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

### 6. **监控和分析**

**使用 GC 日志**：
- 在调试过程中，可以使用 `collectgarbage("count")` 查看当前 Lua 程序的内存使用情况。

**示例**：

```lua
print("Memory usage: " .. collectgarbage("count") .. " KB")
```

**性能分析工具**：
- 使用 Lua 的性能分析工具如 LuaProfiler 或 `luaprofiler` 来分析内存使用和 GC 性能。

### 7. **避免频繁的垃圾回收**

**技巧**：
- **合并操作**：将多个操作合并到一起，减少 GC 的触发频率。
- **调整内存使用**：尽量控制内存分配的频率，避免频繁的内存分配和释放。

### 8. **合理使用 LuaJIT**

**LuaJIT** 提供了更高效的垃圾回收和 JIT 编译功能。在使用 LuaJIT 时，垃圾回收性能和调优可能会有所不同。

**示例**：

```lua
-- 在 LuaJIT 中，可以使用 FFI 来提高性能
local ffi = require("ffi")
ffi.cdef[[
    int add(int, int);
]]
local C = ffi.load("mylib")
print(C.add(1, 2))
```

### 总结

垃圾回收调优是提高 Lua 程序性能的关键步骤。通过了解和调整 GC 参数、优化内存使用和数据结构、使用性能分析工具，可以有效地减少垃圾回收对程序性能的影响。合理的调优策略可以帮助你在保证程序稳定性的同时，获得更好的性能表现。