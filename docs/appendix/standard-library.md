# Lua标准库参考

本章按库梳理 Lua 5.4 自带的标准库。`luaL_openlibs` 默认打开除 `debug` 之外的库（`debug` 库在标准解释器中也会被打开，但嵌入式环境可自行选择）。所有函数签名与返回值以 Lua 5.4 手册为准。

## 1. base（基础库）

随解释器内建，不需要 `require`，提供语言本身的基础能力。

| 函数 | 说明 |
| --- | --- |
| `print(...)` | 输出值，以制表符分隔 |
| `type(v)` | 返回类型名：`"nil"`、`"boolean"`、`"number"`、`"string"`、`"table"`、`"function"`、`"thread"`、`"userdata"` |
| `tostring(v)` / `tonumber(v, [base])` | 与字符串相互转换 |
| `assert(v, [msg])` | 断言，失败时抛出错误 |
| `error(msg, [level])` | 抛出错误，`level` 控制是否附加位置信息 |
| `pcall(f, ...)` / `xpcall(f, handler, ...)` | 保护调用 |
| `next(t, [k])` | 遍历表的下一个键值对 |
| `pairs(t)` / `ipairs(t)` | 迭代器，分别遍历整个表和从 1 开始的数组部分 |
| `select(n, ...)` | 返回第 n 个参数或参数总个数（`"#"`） |
| `rawget(t, k)` / `rawset(t, k, v)` | 绕过元方法直接访问表 |
| `setmetatable(t, mt)` / `getmetatable(t)` | 设置/获取元表 |
| `load(chunk, [chunkname])` / `loadfile(filename)` | 编译字符串或文件，返回函数 |
| `dofile(filename)` | 执行文件（出错会直接抛出，不常用） |
| `_G` / `_VERSION` | 全局环境表 / 版本字符串 |

```lua
print(_VERSION)                        -- Lua 5.4
print(select("#", 1, 2, 3))            -- 3
print(pcall(function() error("boom") end))  -- false	[string "..."]:1: boom
```

## 2. string（字符串库）

Lua 字符串以字节为单位，且不可变。字符串方法可以通过 `s:method(...)` 方式调用。

| 函数 | 说明 |
| --- | --- |
| `string.len(s)` | 字节长度（也等价于 `#s`） |
| `string.sub(s, i, [j])` | 截取子串，索引支持负数 |
| `string.rep(s, n, [sep])` | 重复字符串 |
| `string.upper(s)` / `string.lower(s)` | 大小写转换 |
| `string.reverse(s)` | 反转 |
| `string.find(s, pattern, [init])` | 查找模式，返回起止下标 |
| `string.match(s, pattern, [init])` | 捕获匹配内容 |
| `string.gsub(s, pattern, repl, [n])` | 全局替换 |
| `string.gmatch(s, pattern)` | 返回迭代器，逐个返回匹配 |
| `string.format(fmt, ...)` | 格式化，类似 C 的 `printf` |
| `string.byte(s, [i])` / `string.char(...)` | 字节与字符互转 |
| `string.pack` / `string.unpack` / `string.packsize` | 二进制打包（5.3+） |

```lua
print(string.format("%s=%d (%.1f%%)", "count", 42, 87.5))  -- count=42 (87.5%)
print(string.gsub("hello world", "o", "0"))                 -- hell0 w0rld	2
for w in string.gmatch("a,b,c", "[^,]+") do io.write(w, " ") end  -- a b c
```

## 3. table（表库）

| 函数 | 说明 |
| --- | --- |
| `table.insert(t, [pos,] v)` | 在末尾或 `pos` 处插入 |
| `table.remove(t, [pos])` | 移除并返回元素 |
| `table.concat(t, [sep], [i], [j])` | 拼接数组部分 |
| `table.sort(t, [cmp])` | 原地排序，`cmp` 为比较函数 |
| `table.move(a1, f, e, t, [a2])` | 在表之间移动元素（5.3+） |
| `table.unpack(t, [i], [j])` | 展开为多个返回值（5.2+） |

```lua
local t = {3, 1, 2}
table.sort(t)
print(table.concat(t, ","))          -- 1,2,3
print(table.unpack({10, 20, 30}))    -- 10	20	30
```

## 4. math（数学库）

Lua 5.4 的 `math.random` 默认使用 64 位整数随机数发生器；整数运算不会产生浮点误差。

