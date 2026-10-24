# Syntax

Lua's syntax is made up of a few blocks: data types, variables, operators, expressions, control structures and functions. This page goes through each one.

## 1. Data types

Lua mainly supports the following data types:

- Nil: the absence of a value.
- Boolean: true (`true`) and false (`false`).
- Number: a number, integer or floating point.
- String: text.
- Table: the primary data structure, used for arrays, dictionaries and so on.
- Function: a function.
- Userdata: user-defined data.
- Thread: a coroutine.

### Example

```lua
-- Nil
local var = nil

-- Boolean
local flag = true

-- Number
local num = 10
local float = 3.14

-- String
local str = "Hello, Lua!"

-- Table
local tbl = {name = "Lua", version = 5.4}

-- Function
local function greet(name)
    return "Hello, " .. name
end
```

## 2. Variables and assignment

In Lua, variables are declared and assigned dynamically, with no type annotation. A variable can be declared where you use it, and assigned with `=`.

### Example

```lua
-- Declare variables and assign
local x = 10
local y = 20

-- Multiple assignment
x, y = y, x
```

## 3. Operators and expressions

Lua supports several kinds of operators: arithmetic, relational and logical.

### Arithmetic operators

- `+`: addition
- `-`: subtraction
- `*`: multiplication
- `/`: division
- `%`: modulus
- `//`: integer division (rounds toward negative infinity)
- `^`: exponentiation

### Example

```lua
local a = 10
local b = 5
print(a + b)  -- 15
print(a * b)  -- 50
print(a ^ b)  -- 100000.0
```

### Relational operators

- `==`: equal to
- `~=`: not equal to
- `<`: less than
- `>`: greater than
- `<=`: less than or equal to
- `>=`: greater than or equal to

### Example

```lua
local x = 10
local y = 20
print(x == y)  -- false
print(x < y)   -- true
```

### Logical operators

- `and`: logical AND
- `or`: logical OR
- `not`: logical NOT

### Example

```lua
local a = true
local b = false
print(a and b)  -- false
print(a or b)   -- true
print(not a)    -- false
```

## 4. Control structures

Lua supports the usual control structures: conditionals and loops.

### Conditionals

Use `if-then-else` for branching.

### Example

```lua
local x = 10
if x > 0 then
    print("x is positive")
elseif x < 0 then
    print("x is negative")
else
    print("x is zero")
end
```

### Loops

Lua provides three main loop forms: `for`, `while` and `repeat-until`.

#### for loop

The numeric for loop walks a numeric range.

### Example

```lua
for i = 1, 5 do
    print(i)
end
```

The generic for loop iterates over the elements of a table.

### Example

```lua
local tbl = {10, 20, 30}
for _, value in ipairs(tbl) do
    print(value)
end
```

#### while loop

A while loop keeps running its body as long as the condition is true.

### Example

```lua
local x = 1
while x <= 5 do
    print(x)
    x = x + 1
end
```

#### repeat-until loop

A repeat-until loop runs its body first, then checks the condition, and only exits once it is true.

### Example

```lua
local x = 1
repeat
    print(x)
    x = x + 1
until x > 5
```

## 5. Defining and calling functions

Lua defines functions with the `function` keyword. Functions can return multiple values, and Lua supports anonymous functions and closures.

### Example

```lua
-- Define a function
local function add(a, b)
    return a + b
end

-- Call it
local result = add(10, 20)
print(result)  -- 30

-- Anonymous function
local function greet(name)
    return function()
        return "Hello, " .. name
    end
end

local sayHello = greet("World")
print(sayHello())  -- Hello, World
```

## Wrap-up

Eight data types, three operator families, three loops and one conditional — that is the skeleton of Lua syntax. The rest is practice.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [Lua 5.4 reference manual · 2.3 Operators](https://www.lua.org/manual/5.4/manual.html#2.3)
- [PIL · Lexical and Syntax Analysis](https://www.lua.org/pil/2.html)
- [Lexical_analysis](https://en.wikipedia.org/wiki/Lexical_analysis)

<!-- BACKLINKS-AUTO -->
## Related pages

- [setup](setup.md)
- [glossary](/glossary.md)
- [README](/knowledge/README.md)
- [books](/knowledge/books.md)
