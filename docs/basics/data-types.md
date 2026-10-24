# Data Types

Lua is dynamically typed: a variable's type is decided at runtime. This page goes through the eight basic data types one at a time.

## 1. Nil

`nil` is a special type in Lua, meaning "no value". It is usually used for a variable that was never assigned, or a function that returned nothing.

### Example

```lua
local var = nil
print(var)  -- nil
```

## 2. Boolean

The boolean type holds the logical values `true` and `false`. It is used in conditionals and logical operations.

### Example

```lua
local isTrue = true
local isFalse = false
print(isTrue)  -- true
print(isFalse) -- false
```

## 3. Number

`number` represents numeric values, both integers and floating point. From Lua 5.3 on, `number` splits into `integer` and `float`. In Lua 5.1 and 5.2 every number was a float.

### Example

```lua
local integer = 42
local float = 3.14
print(integer)  -- 42
print(float)    -- 3.14
```

## 4. String

`string` holds text. Lua strings are immutable — once created, a string cannot be changed. Strings can be written with single quotes (`'`), double quotes (`"`), or the long-string syntax (`[[` and `]]`).

### Example

```lua
local singleQuoteStr = 'Hello, Lua!'
local doubleQuoteStr = "Hello, Lua!"
local longStr = [[
This is a long string
that spans multiple lines.
]]
print(singleQuoteStr)  -- Hello, Lua!
print(doubleQuoteStr)  -- Hello, Lua!
print(longStr)         -- a long string
```

## 5. Table

`table` is Lua's main data structure, used for arrays, dictionaries and the like. It can hold values of any type, including other tables. It is Lua's only data structure, and is what objects, collections and more complex structures are all built from.

### Example

```lua
-- An empty table
local tbl = {}

-- A table with initial values
local person = {
    name = "Lua",
    version = 5.4,
    isDynamic = true
}

-- Read a field
print(person.name)       -- Lua
print(person["version"]) -- 5.4

-- Change a field
person.name = "Lua 5.4"
print(person.name)       -- Lua 5.4

-- Nested tables
local nestedTable = {
    numbers = {1, 2, 3},
    details = {name = "Lua", version = 5.4}
}
print(nestedTable.details.name) -- Lua
```

## 6. Function

`function` is the type of a function. Functions are first-class values in Lua: they can be passed as variables, stored as table fields, and returned as results. They are defined with the `function` keyword.

### Example

```lua
-- Define a function
local function add(a, b)
    return a + b
end

-- Call it
local result = add(10, 20)
print(result)  -- 30
```

## 7. Userdata

`userdata` represents user-defined data and is the bridge to C. It lets Lua hold a reference to a C data structure so C code and Lua can work together.

### Example

```lua
-- Creating and using userdata means going through the C API
-- No example here: it requires C code on the other side.
```

## 8. Thread

`thread` is the type of a coroutine. A coroutine is Lua's lightweight thread, and you switch execution between them explicitly. It is the basis for concurrency and async-style code in Lua.

### Example

```lua
-- Create a coroutine
local co = coroutine.create(function ()
    for i = 1, 5 do
        print(i)
        coroutine.yield()
    end
end)

-- Drive it
for i = 1, 5 do
    coroutine.resume(co)
end
```

## Wrap-up

Of the eight types, only `table` can hold other values. The rest are either atomic values — `nil`, `boolean`, `number`, `string` — or execution units: `function`, `userdata`, `thread`.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [First-class_function](https://en.wikipedia.org/wiki/First-class_function)
- [Dynamic_typing](https://en.wikipedia.org/wiki/Dynamic_typing)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [books](/knowledge/books.md)
- [core-concepts](/knowledge/core-concepts.md)
