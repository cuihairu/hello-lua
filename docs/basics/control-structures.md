# Control Structures

Lua's control structures fall into three groups: conditionals, loops, and the keywords that alter control flow.

## 1. Conditionals

Conditionals run different blocks of code depending on whether a test is true. Lua provides `if-then-else` for this.

### `if-then`

```lua
local age = 18

if age >= 18 then
    print("adult")
end
```

### `if-then-else`

```lua
local age = 16

if age >= 18 then
    print("adult")
else
    print("minor")
end
```

### `if-then-elseif-else`

```lua
local score = 85

if score >= 90 then
    print("excellent")
elseif score >= 80 then
    print("good")
elseif score >= 60 then
    print("pass")
else
    print("fail")
end
```

## 2. Loops

Loops repeat a block of code until some condition holds. Lua offers several forms: `while`, `repeat-until` and `for`.

### `while`

A `while` loop repeats the block as long as the condition is true.

```lua
local i = 1

while i <= 5 do
    print(i)
    i = i + 1
end
```

### `repeat-until`

A `repeat-until` loop runs the block at least once, then checks the condition at the end of each pass.

```lua
local i = 1

repeat
    print(i)
    i = i + 1
until i > 5
```

### `for`

There are two forms: numeric `for` and generic `for`.

#### Numeric `for`

A numeric `for` iterates over a range of numbers.

```lua
for i = 1, 5 do
    print(i)
end
```

#### Generic `for`

A generic `for` iterates over the elements of a table.

```lua
local fruits = {"apple", "banana", "cherry"}

for index, fruit in ipairs(fruits) do
    print(index, fruit)
end
```

## 3. break and return

Two keywords alter control flow: `break` and `return`.

### `break`

`break` exits the current loop.

```lua
for i = 1, 10 do
    if i == 5 then
        break
    end
    print(i)
end
```

### `return`

`return` exits a function, optionally with a value.

```lua
local function greet(name)
    return "Hello, " .. name
end

local message = greet("Lua")
print(message)  -- Hello, Lua
```

## 4. Nested control structures

In practice control structures are often nested to build more involved logic.

### Example

```lua
local temperature = 25
local isRaining = true

if temperature > 20 then
    if isRaining then
        print("warm but rainy, bring an umbrella")
    else
        print("warm and clear, good for going out")
    end
else
    print("cool out, dress warmer")
end
```

## Wrap-up

`if` for branching, `for`, `while` and `repeat-until` for repetition, `break` to leave a loop early, and `return` to leave a function.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [PIL · Lexical and Syntax Analysis](https://www.lua.org/pil/2.html)
- [Goto](https://en.wikipedia.org/wiki/Goto)

<!-- BACKLINKS-AUTO -->
## Related pages

- [core-concepts](/knowledge/core-concepts.md)
