# 高阶函数

高阶函数指的是接受其他函数作为参数、或返回函数的函数。函数能当值传，就有了这一层抽象。

## 1. 高阶函数的定义

它把"对函数的操作"本身也写成了函数。函数组合、`filter` 这类模式都建立在这上面。

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

常见的用法有函数组合，以及作为 `filter` 这类数据处理函数的基础。

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

把行为作为参数传进去，不修改函数本身就能改变它做的事。遍历和收集的样板代码写一次就够了，变化的部分交给传入的函数。

### 提高抽象层次

操作的对象从数据变成了"产生数据的步骤"。`compose` 把两个函数接成一个新函数，调用方不再关心拼接的细节。

### 支持函数式编程

函数式风格在 Lua 里主要靠它支撑：`filter` 接收一个谓词函数，筛选逻辑完全由调用方决定。

## 4. 总结

高阶函数就是"参数或返回值里有函数"的函数。函数组合、`filter` 这样的数据处理、`makeAdder` 这样的函数工厂，都靠它实现。
