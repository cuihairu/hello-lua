### 错误处理机制

Lua 的运行时错误靠 `pcall` 和 `xpcall` 捕捉。这两个函数把"出错了"从程序崩溃变成一次带返回值的调用，这一页讲它们的使用方式和差别。

#### 1. `pcall`（Protected Call）

`pcall` 用于安全地调用一个可能发生错误的函数。函数执行中出现的错误会被它捕捉住，程序继续往下走。

用法：

  ```lua
  local status, result = pcall(function()
      -- 可能抛出错误的代码
      error("division by zero")
  end)
  
  if status then
      print("Function executed successfully")
  else
      print("Error: " .. result)
  end
  ```

参数：第一个是要执行的函数，其余参数原样传给它。

返回值有两个：`status` 为 `true` 表示执行成功，`false` 表示出错了；`result` 成功时是函数返回值，失败时是错误信息。

#### 2. `xpcall`（Extended Protected Call）

`xpcall` 是 `pcall` 的扩展版本，多接收一个自定义的错误处理函数，出错时会先调用它。

用法：

  ```lua
  local function errorHandler(err)
      return "Caught an error: " .. err
  end

  local status, result = xpcall(function()
      -- 可能抛出错误的代码
      error("division by zero", 0)  -- 第二个参数为 0 表示不在消息前添加出错位置
  end, errorHandler)
  
  print(result)  -- 输出 "Caught an error: division by zero"
  ```

参数：第一个是要执行的函数，第二个是错误处理函数。

返回值同样两个，区别在 `result`：失败时它是错误处理函数加工过的信息。

#### 3. 错误处理流程

错误处理的基本流程：先用 `pcall` 或 `xpcall` 包住可能出错的调用，再检查返回的 `status` 判断是否成功，出错时通过 `result` 或自定义的错误处理函数拿到错误信息。

#### 4. 错误消息

Lua 的错误消息通常包括错误类型和描述信息。可以用 `error` 函数主动抛出错误：

  ```lua
  error("An unexpected error occurred")
  ```

它接收一个错误消息字符串，抛出错误并终止当前函数的执行，把错误消息沿调用栈向上传。

#### 5. 自定义错误处理

错误处理函数是做善后加工的地方：记日志、换一种错误消息格式，然后返回最终给调用者看的信息。

  ```lua
  local function customErrorHandler(err)
      -- 记录错误日志
      print("Custom error log: " .. err)
      -- 返回自定义的错误信息
      return "Custom Error: " .. err
  end

  local status, result = xpcall(function()
      -- 可能抛出错误的代码
      error("division by zero", 0)
  end, customErrorHandler)
  
  print(result)  -- 输出 "Custom Error: division by zero"
  ```

#### 6. 调试工具

`debug.traceback` 返回当前调用堆栈的跟踪信息，出错时能定位到具体的调用链：

  ```lua
  local function riskyFunction()
      error("An error occurred")
  end

  local status, result = pcall(riskyFunction)
  if not status then
      print(debug.traceback(result))
  end
  ```

#### 总结

两个函数的分工很清楚：`pcall` 只报告错误，`xpcall` 多给一次在错误现场加工信息的机会。Lua 异常处理的基本面就是这两个函数，再加上主动抛错的 `error`。