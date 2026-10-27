# Higher-Order Functions

A higher-order function is a function that takes other functions as parameters, or returns a function. Because functions can be passed around as values, this layer of abstraction exists.

## 1. Defining Higher-Order Functions

It turns "operating on functions" into a function as well. Patterns like function composition and `filter` are built on top of this.

### Functions as Parameters

A higher-order function can accept one or more functions as parameters and operate on or apply them.

```lua
function applyFunction(f, x)
    return f(x)
end

local function square(n)
    return n * n
end

print(applyFunction(square, 5))  -- 25
```

In this example, `applyFunction` is a higher-order function: it takes a function `f` and a value `x` as parameters, then applies `f` to `x`.

### Functions as Return Values

A higher-order function can return another function, so it can be used to create function factories with specific behavior.

```lua
function makeAdder(x)
    return function(y)
        return x + y
    end
end

local addFive = makeAdder(5)
print(addFive(10))  -- 15
```

In this example, `makeAdder` returns a closure that adds `x` and `y`. `addFive` is a function created through `makeAdder`; it adds 5 to its argument.

## 2. Applications of Higher-Order Functions

Common uses include function composition and serving as the foundation for data-processing functions like `filter`.

### Function Composition

Function composition is a way to combine multiple functions together for chained calls.

```lua
function compose(f, g)
    return function(x)
        return f(g(x))
    end
end

local function addOne(n)
    return n + 1
end

local function square(n)
    return n * n
end

local addOneAndSquare = compose(square, addOne)
print(addOneAndSquare(4))  -- 25
```

In this example, the `compose` function combines two functions, `f` and `g`, into a new function. `addOneAndSquare` is the function obtained by composing `addOne` and `square`: it first adds 1 to the input value, then squares the result.

### Functional Programming

Higher-order functions are at the core of functional programming, letting you process data in a functional style.

```lua
function filter(tbl, predicate)
    local result = {}
    for _, value in ipairs(tbl) do
        if predicate(value) then
            table.insert(result, value)
        end
    end
    return result
end

local numbers = {1, 2, 3, 4, 5}
local evenNumbers = filter(numbers, function(n) return n % 2 == 0 end)
print(table.concat(evenNumbers, ", "))  -- 2, 4
```

In this example, `filter` is a higher-order function: it takes a list and a predicate function `predicate` as parameters, and returns a list containing the elements that satisfy the predicate.

## 3. Advantages of Higher-Order Functions

### Code Reuse

Pass behavior in as a parameter and you can change what a function does without modifying the function itself. The boilerplate for iterating and collecting is written once; the varying part is handed to the passed-in function.

### Higher Level of Abstraction

The object being operated on shifts from data to "the steps that produce data." `compose` stitches two functions into a new one, so callers no longer care about the details of the stitching.

### Supports Functional Programming

The functional style in Lua is carried mainly by this: `filter` takes a predicate function, and the filtering logic is decided entirely by the caller.

## 4. Summary

A higher-order function is a function that has a function as a parameter or return value. Function composition, data processing like `filter`, and function factories like `makeAdder` all rely on it.

## References

- [Lua 5.4 reference manual · 2.4 Statements](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Higher-order_function](https://en.wikipedia.org/wiki/Higher-order_function)
- [First-class_function](https://en.wikipedia.org/wiki/First-class_function)
- [Partial_application](https://en.wikipedia.org/wiki/Partial_application)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)