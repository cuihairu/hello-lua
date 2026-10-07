# 错误类型与调试

Lua 的错误大致分四种：语法错误、运行时错误、逻辑错误和类型错误。这一页先看它们的成因和例子，再看内建与第三方的调试工具。

## 1. 错误类型

1. 语法错误：缺少关键字、括号不匹配等都属于这一类。这类错误在加载阶段就会被 `luac -p` 或解释器发现，代码根本跑不起来。例如：
     ```lua
     local x = 10
     -- 下面的调用缺少右括号，会引发语法错误，无法通过语法检查：
     -- print(x
     ```

2. 运行时错误：程序运行中才暴露的错误，如整数除以零、对 `nil` 值进行索引或算术运算。例如：
     ```lua
     local x = 10 // 0  -- 整数除以零，会引发运行时错误（10 / 0 则返回 inf，并不报错）
     ```

3. 逻辑错误：代码能够运行，但不按预期工作，通常难以通过错误消息直接识别。例如：
     ```lua
     local function is_even(n)
         return n % 2 == 1  -- 逻辑写反了，判断偶数应为 n % 2 == 0
     end
     print(is_even(4))  -- 输出 false，但 4 是偶数，预期应为 true
     ```

4. 类型错误：传给函数或操作符的参数类型不正确。例如：
     ```lua
     local function add(a, b)
         return a + b
     end
     print(add("Hello", 5))  -- 字符串与数字相加
     ```

## 2. 调试工具

Lua 提供了一些内建的调试工具和库，帮助开发者跟踪和修复代码中的问题。

1. `debug` 库：提供对 Lua 程序内部状态的访问和控制。常用的两个函数：

     - `debug.traceback([message[, level]])`：获取调用堆栈的跟踪信息。
       ```lua
       local function foo()
           error("Something went wrong")
       end

       local function bar()
           foo()
       end

       local status, err = pcall(bar)
       if not status then
           print(debug.traceback(err))
       end
       ```
     - `debug.getinfo([thread,] function[, what])`：获取有关函数的信息，如名称、源代码位置等。
       ```lua
       local info = debug.getinfo(1, "S")
       print(info.source)  -- 输出形如 "@demo.lua"（@ 开头表示代码来自脚本文件）
       ```

2. `pcall` 和 `xpcall`：安全地调用函数并捕捉错误。
     ```lua
     local function riskyFunction()
         error("division by zero")
     end

     local status, result = pcall(riskyFunction)
     if not status then
         print("Caught an error: " .. result)
     end
     ```

3. `assert`：强制检查条件，条件不满足时抛出错误。
     ```lua
     local function divide(a, b)
         assert(b ~= 0, "Division by zero")
         return a / b
     end

     print(divide(10, 0))  -- 抛出错误
     ```

4. `print`：最基本的调试手段，打印变量值和程序状态。
     ```lua
     local x = 10
     print("Value of x: ", x)
     ```

5. 第三方调试工具：LuaDebug 和 ZeroBrane Studio 在内建工具之外补充了调试能力。
   - ZeroBrane Studio：一个集成开发环境 (IDE)，调试功能比较完整。
   - LuaDebug：提供更多的调试功能和图形化界面。

## 3. 错误调试实践

1. 使用断言：在代码中加入 `assert` 语句，确保参数和状态符合预期。
     ```lua
     local function safeDivision(a, b)
         assert(type(a) == "number" and type(b) == "number", "Arguments must be numbers")
         assert(b ~= 0, "Division by zero")
         return a / b
     end
     ```

2. 跟踪错误：用 `debug.traceback` 捕捉并记录错误信息，发生错误时能追踪到出错的位置。
     ```lua
     local function foo()
         error("Something went wrong")
     end

     local function bar()
         foo()
     end

     local status, err = pcall(bar)
     if not status then
         print(debug.traceback(err))
     end
     ```

3. 逐步调试：使用 IDE 或调试工具逐步执行代码，检查每一步的状态和变量值。

4. 日志记录：在关键部分记录日志，追踪程序的执行路径和状态。

5. 错误处理策略：用 `pcall` 和 `xpcall` 包住可能出错的调用，把异常情况拦在自己的处理逻辑里。

语法错误在加载时就会被拦下；运行时错误会带出错位置和原因；逻辑错误不报错，只能靠断言、日志和逐步调试把它找出来。
