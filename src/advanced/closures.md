# 闭包（Closures）

闭包是函数编程中的一个重要概念。在 Lua 中，闭包指的是一个函数，它不仅能够访问自己内部的局部变量，还能访问其外部函数的局部变量。闭包的特性使得它能够保持对外部状态的引用，成为函数编程中非常强大的工具。

## 1. 闭包的定义

闭包是由一个函数和它的环境组成的。这个环境包括了函数定义时的局部变量。闭包能够访问和操作这些局部变量，即使外部函数已经返回，闭包依然能够保持对这些变量的访问权。

### 创建闭包

闭包是通过在一个函数内部定义另一个函数来创建的。内层函数可以访问外层函数的局部变量。

```lua
function makeCounter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local counter = makeCounter()
print(counter())  -- 输出 1
print(counter())  -- 输出 2
```

在这个例子中，`makeCounter` 函数返回一个内部函数，该内部函数是一个闭包。它能够访问 `makeCounter` 的局部变量 `count`，并且在每次调用时更新这个变量的值。

## 2. 闭包的特性

### 访问外部变量

闭包能够访问和修改其外部函数的局部变量。这使得闭包非常适合用来创建具有状态的函数。

```lua
function createMultiplier(factor)
    return function(x)
        return x * factor
    end
end

local double = createMultiplier(2)
print(double(5))  -- 输出 10
```

在这个例子中，`createMultiplier` 返回一个闭包，`factor` 是外部函数的局部变量，闭包能够记住并使用它。

### 状态保持

闭包可以保持其外部函数的状态，即使外部函数已经返回。这样，可以创建具有长期有效状态的函数。

```lua
function counter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local count1 = counter()
print(count1())  -- 输出 1
print(count1())  -- 输出 2

local count2 = counter()
print(count2())  -- 输出 1
```

在这个例子中，`counter` 函数返回了两个独立的闭包，每个闭包都有自己的 `count` 变量。调用 `count1` 和 `count2` 会分别维护它们自己的计数状态。

## 3. 闭包的应用

### 数据封装

闭包可以用来封装数据和功能，避免直接暴露数据到外部。

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
print(account.getBalance())  -- 输出 100
account.withdraw(30)
print(account.getBalance())  -- 输出 70
```

在这个例子中，`createBankAccount` 返回一个包含多个闭包的表，每个闭包都可以操作和访问 `balance`，但是 `balance` 对外部是不可见的。

### 函数工厂

使用闭包可以创建具有特定行为的函数工厂。

```lua
function makePower(exp)
    return function(base)
        return base ^ exp
    end
end

local square = makePower(2)
local cube = makePower(3)
print(square(4))  -- 输出 16
print(cube(2))    -- 输出 8
```

在这个例子中，`makePower` 函数返回了一个根据传入的 `exp` 参数创建的函数闭包。这些闭包能够计算不同的幂次。

## 4. 总结

闭包是 Lua 的一个强大特性，能够让函数访问和操作其外部函数的局部变量。通过闭包，你可以实现数据封装、创建具有状态的函数，以及生成特定行为的函数工厂。掌握闭包的使用将帮助你编写更加灵活和高效的 Lua 代码。