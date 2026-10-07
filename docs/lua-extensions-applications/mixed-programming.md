# 使用Lua与C语言混合编程

C 和 Lua 混合编程，分工很清楚：让 Lua 出灵活性和动态特性，C 出性能和底层控制。

## 1. 创建和初始化Lua环境

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

三个函数各管一段：`luaL_newstate` 创建一个新的Lua状态，`luaL_openlibs` 加载Lua标准库，`lua_close` 关闭Lua状态、释放资源。

## 2. 在C中调用Lua脚本

脚本可以从文件或字符串加载执行，里面可以放C代码需要调用的函数或数据。

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

两个入口对应两种来源：`luaL_dofile` 从文件加载并执行Lua脚本，`luaL_dostring` 从字符串加载并执行Lua代码。失败时用 `lua_tostring(L, -1)` 取错误信息。

## 3. 在C中调用Lua函数

从Lua脚本中取到函数，压参数，调用，再处理返回值。

```c
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

流程和上一节一致：`lua_getglobal` 将Lua全局函数推送到栈上，`lua_pushnumber` 推送参数，`lua_pcall` 调用并接收返回值，`lua_tonumber` 从栈中取出结果。

## 4. 在Lua中调用C函数

C 函数注册进Lua环境之后，脚本就能像调普通函数一样调它。

```c
// C函数
int add_numbers(lua_State *L) {
    int a = luaL_checkinteger(L, 1);  // 获取第一个参数
    int b = luaL_checkinteger(L, 2);  // 获取第二个参数
    lua_pushinteger(L, a + b);        // 推送结果
    return 1;  // 返回结果的数量
}

int main() {
    lua_State *L = luaL_newstate();  
    luaL_openlibs(L);

    lua_register(L, "add_numbers", add_numbers);  // 注册C函数

    if (luaL_dofile(L, "script.lua") != LUA_OK) {
        fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
        lua_pop(L, 1);  // 处理错误
    }

    lua_close(L);
    return 0;
}
```

script.lua：

```lua
local result = add_numbers(5, 10)
print("Result from C function: " .. result)
```

`lua_register` 注册C函数到Lua环境中，使其可以在Lua中调用；`luaL_checkinteger` 从Lua栈中获取整数参数，`lua_pushinteger` 把结果推回栈上。

## 5. 处理Lua表

Lua 里的表也能拿到 C 这边来操作。

```c
lua_getglobal(L, "my_table");       // 获取Lua表
lua_getfield(L, -1, "key1");         // 获取表中字段
if (lua_isstring(L, -1)) {
    const char *value = lua_tostring(L, -1);
    printf("Value: %s\n", value);
}
lua_pop(L, 1);  // 清理栈
```

`lua_getfield` 从Lua表中获取字段，`lua_tostring` 从Lua栈中获取字符串值。

## 6. 错误处理

在C中调用Lua代码时，错误处理不能省。`lua_pcall` 会捕获Lua脚本中的错误，`lua_tostring` 负责取出错误信息：

```c
if (lua_pcall(L, 2, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);  // 清理错误信息
}
```

## 7. 清理和关闭

收尾就一个调用，`lua_close` 关闭Lua状态并释放资源：

```c
lua_close(L);  // 关闭Lua状态
```
