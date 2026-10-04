# 匿名函数

匿名函数（Anonymous Functions）是没有名字的函数，也称为 Lambda 函数。它适合那种只用一次、不值得单独命名的小函数：定义完就地传出去，或者赋给一个变量。

## 1. 匿名函数的定义

匿名函数的语法与普通函数类似，但是它没有名字。你可以直接在函数定义时将其传递给其他函数或赋值给变量。

### 基本用法

```lua
local result = (function(x, y)
    return x + y
end)(10, 20)

print(result)  -- 输出 30
```

在这个例子中，匿名函数定义了两个参数 `x` 和 `y`，并返回它们的和。函数被直接调用，并传入了参数 10 和 20，结果为 30。

### 赋值给变量

```lua
local multiply = function(x, y)
    return x * y
end

print(multiply(5, 6))  -- 输出 30
```

在这个例子中，匿名函数被赋值给变量 `multiply`，然后可以通过 `multiply` 变量来调用该函数。

## 2. 匿名函数的应用

匿名函数最常见的用途，是定义只用一次的函数。典型的场景有回调、高阶函数的参数和事件处理。

### 回调函数

匿名函数常用于回调函数中，特别是在异步编程和事件处理的场景中。

```lua
local function performAction(action)
    action()
end

performAction(function()
    print("Action performed!")
end)  -- 输出 Action performed!
```

在这个例子中，`performAction` 函数接受一个回调函数 `action`，并在内部调用它。传递的匿名函数在调用时会输出 "Action performed!"。

### 函数式编程

在函数式编程中，匿名函数经常用于高阶函数，如 `map`、`filter` 和 `reduce`。

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
print(table.concat(squaredNumbers, ", "))  -- 输出 1, 4, 9, 16, 25
```

在这个例子中，`map` 函数接受一个列表 `tbl` 和一个函数 `func`，将 `func` 应用于列表中的每个元素。匿名函数用于定义如何对每个元素进行平方操作。

### 事件处理

匿名函数常用于事件处理程序中，如在用户界面编程中。

```lua
local function onClick(callback)
    -- 模拟按钮点击事件
    callback()
end

onClick(function()
    print("Button clicked!")
end)  -- 输出 Button clicked!
```

在这个例子中，`onClick` 函数接受一个回调函数 `callback`，并在事件发生时调用它。传递的匿名函数会输出 "Button clicked!"。

## 3. 匿名函数的优势

### 简洁和灵活

函数在哪里用，就在哪里定义，不用先声明一个命名函数再引用它。简单的操作一行就能写完。

### 函数式编程支持

没有匿名函数，`map`、`filter` 这类高阶函数每次都得先给要传入的逻辑起个名字。有了它，函数作为参数传递才顺手。

### 临时性使用

只在局部用一次的函数，没有必要给它起名字。少一个名字，就少一处要维护的东西。

## 4. 总结

匿名函数和普通函数在 Lua 里是同一种东西，只是定义时不绑定名字。回调、高阶函数的参数、事件处理器，这些只用一次的函数用匿名形式最省事。