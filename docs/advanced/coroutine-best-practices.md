# 协程的应用场景与最佳实践

协程在 Lua 中被大量使用：标准库的 `string.gmatch`、`io.lines` 等迭代器本质上都是协程。下面先看典型的应用场景，再看实际开发中的准则。

## 1. 典型应用场景

### 1.1 把回调改写成顺序代码

这是协程最有价值的用途：把异步回调风格的逻辑放进协程，遇到耗时操作就 `yield`，数据到达后再 `resume`。使用者看到的是顺序执行的代码，而底层的事件循环仍在按普通回调方式运转。

### 1.2 生产者-消费者与惰性求值

协程可以按需生产数据，消费者处理一条就恢复一次，两端天然解耦：

```lua
local function producer(count)
    return coroutine.wrap(function()
        for i = 1, count do
            coroutine.yield("data-" .. i)   -- 需要时才生产
        end
    end)
end

local p = producer(3)
print(p())   -- 输出 data-1
print(p())   -- 输出 data-2
```

标准库中 `io.lines`、`string.gmatch` 就是这种模式的实现，它们不会一次性把所有数据读进内存，而是每次取用时才产生下一条。

### 1.3 分帧执行与协作式调度

游戏和交互式应用里，常把一个大任务拆成多次小执行，每次只处理固定数量的条目，避免卡顿：

```lua
local function chunkedTask(items, size)
    return coroutine.wrap(function()
        for i = 1, #items, size do
            local last = math.min(i + size - 1, #items)
            coroutine.yield(table.concat(items, ", ", i, last))
        end
    end)
end

local items = {"a", "b", "c", "d", "e"}
for chunk in chunkedTask(items, 2) do
    print("process:", chunk)
end
-- 输出
-- process:	a, b
-- process:	c, d
-- process:	e
```

每调用一次生成器函数就处理一批，主循环可以在批次之间插入渲染、输入处理等其他工作。

### 1.4 用协程实现通用迭代器

把遍历逻辑封装成协程，可以对外提供统一的 `for` 循环接口：

```lua
local function values(t)
    return coroutine.wrap(function()
        for _, v in ipairs(t) do
            coroutine.yield(v)
        end
    end)
end

for v in values({10, 20, 30}) do
    print(v)
end
-- 输出
-- 10
-- 20
-- 30
```

只要把内部的遍历方式换掉，调用方的代码完全不用改动，这就是协程提供的"惰性序列"抽象。

## 2. 最佳实践

### 2.1 始终检查 resume 的返回值

`coroutine.resume` 的第一个返回值表示协程是否正常运行，忽略它等于忽略协程里抛出的所有错误：

```lua
local co = coroutine.create(function()
    error("task failed", 0)
end)

local ok, err = coroutine.resume(co)
if not ok then
    print("task error:", err)   -- 输出 task error:	task failed
end
```

### 2.2 不要复用已死亡的协程

协程进入 `dead` 状态后无法恢复，恢复它只会得到 `cannot resume dead coroutine`。长期运行的调度器应当在协程死亡时将其移出任务列表，需要再次执行时重新 `create`。

### 2.3 避免在协程中做阻塞调用

`io.read`、同步网络请求、`os.execute` 等会卡住整个进程，协程的并发能力也就无从发挥。要么改用非阻塞接口，要么由框架在等待处挂起协程。

### 2.4 只在协程内部调用 yield

在普通函数里调用 `coroutine.yield` 会因为没有可挂起的协程而报错（`attempt to yield from outside a coroutine`）。如果工具函数可能在协程中被使用，可以用 `coroutine.isyieldable()` 判断。

### 2.5 用 close 管理资源

Lua 5.4 中，用 `coroutine.close` 结束协程或让协程函数自然返回时，to-be-closed 变量（`<close>`）都会触发 `__close` 元方法。把文件、连接等资源声明为 `<close>` 变量，可以保证协程无论以何种方式结束都能释放资源。

### 2.6 wrap 用于可信逻辑，create 用于需要容错的场景

`wrap` 的错误会直接抛给调用者，写法简洁但容易被忽略；`create` + `resume` 把错误变成返回值，更适合调度器等需要统一处理故障的代码。

## 结语

协程的典型场景有四类：把回调拍平成顺序代码、按需生产的惰性序列、分帧执行的批处理、可复用的迭代器。场景之外再记住四条：检查 resume 返回值、不复用死协程、不做阻塞调用、用 close 清理资源。
