# C与Lua的交互

Lua 与 C 的调用是双向的：C 可以操作 Lua 虚拟机、执行脚本、调用 Lua 函数，Lua 也能反过来调 C。接口都是 Lua C API。

---

## 1. Lua C API

Lua C API 提供一组函数，用来在 C 里操作 Lua 虚拟机：加载执行脚本、调用函数、取数据。

- 创建和关闭Lua状态：
  ```c
  lua_State *L = luaL_newstate();  // 创建新的Lua状态
  luaL_openlibs(L);                // 打开Lua标准库
  // 执行Lua代码
  lua_close(L);                    // 关闭Lua状态
  ```

- 执行Lua脚本：
  ```c
  if (luaL_dofile(L, "script.lua") != LUA_OK) {
      fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
  }
  ```

- 调用Lua函数：
  ```c
  lua_getglobal(L, "lua_function");  // 获取Lua中的函数
  lua_pushnumber(L, 10);             // 推送参数
  lua_pushnumber(L, 20);
  
  if (lua_pcall(L, 2, 1, 0) != LUA_OK) {  // 调用Lua函数
      fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
  }
  
  double result = lua_tonumber(L, -1);  // 获取返回值
  lua_pop(L, 1);                       // 弹出返回值
  ```

这几个调用的分工：
- `lua_getglobal` 用于从Lua中获取全局变量（函数）。
- `lua_pushnumber` 用于将数据推送到Lua栈。
- `lua_pcall` 调用Lua函数，并处理可能的错误。
- `lua_tonumber` 用于将Lua栈上的数据转换为C中的数字类型。
- `lua_pop` 弹出Lua栈中的数据。

---

## 2. 编写Lua C扩展

C 扩展把 C 函数暴露给 Lua。扩展通常以动态库的形式存在，模块入口函数里完成注册。

一个最小的扩展：

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

// C函数：计算两个数的和
static int l_sum(lua_State *L) {
    lua_Integer a = luaL_checkinteger(L, 1);
    lua_Integer b = luaL_checkinteger(L, 2);
    lua_pushinteger(L, a + b);
    return 1;
}

// 模块函数表
static const luaL_Reg mylib_funcs[] = {
    {"sum", l_sum},
    {NULL, NULL}
};

// 模块入口：require("mylib") 时由 Lua 自动调用，返回值即模块表
int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib_funcs);
    return 1;
}
```

编译并使用：
1. 把上面的C代码编译为动态库（头文件路径按本机 Lua 安装位置调整）。
   ```sh
   gcc -shared -o mylib.so -fPIC mylib.c -I/usr/local/include
   ```
2. 在Lua脚本中加载并调用C扩展。
   ```lua
   local mylib = require("mylib")
   print(mylib.sum(10, 20))  -- 输出 30
   ```
   注意：`require` 的返回值就是 `luaopen_mylib` 返回的模块表；如果模块入口不返回表，`require("mylib")` 会得到 `true`，`mylib.sum` 就会报错。

---

## 3. C中调用Lua代码

C 程序可以调用 Lua 函数，传递参数并接收返回值。从建状态到释放，完整一遍：

```c
lua_State *L = luaL_newstate();
luaL_openlibs(L);

// 加载并执行Lua脚本
luaL_dofile(L, "script.lua");

// 调用Lua函数
lua_getglobal(L, "lua_function");  // 获取Lua中的函数
lua_pushnumber(L, 10);             // 推送参数
lua_pushnumber(L, 20);
if (lua_pcall(L, 2, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
}

double result = lua_tonumber(L, -1);  // 获取返回值
lua_pop(L, 1);                       // 弹出返回值

lua_close(L);
```

三处关键调用：
- `lua_getglobal` 获取Lua中的全局函数。
- `lua_pcall` 调用Lua函数，并处理错误。
- `lua_tonumber` 将Lua栈上的返回值转换为C中的数字类型。

---

## 4. 常见问题

用`lua_pcall`调用Lua函数时，务必检查返回值，再用`lua_tostring`获取详细的错误信息。在C中操作Lua数据，注意数据类型的转换和栈操作的顺序。Lua状态的生命周期也要管好，用完关闭，避免内存泄漏。
