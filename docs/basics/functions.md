# 函数定义与调用

函数把一段代码封装成可复用的块，接受参数、返回值。这一节从定义讲到闭包和可变参数。

## 1. 函数定义

在 Lua 中，你可以使用 `function` 关键字来定义函数。函数定义包括函数名、参数列表以及函数体。

### 基本函数定义

```lua
function greet(name)
    print("Hello, " .. name)
end
```

这里定义了名为 `greet` 的函数，它接受一个参数 `name`，打印一条问候消息。

### 带返回值的函数

函数可以返回一个或多个值。使用 `return` 关键字来返回值。

```lua
function add(a, b)
    return a + b
end

local sum = add(10, 5)
print(sum)  -- 输出 15
```

### 多个返回值

函数可以返回多个值，用逗号分隔。

```lua
function divide(a, b)
    return a // b, a % b
end

local quotient, remainder = divide(10, 3)
print(quotient, remainder)  -- 输出 3 1
```

## 2. 函数调用

在 Lua 中，函数调用通过函数名和参数列表完成。

### 基本函数调用

```lua
greet("Lua")  -- 调用 greet 函数，输出 "Hello, Lua"
```

### 使用函数返回值

```lua
local result = add(3, 4)
print(result)  -- 输出 7
```

## 3. 匿名函数

Lua 还支持匿名函数（没有名字的函数），它们通常用于需要一次性使用的情况。

### 匿名函数示例

```lua
local functionList = {
    function(x) return x * x end,      -- 计算平方
    function(x) return x * x * x end   -- 计算立方
}

local square = functionList[1](5)
local cube = functionList[2](3)
print(square)  -- 输出 25
print(cube)    -- 输出 27
```

## 4. 函数作为参数

在 Lua 中，函数可以作为参数传递给其他函数。

### 示例

```lua
function applyFunction(func, value)
    return func(value)
end

local function double(x)
    return x * 2
end

print(applyFunction(double, 5))  -- 输出 10
```

## 5. 闭包

Lua 支持闭包（closure），即函数可以捕获并保存其外部变量的环境。

### 闭包示例

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

## 6. 可变参数

Lua 允许函数接受可变数量的参数。使用 `...` 可以表示可变参数。

### 示例

```lua
function printArgs(...)
    local args = {...}
    for i, v in ipairs(args) do
        print(i, v)
    end
end

printArgs("a", "b", "c")
-- 输出
-- 1	a
-- 2	b
-- 3	c
```

## 结语

Lua 的函数支持多返回值、匿名函数、闭包和 `...` 可变参数，而定义只需要一个关键字：`function`。
