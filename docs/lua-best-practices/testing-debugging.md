### 测试与调试

测试和调试回答两类问题：代码对不对，慢在哪里。

#### 1. 单元测试

单元测试针对代码里最小的可测试单元，通常是函数或方法。Lua 有几个现成的框架可用。

##### 常用单元测试框架

[LuaUnit](https://github.com/bluebird75/luaunit) 是轻量级的单元测试框架，类似 JUnit：

示例：

```lua
-- 使用 LuaUnit 编写简单的测试用例
local luaunit = require('luaunit')

-- 被测试的函数
function add(a, b)
    return a + b
end

-- 测试用例
TestAddition = {}

function TestAddition:testAddPositiveNumbers()
    luaunit.assertEquals(add(2, 3), 5)
end

function TestAddition:testAddNegativeNumbers()
    luaunit.assertEquals(add(-1, -1), -2)
end

-- 运行测试
os.exit(luaunit.LuaUnit.run())
```

[busted](https://lunarmodules.github.io/busted/) 支持 BDD（行为驱动开发）风格的测试，写起来是这样的：

```lua
-- 使用 busted 编写测试
describe("add", function()
    it("should add positive numbers", function()
        assert.is.equal(add(2, 3), 5)
    end)

    it("should add negative numbers", function()
        assert.is.equal(add(-1, -1), -2)
    end)
end)
```

#### 2. 调试工具

调试工具有内置的，也有第三方的。

##### Lua 内置调试库

内置的 `debug` 库能检查代码执行过程中的状态，比如用 `debug.getinfo` 看调用者：

```lua
-- 使用 debug 库查看调用者的信息
function foo()
    bar()
end

function bar()
    -- "n" 才能取到函数名，"S" 提供来源与行号信息
    local info = debug.getinfo(2, "Sn")
    print("Function name: " .. (info.name or "unknown"))
    print("Source: " .. info.source)
end

foo()
```

##### 第三方调试工具

[ZeroBrane Studio](https://studio.zerobrane.com/) 是专为 Lua 设计的集成开发环境，内置调试功能，设置断点、单步执行、查看变量值都在 IDE 里完成。

[LuaDebug](https://github.com/cloudwu/luadebug) 是远程调试工具，通过 IDE 或命令行调试 Lua 脚本。

#### 3. 性能分析

性能分析找的是瓶颈在哪。常见的 Lua 分析工具：

[luaprofiler](https://github.com/LuaDist/luaprofiler) 记录每次函数调用的次数与耗时。模块名是 `profiler`，只有 `start([filename])` 和 `stop()` 两个函数：`start` 的可选参数指定日志文件（缺省写为 `lprof_随机数.out`），结果在 `stop` 之后可用于 `summary.lua` 等分析脚本。注意该项目面向 Lua 5.1，在 5.4 下可能需要修改后才能编译。

用法：

```lua
-- 使用 luaprofiler 进行性能分析
local profiler = require("profiler")
profiler.start("profiler.log")

-- 运行需要分析的代码
-- doHeavyWork()

profiler.stop()
-- 分析结果写入 profiler.log
```

LuaJIT 自带分析器，`-jv` 参数开启，详见 [LuaJIT profiler](https://luajit.org/ext_profiler.html)：

```bash
luajit -jv script.lua
```

#### 4. 错误处理

Lua 用 `pcall` 和 `xpcall` 处理运行时错误。

`pcall` 是保护性调用，捕获运行时错误：

```lua
-- 使用 pcall 捕获错误
local success, result = pcall(function()
    error("An error occurred")
end)

if not success then
    print("Error: " .. result)
end
```

`xpcall` 在此基础上允许指定错误处理函数：

```lua
-- 使用 xpcall 捕获错误并处理
local function errorHandler(err)
    print("Error: " .. err)
end

local success, result = xpcall(function()
    error("An error occurred")
end, errorHandler)

if not success then
    print("Error handled")
end
```