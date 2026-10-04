# 基本语法

Lua 的语法由数据类型、变量、操作符、表达式、控制结构和函数这几块组成，这一节逐个过一遍。

## 1. 数据类型

Lua 主要支持以下几种数据类型：

- Nil：无值或不存在的值。
- Boolean：真（`true`）和假（`false`）。
- Number：数字，整数或浮点数。
- String：字符串。
- Table：主要数据结构，用来表示数组、字典等。
- Function：函数。
- Userdata：用户自定义数据。
- Thread：协程。

### 示例

```lua
-- Nil
local var = nil

-- Boolean
local flag = true

-- Number
local num = 10
local float = 3.14

-- String
local str = "Hello, Lua!"

-- Table
local tbl = {name = "Lua", version = 5.4}

-- Function
local function greet(name)
    return "Hello, " .. name
end
```

## 2. 变量和赋值

在 Lua 中，变量声明和赋值是动态的，不需要指定类型。变量可以在使用时声明，并可以使用 `=` 进行赋值。

### 示例

```lua
-- 声明变量并赋值
local x = 10
local y = 20

-- 多重赋值
x, y = y, x
```

## 3. 操作符和表达式

Lua 支持多种操作符，包括算术操作符、关系操作符和逻辑操作符。

### 算术操作符

- `+`：加法
- `-`：减法
- `*`：乘法
- `/`：除法
- `%`：取余
- `^`：乘方

### 示例

```lua
local a = 10
local b = 5
print(a + b)  -- 输出 15
print(a * b)  -- 输出 50
print(a ^ b)  -- 输出 100000.0
```

### 关系操作符

- `==`：等于
- `~=`：不等于
- `<`：小于
- `>`：大于
- `<=`：小于等于
- `>=`：大于等于

### 示例

```lua
local x = 10
local y = 20
print(x == y)  -- 输出 false
print(x < y)   -- 输出 true
```

### 逻辑操作符

- `and`：逻辑与
- `or`：逻辑或
- `not`：逻辑非

### 示例

```lua
local a = true
local b = false
print(a and b)  -- 输出 false
print(a or b)   -- 输出 true
print(not a)    -- 输出 false
```

## 4. 控制结构

Lua 支持基本的控制结构，包括条件语句和循环语句。

### 条件语句

使用 `if-then-else` 语句进行条件判断。

### 示例

```lua
local x = 10
if x > 0 then
    print("x is positive")
elseif x < 0 then
    print("x is negative")
else
    print("x is zero")
end
```

### 循环语句

Lua 提供了三种主要的循环结构：`for`、`while` 和 `repeat-until`。

#### for 循环

数值循环按数值范围走。

### 示例

```lua
for i = 1, 5 do
    print(i)
end
```

泛型循环用于遍历表中的元素。

### 示例

```lua
local tbl = {10, 20, 30}
for _, value in ipairs(tbl) do
    print(value)
end
```

#### while 循环

条件为真时，while 反复执行循环体。

### 示例

```lua
local x = 1
while x <= 5 do
    print(x)
    x = x + 1
end
```

#### repeat-until 循环

先执行循环体，再检查条件，直到条件为真才退出。

### 示例

```lua
local x = 1
repeat
    print(x)
    x = x + 1
until x > 5
```

## 5. 函数定义与调用

Lua 使用 `function` 关键字定义函数。函数可以具有多个返回值，并且支持匿名函数和闭包。

### 示例

```lua
-- 定义函数
local function add(a, b)
    return a + b
end

-- 调用函数
local result = add(10, 20)
print(result)  -- 输出 30

-- 匿名函数
local function greet(name)
    return function()
        return "Hello, " .. name
    end
end

local sayHello = greet("World")
print(sayHello())  -- 输出 Hello, World
```

## 结语

八种数据类型、三组操作符、三种循环和一种条件语句，这就是 Lua 语法的骨架，剩下的靠写。
