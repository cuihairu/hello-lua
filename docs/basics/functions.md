# Defining and Calling Functions

A function packages a block of code into something reusable: it takes parameters and returns values. This section goes from definition through closures and variadic arguments.

## 1. Defining functions

Lua defines functions with the `function` keyword. A definition has a name, a parameter list and a body.

### Basic definition

```lua
function greet(name)
    print("Hello, " .. name)
end
```

This defines a function called `greet` that takes one parameter, `name`, and prints a greeting.

### A function with a return value

A function can return one or more values, using the `return` keyword.

```lua
function add(a, b)
    return a + b
end

local sum = add(10, 5)
print(sum)  -- 15
```

### Multiple return values

A function can return several values, separated by commas.

```lua
function divide(a, b)
    return a // b, a % b
end

local quotient, remainder = divide(10, 3)
print(quotient, remainder)  -- 3 1
```

## 2. Calling functions

In Lua a function call consists of the function name and a parameter list.

### Basic call

```lua
greet("Lua")  -- calls greet, prints "Hello, Lua"
```

### Using the return value

```lua
local result = add(3, 4)
print(result)  -- 7
```

## 3. Anonymous functions

Lua also supports anonymous functions — functions without a name — which are handy for one-off uses.

### Example

```lua
local functionList = {
    function(x) return x * x end,      -- square
    function(x) return x * x * x end   -- cube
}

local square = functionList[1](5)
local cube = functionList[2](3)
print(square)  -- 25
print(cube)    -- 27
```

## 4. Functions as parameters

In Lua a function can be passed as an argument to another function.

### Example

```lua
function applyFunction(func, value)
    return func(value)
end

local function double(x)
    return x * 2
end

print(applyFunction(double, 5))  -- 10
```

## 5. Closures

Lua supports closures: a function can capture and keep the environment of its outer variables.

### Example

```lua
function createCounter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local counter = createCounter()
print(counter())  -- 1
print(counter())  -- 2
```

## 6. Variadic arguments

Lua lets a function accept a variable number of arguments, written as `...`.

### Example

```lua
function printArgs(...)
    local args = {...}
    for i, v in ipairs(args) do
        print(i, v)
    end
end

printArgs("a", "b", "c")
-- output
-- 1	a
-- 2	b
-- 3	c
```

## Wrap-up

Lua functions support multiple return values, anonymous functions, closures and variadic `...` arguments — and defining one takes a single keyword: `function`.

## References

- [Lua 5.4 reference manual · 2.4 Functions](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Closure_(computer_programming)](https://en.wikipedia.org/wiki/Closure_(computer_programming))
- [Higher-order_function](https://en.wikipedia.org/wiki/Higher-order_function)
- [PIL · Functions](https://www.lua.org/pil/4.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
