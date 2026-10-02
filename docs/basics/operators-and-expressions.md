# 操作符和表达式

在 Lua 中，操作符用于对数据进行操作和计算，表达式则是由操作符和操作数组成的代码段，用于生成值。了解 Lua 的操作符和表达式的用法是编写 Lua 脚本的基础。

## 1. 算术操作符

算术操作符用于执行数学运算。Lua 提供了基本的算术操作符，包括加法、减法、乘法、除法和取余。

### 加法 (`+`)

```lua
local a = 10
local b = 5
local sum = a + b
print(sum)  -- 输出 15
```

### 减法 (`-`)

```lua
local a = 10
local b = 5
local difference = a - b
print(difference)  -- 输出 5
```

### 乘法 (`*`)

```lua
local a = 10
local b = 5
local product = a * b
print(product)  -- 输出 50
```

### 除法 (`/`)

```lua
local a = 10
local b = 5
local quotient = a / b
print(quotient)  -- 输出 2.0
```

### 取余 (`%`)

```lua
local a = 10
local b = 3
local remainder = a % b
print(remainder)  -- 输出 1
```

## 2. 比较操作符

比较操作符用于比较两个值的大小或相等性，并返回布尔值（`true` 或 `false`）。

### 相等 (`==`)

```lua
local a = 10
local b = 5
print(a == b)  -- 输出 false
```

### 不相等 (`~=`)

```lua
local a = 10
local b = 5
print(a ~= b)  -- 输出 true
```

### 大于 (`>`)

```lua
local a = 10
local b = 5
print(a > b)  -- 输出 true
```

### 小于 (`<`)

```lua
local a = 10
local b = 5
print(a < b)  -- 输出 false
```

### 大于等于 (`>=`)

```lua
local a = 10
local b = 5
print(a >= b)  -- 输出 true
```

### 小于等于 (`<=`)

```lua
local a = 10
local b = 5
print(a <= b)  -- 输出 false
```

## 3. 逻辑操作符

逻辑操作符用于处理布尔值和逻辑运算。

### 与 (`and`)

```lua
local a = true
local b = false
print(a and b)  -- 输出 false
```

### 或 (`or`)

```lua
local a = true
local b = false
print(a or b)  -- 输出 true
```

### 非 (`not`)

```lua
local a = true
print(not a)  -- 输出 false
```

## 4. 连接操作符

连接操作符用于将字符串连接在一起。

### 字符串连接 (`..`)

```lua
local firstName = "Lua"
local lastName = "Programming"
local fullName = firstName .. " " .. lastName
print(fullName)  -- 输出 Lua Programming
```

## 5. 关系操作符

关系操作符用于对比两个值，并返回布尔值（`true` 或 `false`）。

### 赋值操作 (`=`)

```lua
local a = 10
local b = 5
a = b  -- 将 b 的值赋给 a
print(a)  -- 输出 5
```

## 6. 综合表达式

表达式可以由多个操作符和操作数组成，执行复杂的计算和逻辑判断。

### 示例

```lua
local a = 10
local b = 5
local c = 2
local result = (a + b) * c / (b - c)
print(result)  -- 输出 20.0
```

## 结语

掌握 Lua 的操作符和表达式对于进行数据处理、条件判断和执行计算至关重要。通过熟练运用这些操作符，你可以在 Lua 脚本中实现各种功能，提升编程效率和代码质量。
