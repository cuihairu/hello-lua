### 错误处理

Lua 的错误处理围绕 `pcall`、`xpcall` 和 `error` 三个函数展开。这一页过一遍它们各自的用法，以及常见的错误类型。

#### 1. 错误处理机制

Lua 的错误处理机制主要通过 `pcall` 和 `xpcall` 函数实现，这些函数允许你捕捉错误并控制程序的执行流。

##### 1.1 `pcall`（Protected Call）

`pcall`（protected call）用于安全地调用一个函数，如果该函数在执行过程中发生错误，`pcall` 会捕捉这个错误而不会终止程序的执行。

用法：把要执行的函数交给 `pcall`：

  ```lua
  local status, result = pcall(function()
      -- 可能会抛出错误的代码
      error("division by zero")
  end)
  
  if status then
      print("Function executed successfully")
  else
      print("Error: " .. result)
  end
  ```

参数：第一个是要执行的函数，额外的参数会原样传给它。

返回值有两个：`status` 为 `true` 表示执行成功，`false` 表示出错了；`result` 成功时是函数返回值，失败时是错误信息。

##### 1.2 `xpcall`（Extended Protected Call）

`xpcall` 类似于 `pcall`，但允许你指定一个错误处理函数，该函数在捕捉到错误时会被调用。

用法：多传一个错误处理函数，出错时它会先被调用：

  ```lua
  local function errorHandler(err)
      return "Caught an error: " .. err
  end

  local status, result = xpcall(function()
      -- 可能会抛出错误的代码
      error("division by zero", 0)  -- 第二个参数为 0 表示不在消息前添加出错位置
  end, errorHandler)
  
  print(result)  -- 输出 "Caught an error: division by zero"
  ```

参数：第一个是要执行的函数，第二个是错误处理函数。

返回值同样两个：`result` 在失败时是错误处理函数加工过的信息。

#### 2. 错误类型

在 Lua 中，错误主要有以下几种类型：

##### 2.1 语法错误

语法错误发生在 Lua 代码无法被正确解析时。这通常在编写代码时发现，无法通过解释器编译。

##### 2.2 运行时错误

运行时错误发生在代码执行过程中，常见的运行时错误包括：

- 除零：对整数执行 `//` 或 `%` 时除数为零，如 `1 // 0` 会抛出错误。注意 `1 / 0` 并不报错，其结果是 `inf`。
- 索引 `nil`：如 `t.x` 中的 `t` 为 `nil`。访问表中不存在的键只会得到 `nil`，并不会报错。
- 类型错误：对不支持的类型执行操作，如字符串与数字相加。

##### 2.3 错误信息

Lua 提供了 `error` 函数来手动抛出错误：

  ```lua
  error("Something went wrong")
  ```

它接收一个错误消息字符串，抛出错误并终止当前函数的执行，把错误消息沿调用栈向上传。

#### 3. 自定义错误处理

自定义错误处理就是把处理逻辑写成一个函数，交给 `xpcall` 调用。

##### 3.1 自定义错误消息

错误处理函数的返回值就是最终拿到的错误信息，可以按需加工：

  ```lua
  local function customErrorHandler(err)
      return "Custom Error: " .. err
  end

  local function riskyFunction()
      error("An error occurred", 0)
  end

  local status, result = xpcall(riskyFunction, customErrorHandler)
  print(result)  -- 输出 "Custom Error: An error occurred"
  ```

#### 4. 错误调试

当遇到错误时，可以通过 `debug` 库中的函数来帮助调试。`debug.traceback` 返回当前堆栈的调用信息，有助于定位错误源头：

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

`pcall` 和 `xpcall` 把错误变成一次带返回值的调用，程序不会因为一处出错而整体崩溃。错误消息统一交给处理函数加工，再用 `debug.traceback` 补上调用栈，排查问题时这两样最常用。