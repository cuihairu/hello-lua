# 表（Tables）

表（Tables）是 Lua 唯一的数据结构，存数据、管数据都靠它。整数索引当数组用，字符串索引当字典用，还能往上搭链表这类结构。

## 1. 表的基本创建与访问

### 创建表

使用花括号 `{}` 可以创建一个新的表。

```lua
local myTable = {}
```

### 表的索引

Lua 中的表是通过键值对（key-value pairs）来访问元素的。键可以是任何 Lua 类型，值也可以是任何 Lua 类型。

```lua
local person = {
    name = "Alice",
    age = 30
}

print(person.name)  -- 输出 "Alice"
print(person["age"])  -- 输出 30
```

## 2. 表作为数组

Lua 的数组是通过整数索引的表来实现的。数组的索引从 1 开始，而不是 0。

### 创建和访问数组

```lua
local fruits = {"apple", "banana", "cherry"}
print(fruits[1])  -- 输出 "apple"
print(fruits[2])  -- 输出 "banana"
```

### 遍历数组

可以使用 `for` 循环遍历数组。

```lua
for i, fruit in ipairs(fruits) do
    print(i, fruit)
end
-- 输出
-- 1 apple
-- 2 banana
-- 3 cherry
```

## 3. 表作为字典

Lua 中的字典是通过字符串索引的表来实现的。可以使用任意类型的值作为键。

### 创建和访问字典

```lua
local person = {
    name = "Bob",
    age = 25,
    occupation = "Engineer"
}

print(person["name"])  -- 输出 "Bob"
print(person.occupation)  -- 输出 "Engineer"
```

### 遍历字典

使用 `pairs` 函数可以遍历字典中的键值对。

```lua
for key, value in pairs(person) do
    print(key, value)
end
-- 输出（三条键值对都会被遍历到，但顺序取决于表的哈希顺序，可能与下面不同）
-- name	Bob
-- age	25
-- occupation	Engineer
```

## 4. 表的嵌套

表可以嵌套在其他表中，用于创建复杂的数据结构。

### 嵌套表示例

```lua
local matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
}

print(matrix[2][3])  -- 输出 6
```

## 5. 表的元表和元方法

元表（metatables）允许你改变表的行为，如支持运算符重载、提供默认值等。

### 设置元表

使用 `setmetatable` 函数来设置元表。

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

- `__index`: 当表中找不到某个键时调用
- `__newindex`: 当对表中不存在的键赋值时调用（对已存在的键赋值不会触发）
- `__add`, `__sub`, `__mul`: 支持运算符重载

### 运算符重载示例

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

## 6. 表的高级用法

表能搭出比基本存储复杂得多的结构和算法：链表、堆栈、队列。

### 链表示例

```lua
local Node = {}
Node.__index = Node

function Node.new(value, next)
    local self = setmetatable({}, Node)
    self.value = value
    self.next = next
    return self
end

local head = Node.new(1, Node.new(2, Node.new(3, nil)))
local current = head
while current do
    print(current.value)
    current = current.next
end
-- 输出
-- 1
-- 2
-- 3
```

## 结语

创建用 `{}`，访问用键，数组的索引从 1 开始，改表的行为用元表。表这一关过了，Lua 剩下的部分都不难。