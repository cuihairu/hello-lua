# 元表和元方法

元表（metatables）和元方法（metamethods）用来改表的默认行为：运算符重载、读不到键时给默认值，都从这里下手。

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

当对表中不存在的键赋值时，`__newindex` 元方法会被调用（对已存在的键赋值不会触发）。

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

两个坑要留意。`__index` 和 `__newindex` 里别直接操作原始表，那会无限递归，绕开它要用 `rawget` 和 `rawset`。另外，元表和元方法用得过密会拖慢性能，性能敏感的场合尤其要掂量。

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
t.someKey = "Some value"  -- 键不存在，触发 __newindex
print(t.someKey)          -- 键已存在，直接读取，不触发 __index
print(t.otherKey)         -- 键不存在，触发 __index
-- 输出
-- Setting key:	someKey	to	Some value
-- Some value
-- Accessing key:	otherKey
-- nil
```

## 结语

读键、写键、运算、转字符串、当函数调用，这些触发点全部挂在元表上。把它们串起来，表的行为就基本由你定义了。