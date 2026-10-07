# 常见的编码误区

下面这些误区在 Lua 代码里反复出现，每一个都附了改法。

## 1. 忽视局部变量的使用

用全局变量代替局部变量，容易撞名，访问也慢。

反例:

```lua
-- 不推荐
count = 0

function increment()
    count = count + 1
end
```

改法是用 `local` 把作用域限制在函数或块内。

改后:

```lua
local count = 0

function increment()
    count = count + 1
end
```

## 2. 错误的表键使用

用每次都新建的表作键，写进去的值就取不回来了。

表本身可以作为键（Lua 允许任何非 `nil` 的值作为键），但下面的写法每次 `{}` 都会创建一个**新**表，写入和读取用的是两个不同的对象，因此取回的是 `nil`。

反例:

```lua
local t = {}
t[{}] = "value"   -- 写入：键是这里新建的表

print(t[{}])      -- 读取：这里又新建了一个表，输出 nil
```

改法：键用字符串、数字这类能稳定构造的值；必须用表作键时，把同一个表存进局部变量复用。

改后:

```lua
local t = {}
t["key"] = "value"  -- 正确的键使用

print(t["key"])  -- 输出 "value"
```

## 3. 未处理的错误

直接调用可能出错的函数而不做处理，程序会当场崩掉。

反例:

```lua
local file = io.open("nonexistent_file.txt", "r")
local content = file:read("a")  -- 文件不存在时 file 为 nil，这里会报错
```

注意：`io.open` 打开失败时**不会抛出错误**，而是返回 `nil, errmsg`。因此 `pcall(io.open, ...)` 捕获不到“文件不存在”，真正会出错的是随后对 `nil` 调用 `read`。

改法：先检查 `io.open` 的返回值，再做读取操作。

改后:

```lua
local file, err = io.open("nonexistent_file.txt", "r")
if file then
    local content = file:read("a")
    file:close()
    print(content)
else
    print("Error opening file: " .. tostring(err))
end
```

## 4. 重复代码

相似代码复制粘贴而不提成函数，改一处就得记着改另一处。

示例:

```lua
function calculate_area(width, height)
    return width * height
end

-- 重复代码
local area1 = 10 * 20
local area2 = 15 * 25
```

改法：把重复代码提取到函数里，改一处就够。

改后:

```lua
function calculate_area(width, height)
    return width * height
end

local area1 = calculate_area(10, 20)
local area2 = calculate_area(15, 25)
```

## 5. 不适当的全局表使用

往全局表里随手塞数据，早晚被人覆盖，或者覆盖别人。

反例:

```lua
-- 不推荐
_G.some_variable = "value"  -- 直接修改全局表
```

改法：数据用局部表或模块组织和存储，别动全局表。

改后:

```lua
local MyModule = {}

function MyModule.set_value(value)
    MyModule.value = value
end

return MyModule
```

## 6. 不合理的表操作

对表做操作前不想想它的特性，容易写出慢代码或逻辑错误。

示例:

```lua
local t = {1, 2, 3, 4}
table.insert(t, 5)
print(t[5])  -- 输出 5，表的最后一个元素被插入了
```

先弄清表的特性和操作方法再动手，能省掉不少无谓的开销和错误。

示例:

```lua
local t = {1, 2, 3, 4}
table.insert(t, 5)  -- 插入值到表中
for i, v in ipairs(t) do
    print(i, v)  -- 遍历表的值
end
```

## 7. 不正确的字符串操作

用字符串操作函数之前先记住：字符串不可变，改不了，只能新建。

反例:

```lua
local str = "Hello"
-- str:sub(1, 3) = "Hi"  -- 错误：字符串不可变，不能被赋值修改（这句本身也是语法错误）
```

改法：用合适的字符串操作函数生成新字符串，而不是试图原地修改。

改后:

```lua
local str = "Hello"
local new_str = "Hi" .. str:sub(4)  -- 创建新字符串："Hi" 拼接上 "lo"
print(new_str)  -- 输出 "Hilo"
```

## 8. 没有利用 Lua 的协程特性

长任务一路函数调用写到底，只能干等。协程可以中途让出执行，主流程不必卡住。

反例:

```lua
function task1()
    -- 执行长时间任务
end

function task2()
    -- 执行另一长时间任务
end

task1()  -- 阻塞执行
task2()
```

改法：把任务放进协程，用 `coroutine.resume` 驱动，执行到 `coroutine.yield` 就让出。

改后:

```lua
local co1 = coroutine.create(function()
    -- 执行长时间任务
end)

local co2 = coroutine.create(function()
    -- 执行另一长时间任务
end)

coroutine.resume(co1)
coroutine.resume(co2)
```
