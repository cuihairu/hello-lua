# Metatables and Metamethods

Metatables and metamethods change a table's default behavior: operator overloading, default values for missing keys, and the rest all start here.

## 1. The idea of a metatable

A metatable is a special table used to define and alter the behavior of another table. Once a table has a metatable, certain operations on it are taken over by metamethods.

### Setting a metatable

Use `setmetatable` to associate a metatable with a table.

```lua
local t = {}
local mt = {}
setmetatable(t, mt)
```

### Getting a metatable

Use `getmetatable` to retrieve the metatable associated with a table.

```lua
local mt = getmetatable(t)
```

## 2. Common metamethods

Metamethods are special functions defined in a metatable, used to implement custom behavior. Some of the common ones:

### `__index`

`__index` is called when a key cannot be found in the table.

```lua
local t = {}
local mt = {
    __index = function(table, key)
        return "Default value"
    end
}
setmetatable(t, mt)
print(t.someKey)  -- "Default value"
```

### `__newindex`

`__newindex` is called when you assign to a key that does not exist in the table (assigning to an existing key does not trigger it).

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
-- prints "Setting someKey to Some value"
```

### Operator overloading with `__add`, `__sub`, `__mul` and so on

Metamethods can be used to overload Lua's operators.

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
print(v3.x, v3.y)  -- 4 6
```

### `__call`

The `__call` metamethod lets a table be invoked like a function.

```lua
local t = {}
local mt = {
    __call = function(table, ...)
        local args = {...}
        return "Called with " .. #args .. " arguments"
    end
}
setmetatable(t, mt)
print(t(1, 2, 3))  -- "Called with 3 arguments"
```

### `__tostring`

`__tostring` defines how a table is converted to a string.

```lua
local t = {name = "Alice", age = 30}
local mt = {
    __tostring = function(table)
        return "Name: " .. table.name .. ", Age: " .. table.age
    end
}
setmetatable(t, mt)
print(t)  -- "Name: Alice, Age: 30"
```

## 3. Notes and pitfalls

Two traps to watch. Inside `__index` and `__newindex`, do not touch the original table directly — that recurses forever; go around it with `rawget` and `rawset`. Also, layering metatables and metamethods too densely slows things down, so weigh it carefully in performance-sensitive code.

## 4. Example: implementing custom behavior

### Customizing a table's behavior

Metamethods can also implement custom behavior, such as logging access to and modification of a table.

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
t.someKey = "Some value"  -- key absent, triggers __newindex
print(t.someKey)          -- key exists now, direct read, no __index
print(t.otherKey)         -- key absent, triggers __index
-- output
-- Setting key:	someKey	to	Some value
-- Some value
-- Accessing key:	otherKey
-- nil
```

## Wrap-up

Reading a key, writing a key, arithmetic, conversion to string, calling as a function — all of these hook points hang off the metatable. Chain them together and a table's behavior is essentially yours to define.

## References

- [Lua 5.4 reference manual · 2.6 Metamethods](https://www.lua.org/manual/5.4/manual.html#2.6)
- [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming)
- [PIL · Metatables](https://www.lua.org/pil/11.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [data-structures](data-structures.md)
- [glossary](/glossary.md)
- [books](/knowledge/books.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
