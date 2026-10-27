# Tables

The table is Lua's only data structure; storing data and organizing it both come down to it. Integer indexes make it an array, string indexes make it a dictionary, and you can build things like linked lists on top.

## 1. Creating and accessing tables

### Creating a table

Braces `{}` create a new table.

```lua
local myTable = {}
```

### Table indexing

Tables are accessed through key-value pairs. The key can be any Lua type, and so can the value.

```lua
local person = {
    name = "Alice",
    age = 30
}

print(person.name)  -- "Alice"
print(person["age"])  -- 30
```

## 2. Tables as arrays

In Lua an array is a table indexed by integers. Array indexes start at 1, not 0.

### Creating and accessing an array

```lua
local fruits = {"apple", "banana", "cherry"}
print(fruits[1])  -- "apple"
print(fruits[2])  -- "banana"
```

### Iterating an array

Use a `for` loop to walk the array.

```lua
for i, fruit in ipairs(fruits) do
    print(i, fruit)
end
-- output
-- 1 apple
-- 2 banana
-- 3 cherry
```

## 3. Tables as dictionaries

A Lua dictionary is a table indexed by strings. Keys can be of any type.

### Creating and accessing a dictionary

```lua
local person = {
    name = "Bob",
    age = 25,
    occupation = "Engineer"
}

print(person["name"])  -- "Bob"
print(person.occupation)  -- "Engineer"
```

### Iterating a dictionary

Use `pairs` to walk the key-value pairs.

```lua
for key, value in pairs(person) do
    print(key, value)
end
-- output (all three pairs are visited, but the order follows the table's hash
-- order and may differ from the order shown below)
-- name	Bob
-- age	25
-- occupation	Engineer
```

## 4. Nested tables

Tables can be nested in other tables to build more complex structures.

### Nested table example

```lua
local matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
}

print(matrix[2][3])  -- 6
```

## 5. Metatables and metamethods for tables

Metatables let you change how a table behaves — operator overloading, default values and the like.

### Setting a metatable

Use `setmetatable` to attach a metatable.

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

### Common metamethods

- `__index`: called when a key cannot be found in the table
- `__newindex`: called when assigning to a key that does not exist (assigning to an existing key does not trigger it)
- `__add`, `__sub`, `__mul`: support operator overloading

### Operator overloading example

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

## 6. Advanced table usage

Tables can build structures and algorithms far beyond plain storage: linked lists, stacks, queues.

### Linked list example

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
-- output
-- 1
-- 2
-- 3
```

## Wrap-up

Create with `{}`, access by key, array indexes start at 1, and metatables change how a table behaves. Once the table is under your belt, the rest of Lua is not hard.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [Associative_array](https://en.wikipedia.org/wiki/Associative_array)
- [Hash_table](https://en.wikipedia.org/wiki/Hash_table)
- [PIL · Tables](https://www.lua.org/pil/12.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [data-structures](data-structures.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
