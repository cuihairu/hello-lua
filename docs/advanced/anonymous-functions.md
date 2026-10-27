# Anonymous functions

Anonymous functions are functions without a name, also called lambda functions. They are a good fit for small functions used only once, not worth naming on their own: define them and pass them off right where you need them, or assign them to a variable.

## 1. Defining anonymous functions

The syntax for an anonymous function is similar to that of a regular function, but it has no name. When defining one, you can pass the anonymous function directly to another function, or assign it to a variable.

### Basic usage

```lua
local result = (function(x, y)
    return x + y
end)(10, 20)

print(result)  -- output 30
```

In this example, the anonymous function defines two parameters, `x` and `y`, and returns their sum. The function is called immediately, with the arguments 10 and 20, giving a result of 30.

### Assigning to a variable

```lua
local multiply = function(x, y)
    return x * y
end

print(multiply(5, 6))  -- output 30
```

In this example, the anonymous function is assigned to the variable `multiply`, and can then be called through the `multiply` variable.

## 2. Uses of anonymous functions

The most common use for anonymous functions is defining a function that is only used once. Typical scenarios include callbacks, arguments to higher-order functions, and event handlers.

### Callback functions

Anonymous functions are often used as callbacks, particularly in async programming and event handling.

```lua
local function performAction(action)
    action()
end

performAction(function()
    print("Action performed!")
end)  -- output Action performed!
```

In this example, the `performAction` function takes a callback `action` and calls it internally. The anonymous function passed in prints "Action performed!" when called.

### Functional programming

In functional programming, anonymous functions are frequently used with higher-order functions such as `map`, `filter`, and `reduce`.

```lua
local function map(tbl, func)
    local result = {}
    for i, v in ipairs(tbl) do
        result[i] = func(v)
    end
    return result
end

local numbers = {1, 2, 3, 4, 5}
local squaredNumbers = map(numbers, function(x) return x * x end)
print(table.concat(squaredNumbers, ", "))  -- output 1, 4, 9, 16, 25
```

In this example, the `map` function takes a list `tbl` and a function `func`, and applies `func` to every element of the list. The anonymous function defines how each element is squared.

### Event handling

Anonymous functions are commonly used in event handlers, such as in user interface programming.

```lua
local function onClick(callback)
    -- simulate a button click event
    callback()
end

onClick(function()
    print("Button clicked!")
end)  -- output Button clicked!
```

In this example, the `onClick` function takes a callback `callback` and calls it when the event fires. The anonymous function passed in prints "Button clicked!".

## 3. Advantages of anonymous functions

### Concise and flexible

Define a function right where you use it, without first declaring a named function and then referencing it. Simple operations can be written in a single line.

### Functional programming support

Without anonymous functions, every higher-order function like `map` or `filter` would require you to name the logic you want to pass in first. With them, passing functions as arguments becomes a natural fit.

### One-off use

A function used only once in a local scope does not need a name. One fewer name means one fewer thing to maintain.

## 4. Summary

Anonymous functions and regular functions are the same thing in Lua, except that no name is bound at definition time. For callbacks, arguments to higher-order functions, and event handlers, the anonymous form is the most convenient for these one-off functions.

## References

- [Lua 5.4 reference manual · 2.4 Basic Functions](https://www.lua.org/manual/5.4/manual.html#2.4)
- [First-class_function](https://en.wikipedia.org/wiki/First-class_function)
- [Closure_(computer_programming)](https://en.wikipedia.org/wiki/Closure_(computer_programming))

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
