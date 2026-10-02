# 协程的创建与使用

Lua 的 `coroutine` 库提供了创建和使用协程的全部工具。本节聚焦于具体的创建方式、参数传递、错误处理等实际使用细节。

## 1. 创建协程的两种方式

### 1.1 coroutine.create

`coroutine.create(f)` 返回一个 `thread` 类型的协程对象，需要显式地调用 `coroutine.resume` 来启动或恢复它：

```lua
local co = coroutine.create(function(name)
    print("hello,", name)
    return "finished"
end)

print(type(co))               -- 输出 thread
print(coroutine.resume(co, "Lua"))   -- 输出 hello,	Lua 和 true	finished
```

第一次 `resume` 时，除了协程对象以外的参数会作为参数传给协程函数；函数的返回值则作为 `resume` 的返回值交还给调用者。

### 1.2 coroutine.wrap

`coroutine.wrap(f)` 返回一个普通函数，调用它就相当于对协程执行一次 `resume`，并直接拿到 `yield` 出来的值：

```lua
local counter = coroutine.wrap(function()
    for i = 1, 3 do
        coroutine.yield(i)
    end
end)

print(counter())  -- 输出 1
print(counter())  -- 输出 2
print(counter())  -- 输出 3
```

两种方式的取舍：`create` 返回的协程对象可以配合 `status`、`close` 等函数使用，且错误以返回值形式报告，更安全；`wrap` 更简洁，常用于把协程当作迭代器或生成器使用。

## 2. 与协程交换数据

协程与调用者之间有两条数据通道，方向相反：

- `yield(args)` 的参数 → 作为这一次 `resume` 的返回值，从协程流向调用者。
- `resume(co, args)` 的额外参数 → 作为上一次 `yield` 的返回值，从调用者流向协程。

```lua
local co = coroutine.create(function(initial)
    local n = initial
    while true do
        local step = coroutine.yield(n)   -- 交出当前值 n，等待调用者提供步长 step
        if not step then break end
        n = n + step
    end
    return n
end)

print(coroutine.resume(co, 100))   -- 输出 true	100
print(coroutine.resume(co, 5))     -- 输出 true	105
print(coroutine.resume(co, 20))    -- 输出 true	125
print(coroutine.resume(co))        -- 输出 true	125
```

这个例子实现了一个可以由外部驱动步长的累加器：调用者每 `resume` 一次，协程就前进一步，并把中间结果交出来。

## 3. 协程中的错误处理

用 `create` 创建的协程内部发生错误时，错误不会终止整个程序，而是通过 `resume` 的返回值报告：

```lua
local co = coroutine.create(function()
    error("something failed")
end)

local ok, err = coroutine.resume(co)
print(ok)   -- 输出 false
print(err)  -- 输出形如 "demo.lua:2: something failed"（含出错位置）
```

`wrap` 返回的函数则没有这层保护，协程内的错误会直接在调用处抛出，需要用 `pcall` 包裹：

```lua
local f = coroutine.wrap(function()
    error("boom", 0)
end)

print(pcall(f))   -- 输出 false	boom
```

发生错误后协程会直接进入死亡状态，不能再恢复：

```lua
local co = coroutine.create(function()
    error("oops")
end)

coroutine.resume(co)        -- 返回 false 和错误信息
print(coroutine.status(co)) -- 输出 dead
```

如果需要带完整调用栈的错误信息，可以在协程函数内部用 `xpcall` 包裹业务逻辑，或改用 `wrap` 并在外层配合 `pcall` 处理。

## 4. 结束协程

协程函数返回后协程自然死亡，此外还可以用 `coroutine.close` 主动关闭一个挂起中的协程（Lua 5.4 新增）：

```lua
local co = coroutine.create(function()
    coroutine.yield("working")
    print("never reached")
end)

print(coroutine.resume(co))    -- 输出 true	working
print(coroutine.close(co))     -- 输出 true（协程被关闭）
print(coroutine.status(co))    -- 输出 dead
```

被 `close` 关闭的协程无法再恢复；若协程内部定义了待关闭变量（to-be-closed 变量），关闭时它们的 `__close` 元方法会被依次调用，适合用来释放资源。

## 结语

创建协程只需要 `create` 或 `wrap` 一行代码，真正的关键在于理解参数如何在 `resume` 与 `yield` 之间双向流动，以及 `create` 与 `wrap` 在错误处理上的差异。掌握这些细节之后，就可以放心地把协程用到迭代器、任务调度等更复杂的结构中。
