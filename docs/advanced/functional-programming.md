# 函数编程

函数在 Lua 里是一等公民：可以赋值给变量、当参数传、当返回值返回。这一页讲函数编程的三个核心概念：闭包、高阶函数和匿名函数。

## 1. 闭包（Closures）

闭包是一个函数，它能够访问其外部函数的局部变量。闭包在函数编程中非常重要，因为它允许你在函数外部保留和操作局部状态。

### 创建闭包

闭包是通过嵌套函数来实现的，内层函数可以访问外层函数的局部变量。

```lua
function createCounter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local counter = createCounter()
print(counter())  -- 输出 1
print(counter())  -- 输出 2
```

### 闭包的应用

闭包可以用来创建数据封装、实现工厂函数等。

```lua
function makeMultiplier(factor)
    return function(x)
        return x * factor
    end
end

local double = makeMultiplier(2)
print(double(5))  -- 输出 10
```

## 2. 高阶函数

高阶函数是指接受函数作为参数或返回函数的函数。高阶函数是函数编程的核心，能够使代码更加简洁和灵活。

### 作为参数的函数

函数可以作为其他函数的参数传递，用于处理不同的操作。

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
print(table.concat(squared, ", "))  -- 输出 1, 4, 9, 16
```

### 作为返回值的函数

函数可以返回其他函数，实现更加灵活的功能。

```lua
function createAdder(x)
    return function(y)
        return x + y
    end
end

local add5 = createAdder(5)
print(add5(10))  -- 输出 15
```

## 3. 匿名函数

匿名函数是没有名称的函数，可以在需要函数作为参数的地方直接创建和使用。

### 创建匿名函数

匿名函数可以用于临时操作，例如作为函数参数传递。

```lua
local numbers = {1, 2, 3, 4}
local result = map(numbers, function(x) return x * 2 end)
print(table.concat(result, ", "))  -- 输出 2, 4, 6, 8
```

### 匿名函数的应用

匿名函数常用于临时操作、事件处理等场景。

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
print(table.concat(even, ", "))  -- 输出 2, 4
```

## 4. 总结

闭包把状态留在函数里，高阶函数把行为当参数传，匿名函数省掉不必要的命名。三者组合起来，就是 Lua 里函数编程的基础。