| 函数 | 说明 |
| --- | --- |
| `math.max(...)` / `math.min(...)` | 最大/最小值 |
| `math.abs(n)` / `math.ceil(n)` / `math.floor(n)` | 绝对值、上取整、下取整 |
| `math.fmod(x, y)` / `math.tointeger(x)` | 浮点取模、转整数 |
| `math.sqrt(x)` / `math.exp(x)` / `math.log(x, [base])` | 幂与对数 |
| `math.sin/cos/tan/asin/acos/atan` | 三角函数 |
| `math.tau` / `math.pi` / `math.huge` | 常量 `2π`、`π`、无穷大 |
| `math.random([m [, n]])` | 随机数，`math.randomseed(x)` 设种子 |
| `math.type(x)` | 返回 `"integer"` 或 `"float"` |

```lua
print(math.floor(-1.5), math.ceil(2.1))   -- -2 3
print(math.type(3), math.type(3.0))       -- integer float
print(7 // 2, 7 % 2, 1 << 3)              -- 3 1 8
math.randomseed(os.time())
print(math.random(1, 6))
```

## 5. io（文件 I/O）

`io.read`/`io.write` 操作默认输入输出；`io.open` 返回文件句柄（失败时返回 `nil, errmsg`，它不会抛出错误）。

```lua
local f = io.open("/tmp/lua_io_demo.txt", "w")
if f then
    f:write("line1\n", "line2\n")
    f:close()
end

local f2 = io.open("/tmp/lua_io_demo.txt", "r")
if f2 then
    print(f2:read("a"))          -- 读取整个文件
    f2:close()
end
```

## 6. os（操作系统库）

| 函数 | 说明 |
| --- | --- |
| `os.time([t])` / `os.difftime(t2, t1)` | 时间戳与差值 |
| `os.clock()` | 程序运行 CPU 时间 |
| `os.date([format, [t]])` | 格式化时间 |
| `os.getenv(var)` | 读取环境变量 |
| `os.remove(filename)` / `os.rename(a, b)` | 删除/重命名文件 |
| `os.tmpname()` | 临时文件名 |
| `os.execute([cmd])` | 执行外部命令 |

```lua
print(os.date("%Y-%m-%d %H:%M:%S"))
print(os.getenv("HOME") or "未设置")
```

## 7. coroutine（协程库）

| 函数 | 说明 |
| --- | --- |
| `coroutine.create(f)` | 创建协程 |
| `coroutine.resume(co, ...)` | 恢复执行，返回 `true, ...` 或 `false, err` |
| `coroutine.yield(...)` | 挂起当前协程 |
| `coroutine.status(co)` | `suspended`、`running`、`normal`、`dead` |
| `coroutine.wrap(f)` | 创建可直接调用的包装函数 |
| `coroutine.isyieldable([co])` | 当前是否可挂起 |
| `coroutine.running([ismain])` | 返回当前协程及是否为主协程（5.4 新增 `ismain`） |

```lua
local co = coroutine.wrap(function(a)
    local b = coroutine.yield(a + 1)
    return b * 2
end)
print(co(10))        -- 11
print(co(5))         -- 10
```

## 8. package（模块库）

管理模块搜索与加载：`require`、`package.path`、`package.cpath`、`package.loaded`（已加载模块缓存）、`package.preload`、`package.loadlib`、`package.searchers`。

```lua
print(package.loaded["string"] ~= nil)          -- true
package.path = package.path .. ";./mylib/?.lua"
```

## 9. utf8（UTF-8 库，5.3+）

`utf8.char`、`utf8.codepoint`、`utf8.len`、`utf8.offset`、`utf8.charpattern`。注意 `string.len`/`string.sub` 操作的是字节，不是字符。

```lua
print(utf8.len("中文abc"))                 -- 5
print(("中文abc"):sub(1, 3))               -- 按字节截取，前三个字节正好是“中”
```

## 10. debug（调试库）

提供运行时内省与调试能力，包括 `debug.getinfo`、`debug.getlocal`、`debug.setlocal`、`debug.getupvalue`、`debug.sethook`、`debug.traceback`、`debug.getregistry` 等。该库可能破坏封装并影响性能，生产环境应谨慎使用。

```lua
local function f()
    print(debug.getinfo(2, "n").name)
end
f()
```

## 总结

Lua 5.4 的标准库刻意保持精简：基础能力放在 `base`，其余按职责分库，且都可以用 `require` 按需加载（`base`、`coroutine`、`package`、`string`、`table` 除外，它们在 `luaL_openlibs` 中总是可用）。除以上十个库外，Lua 5.4 不再提供 `bit32` 库，位运算已由 `& | ~ << >>` 等语言运算符承担。
