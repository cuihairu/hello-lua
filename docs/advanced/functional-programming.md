# Functional Programming

In Lua, functions are first-class citizens: they can be assigned to variables, passed as arguments, and returned as return values. This page covers three core concepts of functional programming: closures, higher-order functions, and anonymous functions.

## 1. Closures

A closure is a function that can access the local variables of its enclosing function. Closures are very important in functional programming, because they let you keep and manipulate local state outside of the function.

### Creating Closures

Closures are implemented with nested functions; the inner function can access the local variables of the outer function.

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

### Applying Closures

Closures can be used for data encapsulation, factory functions, and more.

```lua
function makeMultiplier(factor)
    return function(x)
        return x * factor
    end
end

local double = makeMultiplier(2)
print(double(5))  -- 10
```

## 2. Higher-Order Functions

A higher-order function is one that takes a function as an argument or returns a function. Higher-order functions are the core of functional programming and make code more concise and flexible.

### Functions as Arguments

Functions can be passed as arguments to other functions to handle different operations.

```lua
function map(tbl, func)
    local new_tbl = {}
    for i, v in ipairs(tbl) do
        new_tbl[i] = func(v)
    end
    return new_tbl
end

local numbers = {1, 2, 3, 4}
local squared = map(numbers, function(x) return x * x end)
print(table.concat(squared, ", "))  -- 1, 4, 9, 16
```

### Functions as Return Values

Functions can return other functions, enabling more flexible behavior.

```lua
function createAdder(x)
    return function(y)
        return x + y
    end
end

local add5 = createAdder(5)
print(add5(10))  -- 15
```

## 3. Anonymous Functions

An anonymous function is a function without a name, which can be created and used directly wherever a function is expected as an argument.

### Creating Anonymous Functions

Anonymous functions can be used for temporary operations, for example when passing them as a function argument.

```lua
local numbers = {1, 2, 3, 4}
local result = map(numbers, function(x) return x * 2 end)
print(table.concat(result, ", "))  -- 2, 4, 6, 8
```

### Applying Anonymous Functions

Anonymous functions are commonly used for temporary operations, event handling, and similar scenarios.

```lua
local function filter(tbl, predicate)
    local result = {}
    for i, v in ipairs(tbl) do
        if predicate(v) then
            table.insert(result, v)
        end
    end
    return result
end

local numbers = {1, 2, 3, 4, 5}
local even = filter(numbers, function(x) return x % 2 == 0 end)
print(table.concat(even, ", "))  -- 2, 4
```

## 4. Summary

Closures keep state inside a function, higher-order functions pass behavior as an argument, and anonymous functions skip unnecessary naming. Put the three together and you have the foundation of functional programming in Lua.

## References

- [Lua 5.4 reference manual · 2.4 Statements](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Functional_programming](https://en.wikipedia.org/wiki/Functional_programming)
- [First-class_function](https://en.wikipedia.org/wiki/First-class_function)
- [Higher-order_function](https://en.wikipedia.org/wiki/Higher-order_function)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)