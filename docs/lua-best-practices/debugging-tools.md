# Debugging Tools and Techniques

Lua's debugging tools come in layers: IDEs with a graphical interface, remote debugging libraries that embed in a program, and the plainest `print` and logging. Pick what you need.

## 1. Lua Debuggers

### LuaDebug / luadebug

`luadebug` (LuaDebug) is a remote debugger supporting breakpoints, single-stepping, and variable inspection, often used with IDE plugins to debug game scripts. Get it with:

  ```bash
  git clone https://github.com/cloudwu/luadebug.git
  ```

Add the debugger library to `package.path`, start it in your script, and connect a debug client to debug Lua programs interactively.

### ZeroBrane Studio

ZeroBrane Studio is a Lua integrated development environment (IDE) with a built-in debugger, supporting breakpoints, single-stepping, and variable inspection. Download it from the [ZeroBrane Studio website](https://studio.zerobrane.com/).

Once installed, open a Lua script, set breakpoints, and start debugging; the graphical interface is more intuitive than the command line.

## 2. Lua Debug Libraries

### MobDebug

MobDebug is a lightweight Lua remote debugging library (ZeroBrane Studio uses it), supporting Lua 5.1 to 5.4 and LuaJIT. It embeds in applications and provides breakpoints, single-stepping, variable inspection, and remote execution. After fetching it from GitHub, add `src/mobdebug.lua` to `package.path`; it depends on LuaSocket:

  ```bash
  git clone https://github.com/pkulchenko/MobDebug.git
  ```

Start the debugger in your script and it connects to a debug server (such as ZeroBrane Studio), after which you can single-step from breakpoints.

  ```lua
  local mobdebug = require("mobdebug")

  mobdebug.start()   -- connect to the debug server and start debugging

  -- then set breakpoints and single-step in the debug client
  local function work(n)
      local acc = 0
      for i = 1, n do acc = acc + i end
      return acc
  end
  print(work(10))

  mobdebug.done()    -- end debugging
  ```

## 3. Logging and Tracing

### Output with `print`

The easiest debugging approach is `print`: print out variable values and the execution path. It is crude, but fast enough for verifying a problem.

  ```lua
  local x = 10
  print("Value of x: ", x)
  ```

### File logging

When `print` is not enough, write logs to a file for easier retention and searching. If you don't want a third-party library, `io.open` gives you a simple log function; LuaRocks also has several ready-made logging libraries (search for `logging`).

  ```lua
  -- simple file logging
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

## 4. Integrated Debugging Tools

### LDT (Lua Development Tools)

LDT is an Eclipse plugin providing Lua development and debugging support, including breakpoints and step debugging. Install Eclipse, then install LDT from the Eclipse Marketplace, and create a Lua project in Eclipse to use its debugging features.

## 5. Performance Profiling

### LuaJIT built-in profiler (-jp)

LuaJIT 2.1 ships a low-overhead sampling profiler, enabled with the `-jp` option, which counts calls per function and sample share without pulling in a third-party library:

  ```bash
  luajit -jp=v myscript.lua     # -jp=v outputs a report aggregated by module/function
  luajit -jp=myprof.out myscript.lua   # writes raw samples to a file
  ```

### LuaProfiler (luaprofiler)

LuaProfiler records the time and count of each function call, suited for analyzing hot functions under the standard interpreter. The module is named `profiler` and provides `start([filename])` and `stop()`. Install via LuaRocks:

  ```bash
  luarocks install luaprofiler
  ```

In your Lua script, require the `profiler` library and wrap the code section to analyze with `start`/`stop`.

  ```lua
  local prof = require("profiler")
  prof.start("profile.log")

  -- run your Lua code

  prof.stop()
  -- results written to profile.log
  ```

## Summary

The principle for picking tools is simple: to peek at a variable temporarily, `print` suffices; for breakpoints and single-stepping, use ZeroBrane Studio or luadebug; to find performance bottlenecks, use the LuaJIT profiler or LuaProfiler.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Stack_trace](https://en.wikipedia.org/wiki/Stack_trace)
- [lua-users wiki](http://lua-users.org/wiki/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [testing-debugging](testing-debugging.md)
