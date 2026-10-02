# 协程的状态与生命周期

每个协程都有自己的生命周期：从创建、运行、挂起，到最终死亡。`coroutine.status` 可以随时查询一个协程当前所处的状态，理解这些状态及其转换条件，是避免"恢复已死亡协程"这类错误的基础。

## 1. 协程的四种状态

`coroutine.status(co)` 返回以下四种字符串之一：

| 状态 | 含义 |
| --- | --- |
| `suspended` | 挂起：已创建尚未运行，或停在某个 `yield` 处等待恢复 |
| `running` | 运行中：正在占用执行权（只能在被查询协程自身内部看到） |
| `normal` | 活跃但未运行：该协程恢复过别的协程，自己正等待对方让出或结束 |
| `dead` | 死亡：函数已返回或发生了无法恢复的错误，也可能是被 `close` 关闭 |

## 2. 状态流转实例

下面的例子完整地走了一遍"挂起 → 运行 → 挂起 → 死亡"的流程：

```lua
local co   -- 先声明再赋值，协程体内才能引用这个局部变量
co = coroutine.create(function()
    print("inside:", coroutine.status(co))   -- 运行中看自己是 running
    coroutine.yield()
    print("resumed again")
end)

print(coroutine.status(co))    -- 输出 suspended（创建后尚未启动）
coroutine.resume(co)           -- 输出 inside:	running
print(coroutine.status(co))    -- 输出 suspended（挂起在 yield 处）
coroutine.resume(co)           -- 输出 resumed again
print(coroutine.status(co))    -- 输出 dead（函数返回）
```

`normal` 状态比较少见：当一个协程 A 恢复另一个协程 B 时，B 处于 `running`，而 A 就处于 `normal`——它"活着"，但执行权在别人手里：

```lua
local main = coroutine.running()   -- 当前（主）协程

local co = coroutine.create(function()
    -- 此时 co 是 running，恢复它的 main 是 normal
    print("status of main:", coroutine.status(main))
end)

coroutine.resume(co)   -- 输出 status of main:	normal
```

## 3. 查询正在运行的协程

`coroutine.running` 返回当前正在运行的协程本身，以及它是否为主协程：

```lua
local co, is_main = coroutine.running()
print(co ~= nil, is_main)   -- 在脚本主流程中执行：输出 true	true
```

主协程是程序启动时就存在的协程，它永远不会是 `suspended` 状态（不能对它 `resume`），程序退出时它才结束。

## 4. 死亡协程与恢复错误

协程死亡之后，再对它执行 `resume` 会得到一个错误而不是崩溃：

```lua
local co = coroutine.create(function() end)

coroutine.resume(co)             -- 协程运行完毕，进入 dead 状态
print(coroutine.status(co))      -- 输出 dead
print(coroutine.resume(co))      -- 输出 false	cannot resume dead coroutine
```

同理，尝试恢复主协程、或恢复一个正在运行中的协程，也都会返回失败。稳妥的写法是始终检查 `resume` 的第一个返回值。

## 5. 用 coroutine.close 提前结束

Lua 5.4 增加了 `coroutine.close`，可以把一个挂起中的协程直接置为死亡状态：

```lua
local co = coroutine.create(function()
    coroutine.yield("waiting")
    print("never reached")
end)

coroutine.resume(co)         -- 输出 true	waiting
print(coroutine.close(co))   -- 输出 true
print(coroutine.status(co))  -- 输出 dead
```

`close` 的价值在于资源清理：关闭时，协程内尚未销毁的 to-be-closed 变量（`<close>` 局部变量）会按逆序调用各自的 `__close` 元方法，适合释放文件句柄、数据库连接等资源。如果某个 `__close` 抛出了错误，`close` 返回 `false` 和错误对象。

## 6. 生命周期小结

一个协程的典型生命周期可以概括为：

1. `coroutine.create` 创建，进入 `suspended`；
2. `coroutine.resume` 启动，进入 `running`；
3. 遇到 `coroutine.yield`，回到 `suspended`，等待下一次恢复；
4. 重复 2-3，直到函数 `return`（或发生错误、被 `close`），进入 `dead`；
5. `dead` 之后的任何 `resume` 都会失败。

## 结语

协程的状态机并不复杂：`suspended` 与 `running` 之间靠 `resume`/`yield` 来回切换，`dead` 是唯一不可逆的终点。写代码时记住两件事——不要恢复已死亡的协程，需要提前结束时用 `close` 并让 to-be-closed 变量完成清理——就能避开协程生命周期里绝大多数的坑。
