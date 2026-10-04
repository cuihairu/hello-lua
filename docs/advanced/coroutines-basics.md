# 协程的基本概念

协程（coroutine）是一类特殊的函数：它可以在执行到一半时暂停（挂起），保存当前的执行状态，之后又可以从暂停的位置继续运行。Lua 通过标准库 `coroutine` 提供了对协程的完整支持，协程本身是 Lua 的一种原生数据类型（`thread` 类型）。

## 1. 什么是协程

可以把协程理解为"可以暂停和恢复的函数"：

- 普通函数一旦被调用，就一定会从头执行到结束（或中途出错）。
- 协程在执行过程中可以调用 `coroutine.yield` 主动挂起，把控制权交还给调用者；之后通过 `coroutine.resume` 从挂起点继续执行。

协程是协作式的：切换时机完全由代码决定，不存在被强制打断的情况。

## 2. 创建与恢复

使用 `coroutine.create` 创建一个协程，参数是协程的函数体。创建后协程并不会立即运行，需要用 `coroutine.resume` 来启动它：

```lua
local co = coroutine.create(function()
    print("running inside the coroutine")
end)

print(co)                  -- 输出形如 thread: 0x...（协程是 thread 类型的值）
print(coroutine.resume(co))   -- 输出 true（成功启动，函数正常返回）
print(coroutine.status(co))   -- 输出 dead（函数执行完毕，协程死亡）
```

`coroutine.resume` 的第一个返回值是状态：协程正常运行结束或正常挂起时为 `true`，协程内部发生错误时为 `false`，后跟错误信息。

## 3. 让出与恢复的往返

协程内部通过 `coroutine.yield` 挂起自己。`yield` 可以带参数，这些参数会成为 `resume` 调用的返回值；反过来，下一次 `resume` 传入的额外参数又会成为 `yield` 的返回值，二者构成一条双向通道：

```lua
local co = coroutine.create(function(a, b)
    print("coroutine started with", a, b)
    local x = coroutine.yield(a + b)   -- 把 a+b 交给 resume 的调用者，并等待下一次恢复
    print("received", x)
    return "done"
end)

print(coroutine.resume(co, 10, 20))   -- 输出 true	30
print(coroutine.resume(co, 99))       -- 输出 received	99 和 true	done
```

上面这段代码完整地展示了协程中的数据流动：

1. 第一次 `resume` 把 `10` 和 `20` 作为函数参数传入，函数执行到 `yield(a + b)` 时挂起，并把 `30` 返回给调用者。
2. 第二次 `resume` 传入的 `99` 成为 `yield` 的返回值，协程继续执行到 `return` 结束。
3. `return` 的值也会作为 `resume` 的返回值交还给调用者。

## 4. coroutine.wrap：更轻量的使用方式

`coroutine.wrap` 同样可以创建协程，但它返回的不是协程对象，而是一个"恢复函数"：每次调用这个函数相当于 `resume` 一次，协程 `yield` 出的值直接作为函数返回值返回：

```lua
local gen = coroutine.wrap(function()
    for i = 1, 3 do
        coroutine.yield(i * i)
    end
end)

print(gen())  -- 输出 1
print(gen())  -- 输出 4
print(gen())  -- 输出 9
```

`wrap` 用起来更简洁，非常适合把协程包装成迭代器。区别在于：`wrap` 返回的函数在协程内部出错时会直接把错误抛给调用者，而 `create` + `resume` 会把错误作为返回值安静地交回来。需要检查错误时，用 `create` 更合适。

## 结语

协程的核心只有三个动作：`create` 创建、`resume` 恢复、`yield` 挂起，再加上 `status` 查看状态和 `wrap` 做轻量包装。挂起时保存现场，恢复时继续执行，`resume`/`yield` 之间双向传值。后面的调度器、异步封装，都是这几个动作的组合。
