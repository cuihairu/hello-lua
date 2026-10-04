### 编写Lua C扩展

Lua C扩展允许你将C函数暴露给Lua脚本，让脚本可以直接调用这些C函数。流程三步：写C文件、编译成动态库、在脚本里 require。

---

#### 1. 编写C扩展

先写一个C文件，定义要暴露给Lua的C函数，并把这些函数注册进去。

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

// C函数：计算两个数的和
static int l_sum(lua_State *L) {
    lua_Integer a = luaL_checkinteger(L, 1);  // 获取第一个参数
    lua_Integer b = luaL_checkinteger(L, 2);  // 获取第二个参数
    lua_pushinteger(L, a + b);               // 返回结果
    return 1;                                // 返回一个结果
}

// 模块函数表
static const luaL_Reg mylib_funcs[] = {
    {"sum", l_sum},
    {NULL, NULL}
};

// 模块入口：require("mylib") 时由 Lua 自动调用
int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib_funcs);   // 创建模块表并注册函数
    return 1;                      // 返回模块表（require 的返回值）
}
```

几个关键点：
- `l_sum` 是定义在C中的函数，将执行Lua脚本中的操作。
- `luaL_newlib` 创建模块表并把 `mylib_funcs` 中的函数填入其中。
- `luaopen_mylib` 是Lua C API要求的模块入口函数名：`require("mylib")` 会调用它，并把返回值当作模块。因此这里必须返回 1 个值（模块表）；返回 0 会让 `require` 得到 `true`，随后的 `mylib.sum` 就会报错。

---

#### 2. 编译C扩展

把C代码编译成动态库，Lua 才能加载它。

Linux 上：

```sh
gcc -shared -o mylib.so -fPIC mylib.c -I/usr/local/include
```

Windows 上：

```sh
gcc -shared -o mylib.dll mylib.c -I/path/to/lua/include
```

参数的含义：`-shared` 生成共享库，`-fPIC` 生成位置无关的代码（Linux 上必要），`-I` 指向 Lua 头文件所在目录，按本机 Lua 的安装位置调整。`mylib.so` 或 `mylib.dll` 就是编译产物；Windows 上通常还需要链接 Lua 的导入库（如 `-llua54`），并保证运行时能找到 Lua 的 DLL。

---

#### 3. 在Lua脚本中使用C扩展

脚本里 `require` 一下，就能调用 C 扩展的函数。

```lua
local mylib = require("mylib")  -- 加载C扩展
print(mylib.sum(10, 20))        -- 调用C函数
```

`require("mylib")` 加载名为 `mylib` 的动态库，`mylib.sum(10, 20)` 调用C扩展中的 `sum` 函数并传递参数。

---

#### 4. 调试和错误处理

两类错误最常见。编译不过，先查 C 代码是否符合 C 标准、动态库文件路径对不对。运行时错误在Lua里用`pcall`捕获并打印：

```lua
local status, result = pcall(function() return mylib.sum(10, "text") end)
if not status then
    print("Error:", result)
else
    print("Result:", result)
end
```

`pcall` 用于保护性调用，函数执行中的错误都会被它接住，不至于直接把脚本打崩。