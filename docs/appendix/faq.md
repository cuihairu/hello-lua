# 常见问题与解决方案

本章汇总在编写 Lua 程序时最常遇到的问题。所有示例均在 Lua 5.4 下验证通过。

## 1. 局部变量和全局变量的性能差别有多大？

为什么总是建议用 `local` 声明变量？

全局变量需要通过 `_G` 表（实际上是环境表）逐层查找，而局部变量在虚拟机中以寄存器或 upvalue 的方式直接寻址，因此局部变量明显更快，也不会污染全局命名空间。

```lua
-- 推荐写法
local name = "Lua"
local function greet()
    return "Hello, " .. name
end
print(greet())
```

在热循环中，还可以把全局函数先缓存到局部变量中再调用：

```lua
-- 把全局函数缓存为局部变量
local floor = math.floor
local function f(x)
    return floor(x) * 2
end
print(f(3.7))
```

## 2. `#t` 和 `t[#t + 1]` 追加元素有什么问题？

为什么在循环里不建议用 `table.insert(t, v)` 或 `t[#t + 1] = v` 持续追加？

这两种写法在 Lua 中都会触发对表的重新分配，频繁追加会产生较多的垃圾，增加 GC 压力。对已知长度的序列，优先一次性用字面量构造，或使用 `table.move`、`table.concat` 等批量操作。

```lua
local t = {}
for i = 1, 5 do
    t[#t + 1] = i        -- 可行，但会多次触发表扩容
end
print(table.concat(t, ","))   -- 1,2,3,4,5
```

同时注意：`#t` 对含有空洞的“稀疏表”并不给出确定结果，不要把它当作“元素个数”使用。

## 3. 为什么 `1 / 0` 不报错？

在 C 语言中 `1 / 0` 是未定义行为，为什么 Lua 中会得到 `inf`？

Lua 的除法总是产生浮点数结果，除以 0 得到 `inf`（正无穷）或 `-inf`，除以 `0/0` 得到 `nan`，都不会抛出错误。只有对 `nil` 或布尔值做算术运算才会报错。

```lua
print(1 / 0)        -- inf
print(0 / 0)        -- nan
print(-1 / 0)       -- -inf
```

如果需要在除数为 0 时触发错误，应显式判断：

```lua
local function safe_divide(a, b)
    if b == 0 then
        return nil, "division by zero"
    end
    return a / b
end

print(safe_divide(10, 2))    -- 5
print(safe_divide(10, 0))    -- nil     division by zero
```

## 4. `//` 和 `%` 在负数上是什么行为？

`math.floor(-1 / 2)` 与 `-1 // 2` 结果一致吗？

一致。Lua 5.4 的 `//`（整除）和 `%`（取模）都按“向负无穷取整”的规则计算，结果的符号由除数决定。

```lua
print(-1 // 2)          -- -1
print(-1 % 2)           -- 1
print(math.floor(-1 / 2)) -- -1
print(-7 % 3)           -- 2
```

## 5. 为什么 `ipairs` 和 `pairs` 遍历顺序不一样？

对同一个表用 `pairs` 遍历，顺序每次都可能不同。

Lua 的表同时承担数组和哈希表两种角色：`ipairs` 从 1 开始按下标连续遍历数组部分，顺序稳定；`pairs` 遍历数组部分后再遍历哈希部分，哈希部分的顺序依赖键的哈希值，是无序的。

```lua
local t = {10, 20, 30, x = 1, y = 2}

for i, v in ipairs(t) do      -- 顺序稳定：10 20 30
    io.write(v, " ")
end
print()
```

若需要稳定顺序，请显式遍历下标，或把键收集到数组中排序后再处理。

## 6. 为什么字符串不能原地修改？

`s:sub(1, 3) = "abc"` 报语法错误。

Lua 中的字符串是不可变的（intern 且只读），任何“修改”都会产生一个新字符串。循环中反复拼接字符串会生成大量临时串，应改用 `table.concat`。

```lua
local parts = {"Hello", " ", "world", "!"}
print(table.concat(parts))          -- Hello world!
```

## 7. `require` 找不到模块怎么办？

`require("mymodule")` 报 `module 'mymodule' not found`。

`require` 依次搜索 `package.path`（Lua 文件）和 `package.cpath`（C 库），其中的 `?` 会被模块名替换。把模块所在目录加入即可：

```lua
package.path = package.path .. ";./mylib/?.lua"

local ok, mod = pcall(require, "mymodule")
if not ok then
    print("加载失败: " .. tostring(mod))
else
    print("加载成功:", mod.name)
end
```

注意模块文件必须 `return` 一个值，否则 `require` 会返回 `true`。

## 8. 如何安全地调用可能出错的代码？

怎样避免一个错误拖垮整个程序？

用 `pcall`（保护调用）或 `xpcall`（可指定错误处理函数）执行可能出错的代码。错误发生时第一个返回值为 `false`，第二个是错误对象。

```lua
local ok, err = pcall(function()
    error("something went wrong")
end)
if not ok then
    print("捕获错误:", err)
end
```

## 9. 为什么错误信息里带有文件名和行号？

`error("oops")` 得到的字符串是 `[string "..."]:1: oops`。

`error` 默认会在消息前附加位置信息，第二个参数可以控制（传 `2` 表示使用调用者的位置）：

```lua
local function f()
    error("oops", 2)
end

local function g()
    f()
end

local ok, err = pcall(g)
print(err)          -- 输出：faq.lua:6: oops
```

文件名取自脚本实际保存的名字，行号 6 指向调用 `f` 的那一行。第二个参数 `2` 让消息使用调用者的位置，而不是 `error` 所在的位置。

## 10. 弱引用表有什么用？

缓存表越用越大，怎么让其中的条目能被回收？

把表放进弱表即可。`__mode = "v"` 表示值是弱引用，`"k"` 表示键是弱引用；当键或值不可达时，对应条目会被 GC 移除。

```lua
local cache = setmetatable({}, { __mode = "v" })

local function get_value(k)
    if not cache[k] then
        cache[k] = { computed = k * 2 }
    end
    return cache[k]
end

get_value(1)
get_value(2)
print("条目数:", (function()
    local n = 0
    for _ in pairs(cache) do n = n + 1 end
    return n
end)())
collectgarbage("collect")       -- 对象没有外部引用时，条目会被清除
print("回收后条目数:", (function()
    local n = 0
    for _ in pairs(cache) do n = n + 1 end
    return n
end)())
```

## 11. `xpcall` 的第二个参数有什么用？

`xpcall` 和 `pcall` 的区别在哪里？

`xpcall` 允许传入一个错误处理函数，可用于在错误发生时打印调用栈：

```lua
local function handler(err)
    print("错误:", err)
    local info = debug.traceback()
    print(info)
    return err
end

local ok = xpcall(function()
    local t = nil
    return t.field      -- 触发错误
end, handler)
print("是否成功:", ok)
```

## 12. 如何查看当前程序用了多少内存？

如何定位内存增长过快的位置？

`collectgarbage("count")` 返回当前 Lua 分配的内存（单位 KB），配合 `collectgarbage("collect")` 可以手动回收后再观察增量。

```lua
local before = collectgarbage("count")
local t = {}
for i = 1, 10000 do t[i] = {} end
local after = collectgarbage("count")
print(string.format("分配了 %.1f KB", after - before))
```

## 总结

以上问题覆盖了作用域、表、字符串、模块、错误处理和内存管理等高频场景。遇到问题时建议先复现最小示例，再用 `pcall` 与 `collectgarbage("count")` 定位，多数情况都能快速找到原因。
