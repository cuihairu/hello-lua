# 表（Tables）

表（Tables）是 Lua 中的核心数据结构，它是一种灵活且强大的工具，用于存储和管理数据。表不仅可以用作数组和字典，还可以实现更复杂的数据组织形式。理解表的基本操作和特性对于 Lua 编程至关重要。

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
-- 输出
-- name Bob
-- age 25
-- occupation Engineer
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
- `__newindex`: 当表中某个键被赋值时调用
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

表不仅可以用作基本的数据存储结构，还可以实现更多复杂的数据结构和算法，如链表、堆栈、队列等。

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

表是 Lua 中的强大且灵活的数据结构，它可以用作数组、字典、以及更复杂的数据结构。掌握表的基本操作、嵌套表、元表和高级用法，将使你能够有效地管理和组织数据，编写出功能强大的 Lua 程序。