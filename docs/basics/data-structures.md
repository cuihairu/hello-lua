# 数据结构

在 Lua 中，数据结构用于组织和存储数据。Lua 主要提供了表（tables）作为其唯一的数据结构，表不仅可以用作数组和字典，还支持许多复杂的数据组织形式。理解如何使用和操作表是 Lua 编程的关键。

## 1. 表（Tables）

表是 Lua 的核心数据结构，用于存储多个值。表可以用作数组、字典，甚至对象。

### 创建表

可以使用 `{}` 来创建一个新的表。

```lua
local myTable = {}
```

### 使用表作为数组

Lua 中的数组是通过整数索引的表来实现的。

```lua
local fruits = {"apple", "banana", "cherry"}
print(fruits[1])  -- 输出 "apple"
```

### 使用表作为字典

Lua 中的字典是通过字符串索引的表来实现的。

```lua
local person = {
    name = "John",
    age = 30
}
print(person.name)  -- 输出 "John"
print(person["age"])  -- 输出 30
```

### 嵌套表

表可以嵌套使用，形成更复杂的数据结构。

```lua
local matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
}
print(matrix[2][3])  -- 输出 6
```

## 2. 元表和元方法

元表（metatables）允许你改变表的行为，比如表的加法、索引等操作。元方法（metamethods）是定义在元表中的特殊方法。

### 设置元表

使用 `setmetatable` 函数为表设置元表。

```lua
local t = {}
local mt = {
    __index = function(table, key)
        return "Default value"
    end
}
setmetatable(t, mt)
print(t.someKey)  -- 输出 "Default value"
```

### 常见的元方法

- `__index`: 当表的某个键不存在时调用
- `__newindex`: 当表的某个键被赋值时调用
- `__add`, `__sub`, `__mul`: 支持运算符重载

### 示例：运算符重载

```lua
local Vector = {}
Vector.__index = Vector

function Vector.new(x, y)
    local self = setmetatable({}, Vector)
    self.x = x
    self.y = y
    return self
end

function Vector.__add(v1, v2)
    return Vector.new(v1.x + v2.x, v1.y + v2.y)
end

local v1 = Vector.new(1, 2)
local v2 = Vector.new(3, 4)
local v3 = v1 + v2
print(v3.x, v3.y)  -- 输出 4 6
```

## 3. 字符串处理

Lua 提供了丰富的字符串处理功能，通过表的索引或库函数来实现。

### 字符串操作函数

- `string.len(s)`: 返回字符串 `s` 的长度
- `string.upper(s)`: 返回字符串 `s` 的大写形式
- `string.sub(s, start, end)`: 返回字符串 `s` 从 `start` 到 `end` 的子串

### 示例

```lua
local s = "hello, world"
print(string.len(s))  -- 输出 13
print(string.upper(s))  -- 输出 "HELLO, WORLD"
print(string.sub(s, 1, 5))  -- 输出 "hello"
```

## 4. 数组和字典的使用

Lua 表可以用作数组或字典，根据需求进行选择。

### 数组示例

```lua
local numbers = {1, 2, 3, 4, 5}
for i = 1, #numbers do
    print(numbers[i])
end
```

### 字典示例

```lua
local settings = {
    volume = 5,
    brightness = 8
}
for key, value in pairs(settings) do
    print(key, value)
end
```

## 结语

在 Lua 中，表是一个功能强大的数据结构，能够实现多种数据组织形式。通过掌握表的基本用法、元表的设置和字符串处理函数，你可以在 Lua 中有效地管理和操作数据。熟练使用这些数据结构，将有助于提高编程效率和代码的可读性。
