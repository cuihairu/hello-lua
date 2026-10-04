# 数组和字典的使用

Lua 的表既能当数组用（数组是表的一种特殊用法），也能当字典用。这一节分开讲两种用法，最后看怎么混在一张表里。

## 1. 数组的使用

在 Lua 中，数组是通过连续的整数键来实现的。数组的索引从 1 开始（不像许多其他编程语言从 0 开始）。

### 创建数组

创建一个数组非常简单，只需使用大括号 `{}` 来定义元素。

```lua
local fruits = {"apple", "banana", "orange"}
```

### 访问和修改数组元素

使用索引访问和修改数组中的元素。

```lua
local fruits = {"apple", "banana", "orange"}

-- 访问元素
print(fruits[1])  -- 输出 "apple"

-- 修改元素
fruits[2] = "grape"
print(fruits[2])  -- 输出 "grape"
```

### 遍历数组

可以使用 `for` 循环遍历数组中的元素。

```lua
local fruits = {"apple", "banana", "orange"}

for i = 1, #fruits do
    print(fruits[i])
end
```

### 数组的长度

使用 `#` 操作符获取数组的长度。

```lua
local fruits = {"apple", "banana", "orange"}
print(#fruits)  -- 输出 3
```

## 2. 字典的使用

字典是通过键（可以是字符串或其他类型）来实现的，键值对存储在表中。字典是一种关联数组，可以用来存储和查找数据。

### 创建字典

创建一个字典也是使用大括号 `{}`，但需要指定键值对。

```lua
local person = {
    name = "Alice",
    age = 30,
    occupation = "Engineer"
}
```

### 访问和修改字典元素

通过键来访问和修改字典中的值。

```lua
local person = {
    name = "Alice",
    age = 30,
    occupation = "Engineer"
}

-- 访问元素
print(person.name)  -- 输出 "Alice"

-- 修改元素
person.age = 31
print(person.age)  -- 输出 31
```

### 遍历字典

可以使用 `pairs` 函数遍历字典中的所有键值对。

```lua
local person = {
    name = "Alice",
    age = 30,
    occupation = "Engineer"
}

for key, value in pairs(person) do
    print(key, value)
end
```

### 字典的常见用途

配置项、按名字查的记录，都适合用字典存。

## 3. 数组和字典的混合使用

在 Lua 中，你可以将数组和字典混合在一个表中。例如，可以将一个表作为数组的元素，然后用字典来表示这些表中的数据。

```lua
local people = {
    {name = "Alice", age = 30},
    {name = "Bob", age = 25},
    {name = "Charlie", age = 35}
}

for i, person in ipairs(people) do
    print("Name:", person.name, "Age:", person.age)
end
```

## 4. 总结

数组用整数索引、从 1 数起，`#` 取长度；字典用键取值，`pairs` 遍历。两者可以混在一张表里，这也是 Lua 不需要第二种数据结构的原因。