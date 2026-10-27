# Closures

In Lua, a closure is a function together with the local variables of its enclosing function that it references. Those variables do not vanish when the outer function returns; the closure keeps them alive.

## 1. Defining a Closure

A closure consists of a function and its environment, which holds the local variables visible at the point where the function is defined. After the outer function returns, those variables are still alive, and only the closure can reach them.

### Creating a Closure

A closure is created by defining one function inside another. The inner function can access the local variables of the outer function.

```lua
function makeCounter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local counter = makeCounter()
print(counter())  -- 1
print(counter())  -- 2
```

In this example, the `makeCounter` function returns an inner function, which is a closure. It can access `makeCounter`'s local variable `count` and updates that variable's value on each call.

## 2. Properties of Closures

### Accessing Outer Variables

A closure can access and modify the local variables of its enclosing function. This makes closures a good fit for creating functions that carry state.

```lua
function createMultiplier(factor)
    return function(x)
        return x * factor
    end
end

local double = createMultiplier(2)
print(double(5))  -- 10
```

In this example, `createMultiplier` returns a closure; `factor` is a local variable of the outer function, and the closure can remember and use it.

### Keeping State

A closure can keep the state of its enclosing function even after the outer function has returned. That way you can create functions with state that stays valid over the long run.

```lua
function counter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local count1 = counter()
print(count1())  -- 1
print(count1())  -- 2

local count2 = counter()
print(count2())  -- 1
```

In this example, the `counter` function returns two independent closures, each with its own `count` variable. Calling `count1` and `count2` maintains their own counting state separately.

## 3. Applying Closures

### Data Encapsulation

Closures can be used to encapsulate data and behavior, avoiding exposing data directly to the outside.

```lua
function createBankAccount()
    local balance = 0
    return {
        deposit = function(amount)
            balance = balance + amount
        end,
        withdraw = function(amount)
            balance = balance - amount
        end,
        getBalance = function()
            return balance
        end
    }
end

local account = createBankAccount()
account.deposit(100)
print(account.getBalance())  -- 100
account.withdraw(30)
print(account.getBalance())  -- 70
```

In this example, `createBankAccount` returns a table containing several closures. Each closure can operate on and access `balance`, but `balance` is not visible to the outside.

### Function Factories

Closures can be used to build function factories with specific behavior.

```lua
function makePower(exp)
    return function(base)
        return base ^ exp
    end
end

local square = makePower(2)
local cube = makePower(3)
print(square(4))  -- 16.0 (the result of the `^` operator is a float)
print(cube(2))    -- 8.0
```

In this example, the `makePower` function returns closures created according to the passed-in `exp` argument. Those closures can compute different powers.

## 4. Summary

Closures let a function carry its own state. Counters, factory functions, private data — they all rely on this one property.

## References

- [Lua 5.4 reference manual · 2.4 Statements](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Closure_(computer_programming)](https://en.wikipedia.org/wiki/Closure_(computer_programming))
- [Higher-order_function](https://en.wikipedia.org/wiki/Higher-order_function)
- [PIL · Functions](https://www.lua.org/pil/4.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [glossary](/glossary.md)
- [books](/knowledge/books.md)
- [core-concepts](/knowledge/core-concepts.md)