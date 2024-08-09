# 数据类型

Lua 是一种动态类型的语言，这意味着变量的类型是在运行时确定的。Lua 提供了几种基本的数据类型，用于处理不同类型的数据和结构。理解这些数据类型是编写 Lua 脚本的基础。

## 1. Nil

`nil` 是 Lua 中的一个特殊类型，表示不存在或无值。它通常用于表示一个变量没有被初始化或一个函数没有返回值。

### 示例

```lua
local var = nil
print(var)  -- 输出 nil
```

## 2. Boolean

布尔类型用于表示逻辑值，即 `true` 和 `false`。它通常用于条件判断和逻辑运算中。

### 示例

```lua
local isTrue = true
local isFalse = false
print(isTrue)  -- 输出 true
print(isFalse) -- 输出 false
```

## 3. Number

`number` 类型表示数字，包括整数和浮点数。在 Lua 5.3 及以后的版本中，`number` 类型分为 `integer` 和 `float`。在 Lua 5.1 和 5.2 中，所有数字都是浮点数。

### 示例

```lua
local integer = 42
local float = 3.14
print(integer)  -- 输出 42
print(float)    -- 输出 3.14
```

## 4. String

`string` 类型用于表示文本数据。Lua 的字符串是不可变的，这意味着字符串在创建后不能被修改。字符串可以使用单引号 (`'`)、双引号 (`"`) 或长字符串语法（`[[` 和 `]]`）定义。

### 示例

```lua
local singleQuoteStr = 'Hello, Lua!'
local doubleQuoteStr = "Hello, Lua!"
local longStr = [[
This is a long string
that spans multiple lines.
]]
print(singleQuoteStr)  -- 输出 Hello, Lua!
print(doubleQuoteStr)  -- 输出 Hello, Lua!
print(longStr)         -- 输出长字符串
```

## 5. Table

`table` 是 Lua 中的主要数据结构，用于表示数组、字典等。它可以存储任意类型的值，包括其他表。表是 Lua 的唯一数据结构，可以用来实现对象、集合和更多复杂的数据结构。

### 示例

```lua
-- 创建一个空表
local tbl = {}

-- 创建一个包含初始值的表
local person = {
    name = "Lua",
    version = 5.4,
    isDynamic = true
}

-- 访问表的字段
print(person.name)       -- 输出 Lua
print(person["version"]) -- 输出 5.4

-- 修改表的字段
person.name = "Lua 5.4"
print(person.name)       -- 输出 Lua 5.4

-- 表的嵌套
local nestedTable = {
    numbers = {1, 2, 3},
    details = {name = "Lua", version = 5.4}
}
print(nestedTable.details.name) -- 输出 Lua
```

## 6. Function

`function` 类型用于表示函数。函数在 Lua 中是一等公民，可以作为变量传递、作为表的字段以及返回多个值。函数可以使用 `function` 关键字定义。

### 示例

```lua
-- 定义函数
local function add(a, b)
    return a + b
end

-- 调用函数
local result = add(10, 20)
print(result)  -- 输出 30
```

## 7. Userdata

`userdata` 类型用于表示用户自定义的数据，它可以与 C 语言代码一起使用来封装 C 数据结构。`userdata` 在 Lua 中是一个与 C 语言数据结构交互的桥梁。

### 示例

```lua
-- Userdata 的创建和使用通常涉及到 C 语言与 Lua 的结合
-- 示例略，通常涉及到 C 语言的代码实现
```

## 8. Thread

`thread` 类型表示协程（coroutine）。协程是 Lua 的一种轻量级线程，允许在不同的协程之间切换执行。它用于实现并发和异步编程。

### 示例

```lua
-- 创建协程
local co = coroutine.create(function ()
    for i = 1, 5 do
        print(i)
        coroutine.yield()
    end
end)

-- 启动协程
for i = 1, 5 do
    coroutine.resume(co)
end
```

## 结语

了解 Lua 的各种数据类型是编写有效脚本的基础。Lua 的灵活性和强大的数据结构使得它能够处理各种编程任务。掌握这些数据类型将帮助你更好地利用 Lua 的功能。
