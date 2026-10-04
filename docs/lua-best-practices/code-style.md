### 代码风格与规范

风格规范的作用很直接：让别人读得懂你的代码，也让你三个月后还读得懂。

#### 1. 命名约定

变量和函数的名字要能看出用途。函数名用动词，变量名用名词或名词短语：`get_user_name` 而不是 `g_un`，`user_age` 而不是 `age`。

全局变量能不用就不用，它容易撞名，出错也难查。实在要用，加个明确前缀，比如 `MyApp_globalVar`。

表名用名词，如 `user`、`config`；表示类或模块的表可以用驼峰命名，如 `UserSettings`。

#### 2. 缩进和格式

缩进统一用 2 个或 4 个空格，别用制表符（tab），不同编辑器对它的处理不一样。每行控制在 80 到 120 个字符以内，省得横向滚动。

操作符和括号周围留空格：`a + b` 而不是 `a+b`，`if` 语句和 `while` 循环的括号后面也加一个空格。定义和调用函数时，括号紧挨函数名，写成 `function foo(arg)` 和 `foo(arg)`。

示例:

```lua
-- 不推荐（虽然语法合法，但缺少空格与换行，几乎无法阅读）
function foo(arg1,arg2)return arg1+arg2 end

-- 推荐
function foo(arg1, arg2)
    return arg1 + arg2
end
```

#### 3. 注释和文档

复杂的逻辑和关键的代码块值得写注释，但注释要短，别复述代码本身。函数和模块再加一段文档注释，说清楚用途和用法。

文档注释按 LuaDoc 这类规范写，参数说明、返回值说明和可能的错误信息都要交代。比如：

```lua
--- 计算两个数的和
-- @param a 第一个数
-- @param b 第二个数
-- @return 两个数的和
function add(a, b)
    return a + b
end
```

#### 4. 代码结构

代码拆成模块和函数，才好重用和测试；别在全局作用域里堆代码。函数保持简短，一件事一个函数，太长了就拆成几个小的。

功能相关的表和函数放在同一个文件里，用表来组织它们。

示例:

```lua
-- 不推荐
x = 10
y = 20

function add()
    return x + y
end

function subtract()
    return x - y
end

-- 推荐
local Math = {}

function Math.add(a, b)
    return a + b
end

function Math.subtract(a, b)
    return a - b
end

return Math
```

#### 5. 变量和函数定义

变量优先用 `local` 声明，既快又不污染全局作用域。函数同理，写成 `local function`，定义要清晰，别嵌套太深。

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