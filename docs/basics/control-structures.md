# 控制结构

在 Lua 中，控制结构用于控制程序的执行流程。常见的控制结构包括条件语句、循环语句和迭代器。掌握这些控制结构有助于你编写出逻辑清晰且功能强大的 Lua 程序。

## 1. 条件语句

条件语句用于根据条件的真伪来决定执行不同的代码块。Lua 提供了 `if-then-else` 语句来实现条件判断。

### `if-then`

```lua
local age = 18

if age >= 18 then
    print("成年人")
end
```

### `if-then-else`

```lua
local age = 16

if age >= 18 then
    print("成年人")
else
    print("未成年人")
end
```

### `if-then-elseif-else`

```lua
local score = 85

if score >= 90 then
    print("优秀")
elseif score >= 80 then
    print("良好")
elseif score >= 60 then
    print("及格")
else
    print("不及格")
end
```

## 2. 循环语句

循环语句用于重复执行某段代码，直到满足某个条件为止。Lua 提供了多种循环结构，包括 `while` 循环、`repeat-until` 循环和 `for` 循环。

### `while` 循环

`while` 循环在条件为真时重复执行代码块。

```lua
local i = 1

while i <= 5 do
    print(i)
    i = i + 1
end
```

### `repeat-until` 循环

`repeat-until` 循环至少执行一次代码块，然后在每次循环结束时检查条件。

```lua
local i = 1

repeat
    print(i)
    i = i + 1
until i > 5
```

### `for` 循环

`for` 循环有两种形式：数值 `for` 和泛型 `for`。

#### 数值 `for` 循环

数值 `for` 循环用于迭代一系列数值。

```lua
for i = 1, 5 do
    print(i)
end
```

#### 泛型 `for` 循环

泛型 `for` 循环用于遍历表中的元素。

```lua
local fruits = {"apple", "banana", "cherry"}

for index, fruit in ipairs(fruits) do
    print(index, fruit)
end
```

## 3. 控制流控制

Lua 提供了几个关键字用于控制循环的流动：`break` 和 `return`。

### `break`

`break` 语句用于跳出当前的循环。

```lua
for i = 1, 10 do
    if i == 5 then
        break
    end
    print(i)
end
```

### `return`

`return` 语句用于从函数中返回，并可选择性地返回一个值。

```lua
local function greet(name)
    return "Hello, " .. name
end

local message = greet("Lua")
print(message)  -- 输出 Hello, Lua
```

## 4. 多重控制结构

在实际应用中，控制结构常常嵌套使用，以实现更复杂的逻辑。

### 示例

```lua
local temperature = 25
local isRaining = true

if temperature > 20 then
    if isRaining then
        print("天气温暖但有雨，建议带伞")
    else
        print("天气温暖，适合外出")
    end
else
    print("天气较冷，建议穿暖和些")
end
```

## 结语

控制结构是编程中的核心概念，它们帮助我们控制程序的执行流程。通过掌握条件判断和循环控制，你可以在 Lua 中实现复杂的逻辑和算法。了解并熟练使用这些控制结构，将使你的 Lua 编程更高效且功能更强大。