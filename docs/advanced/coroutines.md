# 协程与并发编程

协程（coroutine）是 Lua 提供的一种协作式多任务机制。与操作系统线程不同，协程之间的切换完全由程序显式控制：一个协程只有在调用 `coroutine.yield` 时才会主动让出执行权，其余时候会一直运行到结束。借助这一特性，Lua 可以用非常低的成本实现迭代器、生产者-消费者模型、协作式调度器以及异步 I/O 的封装。

## 1. 并发与并行的区别

讨论协程之前，先区分两个容易混淆的概念：

- **并行（parallelism）**：多个任务在同一时刻真正地同时执行，需要多核或多处理器的硬件支持。
- **并发（concurrency）**：多个任务在一段时间内交替推进，宏观上看起来"同时"进行，微观上可能只有一个在执行。

Lua 的协程属于并发而不是并行。在同一个 Lua 状态机中，任意时刻最多只有一个协程在运行，其余协程都处于挂起状态。由于不存在真正的并行执行，协程之间访问共享数据时不会产生竞态条件，通常也不需要加锁，这是协程相对线程的一大优势。

## 2. 用协程实现多任务交替

下面的例子创建了两个协程，由主程序交替恢复它们，模拟两个任务"并发"推进的效果：

```lua
local function task(name)
    for i = 1, 3 do
        print(name, "step", i)
        coroutine.yield()   -- 让出执行权，等待下一次 resume
    end
end

local coA = coroutine.create(task)
local coB = coroutine.create(task)

for i = 1, 3 do
    coroutine.resume(coA, "A")
    coroutine.resume(coB, "B")
end
-- 输出
-- A	step	1
-- B	step	1
-- A	step	2
-- B	step	2
-- A	step	3
-- B	step	3
```

可以看到，两个任务的执行是严格交替进行的：每次 `resume` 恢复一个任务，任务运行到 `yield` 处挂起，把控制权交还给主程序，主程序再决定接下来运行哪个任务。整个切换过程由代码显式控制，输出结果是确定的。

## 3. 生产者与消费者

生产者-消费者是协程最经典的应用之一。生产者在协程中生成数据，每生成一条就 `yield` 出去；消费者则通过 `resume` 索要数据：

```lua
local producer = coroutine.create(function()
    for i = 1, 3 do
        coroutine.yield("item-" .. i)   -- 生产一条数据并交给消费者
    end
end)

for i = 1, 3 do
    local ok, item = coroutine.resume(producer)
    print("consumer got", item)
end
-- 输出
-- consumer got	item-1
-- consumer got	item-2
-- consumer got	item-3
```

与使用缓冲队列的传统写法相比，协程版本的代码是顺序书写的，不需要额外的同步机制，逻辑一目了然。

## 4. 简单的协作式调度器

把多个协程放进一个列表里轮流恢复，就得到了一个最简单的协作式调度器。协程在自己内部决定何时让出，调度器只负责"谁能继续运行"：

```lua
local function scheduler(tasks)
    while #tasks > 0 do
        local remaining = {}
        for _, co in ipairs(tasks) do
            coroutine.resume(co)
            if coroutine.status(co) ~= "dead" then
                table.insert(remaining, co)   -- 没跑完的任务留到下一轮
            end
        end
        tasks = remaining
    end
    print("all tasks finished")
end

scheduler({
    coroutine.create(function()
        for i = 1, 2 do print("task A:", i); coroutine.yield() end
    end),
    coroutine.create(function()
        for i = 1, 2 do print("task B:", i); coroutine.yield() end
    end)
})
-- 输出
-- task A:	1
-- task B:	1
-- task A:	2
-- task B:	2
-- all tasks finished
```

这种"任务轮转 + 主动让出"的模式是许多 Lua 框架实现异步 I/O、游戏帧逻辑的基础：把一次网络请求、一个动画步骤或一批数据处理封装成协程，在其等待点调用 `yield` 让出，宿主程序在合适的时机再恢复它。

## 5. 相关章节

- [协程的基本概念](./coroutines-basics.md)
- [协程的创建与使用](./creating-using-coroutines.md)
- [协程的状态与生命周期](./coroutine-lifecycle.md)
- [协程与线程的比较](./coroutines-vs-threads.md)
- [协程的应用场景与最佳实践](./coroutine-best-practices.md)

## 结语

协程让 Lua 用极小的代价获得了结构化的并发能力：它不是用来提升计算吞吐的并行工具，而是用来把"交替执行的任务"写成清晰顺序代码的控制结构。理解了协程与并发、并行的区别，就能在合适的场景中发挥它的价值。
