# 元表和元方法

在 Lua 中，元表（metatables）和元方法（metamethods）提供了对表的操作进行自定义的强大机制。通过使用元表和元方法，你可以改变表的默认行为，例如支持运算符重载、定义默认值等。了解元表和元方法将帮助你更灵活地控制 Lua 表的行为。

## 1. 元表的概念

元表是一个特殊的表，用于定义和改变另一个表的行为。你可以将一个元表设置到一个表上，从而影响该表的操作。

### 设置元表

使用 `setmetatable` 函数将一个元表与另一个表关联起来。

```lua
local t = {}
local mt = {}
setmetatable(t, mt)
```

### 获取元表

使用 `getmetatable` 函数可以获取与某个表关联的元表。

```lua
local mt = getmetatable(t)
```

## 2. 常见的元方法

元方法是定义在元表中的特殊方法，用于实现自定义的行为。以下是一些常见的元方法及其功能：

### `__index`

当表中找不到某个键时，`__index` 元方法会被调用。

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

### `__newindex`

当表中某个键被赋值时，`__newindex` 元方法会被调用。

```lua
local t = {}
local mt = {
    __newindex = function(table, key, value)
        print("Setting", key, "to", value)
        rawset(table, key, value)
    end
}
setmetatable(t, mt)
t.someKey = "Some value"
-- 输出 "Setting someKey to Some value"
```

### `__add`, `__sub`, `__mul` 等运算符重载

元方法可以用来重载 Lua 中的运算符。

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

### `__call`

`__call` 元方法允许表像函数一样被调用。

```lua
local t = {}
local mt = {
    __call = function(table, ...)
        local args = {...}
        return "Called with " .. #args .. " arguments"
    end
}
setmetatable(t, mt)
print(t(1, 2, 3))  -- 输出 "Called with 3 arguments"
```

### `__tostring`

`__tostring` 元方法定义了如何将表转换为字符串。

```lua
local t = {name = "Alice", age = 30}
local mt = {
    __tostring = function(table)
        return "Name: " .. table.name .. ", Age: " .. table.age
    end
}
setmetatable(t, mt)
print(t)  -- 输出 "Name: Alice, Age: 30"
```

## 3. 使用元表和元方法的注意事项

- **避免无限循环**：在 `__index` 和 `__newindex` 元方法中，避免直接操作原始表，这可能会导致无限递归。可以使用 `rawget` 和 `rawset` 来避免这种情况。
  
- **性能考虑**：过度使用元表和元方法可能会影响性能，尤其是在性能敏感的应用中。

## 4. 示例：实现自定义行为

### 自定义表的行为

你可以实现自定义的行为，例如记录表的访问和修改。

```lua
local t = {}
local mt = {
    __index = function(table, key)
        print("Accessing key:", key)
        return rawget(table, key)
    end,
    __newindex = function(table, key, value)
        print("Setting key:", key, "to", value)
        rawset(table, key, value)
    end
}
setmetatable(t, mt)
t.someKey = "Some value"
print(t.someKey)
-- 输出
-- Setting key: someKey to Some value
-- Accessing key: someKey
-- Some value
```

## 结语

元表和元方法是 Lua 的强大特性，允许你自定义表的行为。通过了解和使用这些特性，你可以更灵活地控制数据的存储和操作，从而提高 Lua 编程的能力和效率。