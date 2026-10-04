Lua 的调试工具分几层：带图形界面的 IDE、能嵌入程序的远程调试库，以及最朴素的 `print` 和日志。按需取用。

### 1. Lua 调试器

#### LuaDebug / luadebug

`luadebug`（LuaDebug）是远程调试器，支持断点、单步执行和变量查看，常与 IDE 插件配合调试游戏脚本。获取方式：

  ```bash
  git clone https://github.com/cloudwu/luadebug.git
  ```

把调试器库加入 `package.path`，在脚本中启动它并连上调试客户端，就能交互式地调试 Lua 程序。

#### ZeroBrane Studio

ZeroBrane Studio 是带内置调试器的 Lua 集成开发环境 (IDE)，支持断点、单步执行和变量查看，从 [ZeroBrane Studio 官网](https://studio.zerobrane.com/) 下载。

装好后打开 Lua 脚本、设好断点就能开始调试，图形界面比命令行直观。

### 2. Lua 调试库

#### MobDebug

MobDebug 是轻量级的 Lua 远程调试库（ZeroBrane Studio 用的就是它），支持 Lua 5.1～5.4 与 LuaJIT，能嵌入到应用里，提供断点、单步执行、变量查看和远程执行。从 GitHub 获取后，把 `src/mobdebug.lua` 加入 `package.path`，它依赖 LuaSocket：

  ```bash
  git clone https://github.com/pkulchenko/MobDebug.git
  ```

在脚本中启动调试器，它会连到调试服务器（如 ZeroBrane Studio），之后从断点处单步调试。

  ```lua
  local mobdebug = require("mobdebug")

  mobdebug.start()   -- 连接调试服务器并开始调试

  -- 之后在调试客户端中设置断点、单步执行
  local function work(n)
      local acc = 0
      for i = 1, n do acc = acc + i end
      return acc
  end
  print(work(10))

  mobdebug.done()    -- 结束调试
  ```

### 3. 日志和跟踪

#### 用 `print` 输出

最省事的调试办法是 `print`：把变量的值和执行路径打出来。办法土，验证问题时够快。
  
  ```lua
  local x = 10
  print("Value of x: ", x)
  ```

#### 文件日志

`print` 不够用时，把日志写进文件，留存和检索都方便。不想引第三方库，用 `io.open` 就能写一个简单的日志函数；LuaRocks 上也有多个现成的日志库（搜 `logging`）。

  ```lua
  -- 简单的文件日志
  local logfile = assert(io.open("app.log", "a"))

  local function log(level, msg)
      logfile:write(string.format("%s [%s] %s\n",
          os.date("%Y-%m-%d %H:%M:%S"), level, msg))
      logfile:flush()
  end

  log("INFO", "service started")
  log("ERROR", "connection lost")

  logfile:close()
  ```

### 4. 集成调试工具

#### LDT (Lua Development Tools)

LDT 是 Eclipse 插件，提供 Lua 的开发和调试支持，包括断点和步进调试。装好 Eclipse 后从 Eclipse Marketplace 安装 LDT，在 Eclipse 里建 Lua 项目即可用它的调试功能。

### 5. 性能分析

#### LuaJIT 内置分析器（-jp）

LuaJIT 2.1 自带低开销的采样分析器，`-jp` 选项开启，按函数统计调用次数与采样占比，不用引第三方库：

  ```bash
  luajit -jp=v myscript.lua     # -jp=v 输出按模块/函数聚合的分析报告
  luajit -jp=myprof.out myscript.lua   # 把原始采样写入文件
  ```

#### LuaProfiler (luaprofiler)

LuaProfiler 记录每次函数调用的耗时与次数，适合分析标准解释器下的热点函数。模块名为 `profiler`，提供 `start([filename])` 与 `stop()`。通过 LuaRocks 安装：

  ```bash
  luarocks install luaprofiler
  ```

在 Lua 脚本中引入 `profiler` 库，用 `start`/`stop` 包住要分析的代码段。

  ```lua
  local prof = require("profiler")
  prof.start("profile.log")

  -- 执行你的 Lua 代码

  prof.stop()
  -- 结果写入 profile.log
  ```

### 总结

挑工具的原则很简单：临时看个变量，`print` 就够；要断点和单步，上 ZeroBrane Studio 或 luadebug；查性能瓶颈，用 LuaJIT 分析器或 LuaProfiler。