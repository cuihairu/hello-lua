# 字符串处理

Lua 的内置字符串函数覆盖了拼接、截取、查找、格式化、大小写转换这些日常操作，下面逐个过。

## 1. 基本字符串操作

### 字符串连接

使用 `..` 操作符可以将多个字符串连接成一个新的字符串。

```lua
local s1 = "Hello"
local s2 = "World"
local result = s1 .. " " .. s2
print(result)  -- 输出 "Hello World"
```

### 字符串长度

使用 `#` 操作符获取字符串的长度。

```lua
local s = "Hello World"
print(#s)  -- 输出 11
```

### 子字符串提取

使用 `string.sub` 函数提取子字符串。

```lua
local s = "Hello World"
local substr = string.sub(s, 1, 5)
print(substr)  -- 输出 "Hello"
```

### 字符串替换

使用 `string.gsub` 函数进行字符串替换。

```lua
local s = "Hello World"
local new_s = string.gsub(s, "World", "Lua")
print(new_s)  -- 输出 "Hello Lua"
```

## 2. 字符串格式化

Lua 提供了 `string.format` 函数用于格式化字符串。

```lua
local name = "Alice"
local age = 30
local formatted = string.format("Name: %s, Age: %d", name, age)
print(formatted)  -- 输出 "Name: Alice, Age: 30"
```

### 常用格式符

- `%s` - 字符串
- `%d` - 整数
- `%f` - 浮点数

## 3. 字符串查找与匹配

### 查找子字符串

使用 `string.find` 函数查找子字符串的位置。

```lua
local s = "Hello World"
local start_pos, end_pos = string.find(s, "World")
print(start_pos, end_pos)  -- 输出 7 11
```

### 字符串匹配

使用 `string.match` 函数从字符串中提取匹配的子字符串。

```lua
local s = "Hello World"
local match = string.match(s, "World")
print(match)  -- 输出 "World"
```

### 正则表达式匹配

`string.match` 和 `string.gmatch` 函数支持 Lua 的模式匹配语法。

```lua
local s = "Hello 123 World 456"
for num in string.gmatch(s, "%d+") do
    print(num)  -- 输出 123 和 456
end
```

## 4. 字符串分割与合并

### 字符串分割

Lua 没有内置的字符串分割函数，但可以使用 `string.gmatch` 和模式来实现。

```lua
local s = "apple,banana,orange"
for fruit in string.gmatch(s, "([^,]+)") do
    print(fruit)
end
-- 输出
-- apple
-- banana
-- orange
```

### 字符串合并

使用 `table.concat` 函数合并多个字符串。

```lua
local fruits = {"apple", "banana", "orange"}
local s = table.concat(fruits, ", ")
print(s)  -- 输出 "apple, banana, orange"
```

## 5. 字符串转换

### 转换为大写或小写

使用 `string.upper` 和 `string.lower` 函数进行大小写转换。

```lua
local s = "Hello World"
print(string.upper(s))  -- 输出 "HELLO WORLD"
print(string.lower(s))  -- 输出 "hello world"
```

## 6. 字符串与模式匹配

Lua 的模式匹配语法类似于正则表达式，但不完全相同，用来做复杂的匹配和提取。

### 常见模式

- `.` - 匹配任何单个字符
- `%a` - 匹配任何字母字符
- `%d` - 匹配任何数字字符
- `%s` - 匹配任何空白字符
- `%w` - 匹配任何字母或数字字符

### 示例：提取电子邮件地址

```lua
local s = "Contact us at support@example.com"
local email = string.match(s, "%S+@%S+")
print(email)  -- 输出 "support@example.com"
```

## 7. 总结

拼接 `..`、取长度 `#`、查找 `string.find`、提取 `string.match`、拆分靠 `string.gmatch`、合并靠 `table.concat`、格式化走 `string.format`。日常处理文本，翻来覆去就是这几个函数。