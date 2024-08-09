# 高阶函数

高阶函数是函数编程中的一个核心概念。在 Lua 中，高阶函数指的是能够接受其他函数作为参数或返回函数的函数。高阶函数提供了强大的功能，使得你可以编写更加抽象和灵活的代码。

## 1. 高阶函数的定义

高阶函数是一种能够操作函数的函数。它们可以接受函数作为参数，或者返回一个函数作为结果。这种能力使得高阶函数可以实现许多强大的编程模式，例如函数组合、函数式编程等。

### 作为参数的函数

高阶函数可以接受一个或多个函数作为参数，从而对这些函数进行操作或应用。

```lua
function applyFunction(f, x)
    return f(x)
end

local function square(n)
    return n * n
end

print(applyFunction(square, 5))  -- 输出 25
```

在这个例子中，`applyFunction` 是一个高阶函数，它接受一个函数 `f` 和一个值 `x` 作为参数，然后将 `f` 应用于 `x`。

### 作为返回值的函数

高阶函数可以返回另一个函数，使得你可以创建具有特定行为的函数工厂。

```lua
function makeAdder(x)
    return function(y)
        return x + y
    end
end

local addFive = makeAdder(5)
print(addFive(10))  -- 输出 15
```

在这个例子中，`makeAdder` 返回一个闭包，这个闭包可以将 `x` 和 `y` 相加。`addFive` 是一个通过 `makeAdder` 创建的函数，它将 5 添加到其参数上。

## 2. 高阶函数的应用

高阶函数在很多场景中都非常有用，以下是一些常见的应用场景：

### 函数组合

函数组合是将多个函数组合在一起进行链式调用的一种方式。

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
print(addOneAndSquare(4))  -- 输出 25
```

在这个例子中，`compose` 函数将两个函数 `f` 和 `g` 组合成一个新的函数。`addOneAndSquare` 是通过组合 `addOne` 和 `square` 得到的函数，它先对输入值加 1，然后对结果进行平方操作。

### 函数式编程

高阶函数是函数式编程的核心，允许你以函数的方式处理数据。

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
print(table.concat(evenNumbers, ", "))  -- 输出 2, 4
```

在这个例子中，`filter` 是一个高阶函数，它接受一个列表和一个谓词函数 `predicate` 作为参数，返回一个包含满足谓词的元素的列表。

## 3. 高阶函数的优势

### 代码重用

高阶函数能够帮助你编写更通用的代码，提高代码的重用性。通过将函数作为参数传递，你可以在不修改函数本身的情况下改变它的行为。

### 提高抽象层次

使用高阶函数可以提高代码的抽象层次，使得代码更加简洁和表达力强。它允许你在更高的层次上操作函数和数据，从而简化代码的复杂性。

### 支持函数式编程

高阶函数是函数式编程的基础，支持不可变数据、纯函数和函数组合等概念。通过高阶函数，你可以更容易地采用函数式编程的风格来解决问题。

## 4. 总结

高阶函数是函数编程中一个非常强大的工具，它使得函数能够作为参数传递或作为结果返回。通过使用高阶函数，你可以实现函数组合、函数式编程以及提高代码的重用性和抽象层次。掌握高阶函数的使用将有助于你编写更加灵活和高效的 Lua 代码。
