# 在C中调用Lua代码

在C中调用Lua代码走的是 Lua C API：执行Lua脚本、调用Lua函数、处理返回值，全都围绕一个 `lua_State` 和它的栈进行。

## 1. 初始化Lua环境

所有操作都基于一个Lua状态（`lua_State`），第一步是创建它。

```c
#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

int main() {
    lua_State *L = luaL_newstate();  // 创建新的Lua状态
    luaL_openlibs(L);                // 打开Lua标准库

    // 在这里编写代码...

    lua_close(L);                    // 关闭Lua状态
    return 0;
}
```

`luaL_newstate` 创建状态，`luaL_openlibs` 加载Lua标准库，退出前用 `lua_close` 关闭状态、释放资源。

## 2. 加载和执行Lua脚本

代码可以来自文件，也可以来自字符串，各有对应的入口。

从文件加载：

```c
if (luaL_dofile(L, "script.lua") != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // 处理错误
}
```

从字符串加载：

```c
const char *lua_code = "print('Hello from Lua!')";
if (luaL_dostring(L, lua_code) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // 处理错误
}
```

两个入口对应两种来源：`luaL_dofile` 读文件，`luaL_dostring` 执行字符串。失败时栈顶放着错误信息，用 `lua_tostring(L, -1)` 取出来。

## 3. 调用Lua函数

调用分三步：把函数推到栈上，压参数，调用之后取返回值。

```c
// 调用Lua函数
lua_getglobal(L, "my_function");  // 获取Lua全局函数
lua_pushnumber(L, 10);            // 推送参数1
lua_pushnumber(L, 20);            // 推送参数2

if (lua_pcall(L, 2, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // 处理错误
} else {
    double result = lua_tonumber(L, -1);  // 获取返回值
    printf("Result: %f\n", result);
    lua_pop(L, 1);  // 清理栈
}
```

`lua_getglobal` 把全局函数推上栈，`lua_pushnumber` 压参数，`lua_pcall` 发起调用并接收返回值，`lua_tonumber` 从栈中取出结果。

## 4. 处理Lua表和函数

函数也可能是某个表的字段。取表、再从表里取函数，调用方式不变。

```c
// 调用Lua表中的函数
lua_getglobal(L, "my_table");      // 获取Lua表
lua_getfield(L, -1, "my_function"); // 获取表中的函数
lua_pushnumber(L, 10);            // 推送参数

if (lua_pcall(L, 1, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // 处理错误
} else {
    double result = lua_tonumber(L, -1);  // 获取返回值
    printf("Result: %f\n", result);
    lua_pop(L, 1);  // 清理栈
}
```

和上一段的区别只在取函数这一步：`lua_getfield` 从栈顶的表里取字段（这里是函数），而不是从全局环境取。

## 5. 清理和关闭

用完之后，`lua_close` 关闭Lua状态并释放资源：

```c
lua_close(L);  // 关闭Lua状态
```
