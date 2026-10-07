# Lua的扩展与应用

Lua 是一种轻量级脚本语言，扩展性好，最常见的扩展对象是 C/C++。这一组文档覆盖三个方向：与 C 语言的交互、嵌入式开发和 LuaJIT。

---

## 1. C与Lua的交互

Lua 与 C 集成得很深：C 可以调用 Lua，Lua 也可以调用 C，两条路用的都是 Lua C API，也就是一组在 C 代码里操作 Lua 状态的 C 函数。所谓 C 扩展，就是用这套 API 写 C 代码给 Lua 加功能，或者把热点逻辑挪到 C 里跑。

一个最小的 C 扩展：

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

// C函数：计算两个数的和
static int l_sum(lua_State *L) {
    // 获取参数
    lua_Integer a = luaL_checkinteger(L, 1);
    lua_Integer b = luaL_checkinteger(L, 2);

    // 计算和并推入栈
    lua_pushinteger(L, a + b);

    // 返回结果的数量
    return 1;
}

// 模块函数表
static const luaL_Reg mylib_funcs[] = {
    {"sum", l_sum},
    {NULL, NULL}
};

// 模块入口：require("mylib") 时由 Lua 自动调用
int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib_funcs);  // 创建模块表并注册函数
    return 1;                     // 返回模块表
}
```

几个关键点：
- `luaL_checkinteger` 用于获取传递给C函数的参数。
- `lua_pushinteger` 用于将结果推送到Lua栈。
- `luaopen_mylib` 是模块入口：`require("mylib")` 会调用它，并把它的**返回值作为模块本身**。因此必须在这里创建模块表（`luaL_newlib`）并返回 1 个值；如果只是用 `lua_register` 把函数注册成全局函数而不返回表，`require("mylib")` 得到的将是 `true`，随后的 `mylib.sum(...)` 就会报错。

编译和使用：
1. 使用 `gcc` 编译 C 扩展为动态库（头文件路径按本机 Lua 安装位置调整）：

   ```sh
   gcc -shared -fPIC -o mylib.so mylib.c -I/usr/local/include
   ```

2. 在 Lua 脚本中调用 `require` 来加载动态库，并使用注册的 C 函数。

```lua
-- Lua脚本
local mylib = require("mylib")
print(mylib.sum(10, 20))  -- 输出 30
```

---

## 2. 嵌入式开发

Lua 的代码和内存开销小，执行也不慢，所以常被嵌进资源受限的环境。常见的用法：游戏引擎用它写游戏逻辑，路由器和交换机用它做配置和自动化任务，应用程序拿它做插件系统，让用户用脚本扩展功能。

在 C 程序里嵌一段执行脚本的逻辑，只需要几行：

```c
#include <stdio.h>
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

void run_lua_script(const char *script) {
    lua_State *L = luaL_newstate();  // 创建Lua状态
    luaL_openlibs(L);  // 打开Lua标准库

    if (luaL_dofile(L, script) != LUA_OK) {
        fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    }

    lua_close(L);  // 关闭Lua状态
}
```

三个调用：
- `luaL_newstate` 创建一个新的Lua状态。
- `luaL_openlibs` 打开Lua的标准库。
- `luaL_dofile` 执行Lua脚本文件。

---

## 3. LuaJIT

LuaJIT 是 Lua 的高性能实现，比标准解释器跑得快，功能也更多。它有两样标准 Lua 没有的东西：一是 JIT 编译器，把 Lua 字节码编译成机器码；二是 FFI 库，让 Lua 直接调用 C 函数、使用 C 数据结构，不用写 C 扩展。

用 FFI 调一个 C 函数：

```lua
local ffi = require("ffi")

-- 定义C函数
ffi.cdef[[
    int add(int a, int b);
]]

-- 加载C库
local mylib = ffi.load("mylib")

-- 调用C函数
print(mylib.add(10, 20))  -- 输出 30
```

这段脚本里：
- `ffi.cdef` 用于声明C函数。
- `ffi.load` 加载C动态库。
- 直接调用C函数而无需编写C扩展。
