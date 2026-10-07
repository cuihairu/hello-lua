### Lua的编码规范

风格管的是代码长什么样，编码规范管的是怎么写才不容易出错。下面按命名、格式、注释、作用域、表、错误处理和代码组织列出推荐做法。

#### 1. 变量命名

名字要描述用途，别用无意义的缩写或单字母。风格上 snake_case 或 camelCase 都行，认准一种：`user_name` 或 `userName`。

示例:

```lua
local user_name = "Alice"  -- 下划线分隔
local UserName = "Alice"   -- 驼峰命名法
```

#### 2. 函数命名

函数名用「动词+名词」，写出它做什么、对谁做：`calculate_sum`、`get_user_data`。全库统一一种风格，别混用。

示例:

```lua
-- 计算两个数的和
function calculate_sum(a, b)
    return a + b
end

-- 获取用户数据
function get_user_data(user_id)
    -- 实现代码
end
```

#### 3. 缩进与格式

缩进用 2 个空格，别用制表符（tab），各编辑器显示才一致。每行控制在 80 到 120 个字符以内。

操作符前后留空格，括号和函数名之间不留：`a + b` 而不是 `a+b`，`function foo(arg)` 而不是 `function foo (arg)`。

示例:

```lua
local x = 12

-- 不推荐（虽然语法合法，但所有内容挤在一行，难以阅读）
if(x>10)then return x+5 end

-- 推荐
if x > 10 then
    return x + 5
end
```

#### 4. 注释

复杂或不直观的逻辑要加注释，写清楚意图，句子要短。函数、模块和类按 LuaDoc 这类格式写文档注释，参数、返回值和用法示例都写全。

示例:

```lua
--- 计算两个数的和
-- @param a 第一个数
-- @param b 第二个数
-- @return 两个数的和
function add(a, b)
    return a + b
end
```

#### 5. 局部变量与全局变量

变量用 `local` 定义，命名冲突少，访问也快。变量和函数都别放在全局作用域，功能按模块划分。

示例:

```lua
-- 不推荐
global_var = 42

function global_function()
    return global_var
end

-- 推荐
local local_var = 42

local function local_function()
    return local_var
end
```

#### 6. 表（Tables）

相关的数据和方法收进同一个表，用表模拟对象和数据结构。字符串作键时建议带引号，`table["key"]` 而不是 `table.key`，键里含特殊字符时尤其如此。

示例:

```lua
-- 定义一个用户表
local user = {
    name = "Alice",
    age = 30
}

-- 访问表中的字段
print(user["name"])  -- 使用字符串键访问
```

#### 7. 错误处理

可能出运行时错误的地方用 `pcall` 包起来，别只靠 `assert`。错误消息写清楚，排查时省时间。

示例:

```lua
local success, result = pcall(function()
    -- 可能会发生错误的代码
end)

if not success then
    print("Error: " .. result)
end
```

#### 8. 代码组织

一个模块只负责一件事，加载用 `require`，文件末尾用 `return` 导出模块表（`module` 函数自 Lua 5.2 起已被移除，不要用）。文件和目录结构保持清晰，别把所有代码塞进一个文件。

示例:

```lua
-- math_utils.lua
local MathUtils = {}

function MathUtils.add(a, b)
    return a + b
end

return MathUtils
```