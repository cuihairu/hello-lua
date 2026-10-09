# 沙箱与不可信代码

嵌入 Lua 的场景里，脚本来源常常不可信：玩家写的模组、插件市场下载的扩展、用户上传的配置。沙箱要做的是让这些代码跑起来，同时让它够不到权限之外的东西。Lua 没有内建沙箱机制，隔离环境、限制资源、认清边界这三件事都得自己搭。

## 1. 隔离环境

`load` 的第四个参数可以给代码一张受限的环境表（`_ENV`），表里放什么，代码才能用什么：

```lua
local env = {
    print = print,
    string = string,
    table = table,
    math = math,
    tonumber = tonumber,
    tostring = tostring,
    type = type,
    pairs = pairs,
    ipairs = ipairs,
    select = select,
    pcall = pcall,
    error = error,
    assert = assert,
}

local chunk = [[
    name = "guest"
    function greet()
        return "hello, " .. name
    end
    -- os.execute("rm -rf /")  -- 拿不到 os，这行写不进来
]]

local fn = load(chunk, "guest_chunk", "t", env)
fn()
print(env.greet())  -- 输出 hello, guest
print(env.os)       -- 输出 nil
```

白名单之外的东西一律不放：`io`、`os`、`package`、`debug`、`load`、`require`（会读文件系统）、`dofile`、`collectgarbage`。少放一个，对应的攻击面就开一个。

## 2. 限制资源

环境隔离管不住「跑太久」和「吃太多」，这两样要用 `debug.sethook` 挂计数钩子来卡。

指令配额——钩子每执行 100 条指令触发一次，超配额就抛错：

```lua
local budget = 100000
local steps = 0

local function quota()
    steps = steps + 1
    if steps > budget then
        error("instruction budget exceeded")
    end
end

debug.sethook(quota, "", 100)  -- 第三个参数 100 表示计数钩子的间隔

local ok, err = pcall(function()
    local n = 0
    for i = 1, 1e9 do n = n + i end  -- 远超配额
    return n
end)

debug.sethook()
print(ok, err)  -- 输出 false  instruction budget exceeded
```

时间配额——同一个钩子里查 `os.clock()`，到点抛错，死循环也能掐断：

```lua
local deadline = os.clock() + 0.5
local function timecheck()
    if os.clock() > deadline then
        error("time limit exceeded")
    end
end

debug.sethook(timecheck, "", 1000)

local ok, err = pcall(function()
    while true do end  -- 死循环
end)

debug.sethook()
print(ok, err)  -- 输出 false  time limit exceeded
```

内存配额——`collectgarbage("count")` 返回当前内存用量（KB），配合分配前的检查来卡：

```lua
local limit = 1024  -- KB
local before = collectgarbage("count")
if before + 512 > limit then
    error("memory budget exceeded")
end
```

## 3. 认清边界

沙箱是纵深防御的一层，不是安全边界，三个绕不过去的洞：

- `debug` 库本身能逃逸：沙箱里的代码拿到 `debug` 就能读钩子、改钩子、访问注册表，所以 `debug` 必须从环境里拿掉——但拿掉之后 `debug.sethook` 也进不去，配额钩子只能由沙箱外的宿主来挂。
- C 扩展不受 Lua 层约束：`ffi.load` 进来的 C 代码、`require` 进来的 C 模块，都绕过 Lua 的一切检查。
- 解释器层的侧信道：定时、内存布局这类差异，靠 Lua 层堵不住。

生产环境跑不可信代码，硬隔离在操作系统一侧：独立进程加容器，配 seccomp 之类的系统调用过滤。Lua 沙箱是纵深防御的一层，不是城墙。

## 结语

环境用白名单，资源用钩子，边界要认清：沙箱能挡住的只有按 Lua 规则玩的代码，真正的隔离交给操作系统。
