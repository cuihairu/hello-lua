Lua 体量小、开销低，经常被嵌进资源受限的环境。这一篇讲怎么把它集成进去、能拿它做什么、会遇到哪些问题。

### 1. 为什么用Lua

理由主要是小：Lua 的代码和内存开销都很低，适合资源受限的嵌入式系统。脚本可以运行时加载执行，改配置、加功能不必重新编译；C API 也简单，嵌进 C/C++ 代码不费劲。

### 2. 嵌入式开发中的Lua集成

#### 2.1 获取Lua源代码

源码从 Lua 官方网站下载：

```bash
wget https://www.lua.org/ftp/lua-5.4.8.tar.gz
tar -zxvf lua-5.4.8.tar.gz
cd lua-5.4.8
```

#### 2.2 编译Lua

在嵌入式系统中，通常要把Lua编译成适合目标平台的库。

本机编译：

```bash
make linux
```

换到不同的嵌入式平台就得交叉编译，例如用`arm-none-eabi-gcc`。Lua 的 Makefile 没有 `CROSS` 变量，用 `CC` 指定工具链即可（`generic` 目标不依赖任何平台特有库，适合裸机等场景）：

```bash
make generic CC=arm-none-eabi-gcc
```

#### 2.3 集成Lua到嵌入式系统

在C/C++代码中使用Lua，分四步。

1. 初始化Lua环境

```c
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"

lua_State *L = luaL_newstate();
luaL_openlibs(L);
```

2. 加载和执行Lua脚本

```c
if (luaL_dofile(L, "script.lua") != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
}
```

3. 在C/C++中调用Lua函数

```c
lua_getglobal(L, "lua_function");
lua_pushnumber(L, 42);
if (lua_pcall(L, 1, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
} else {
    int result = lua_tonumber(L, -1);
    printf("Result: %d\n", result);
    lua_pop(L, 1);
}
```

4. 在Lua中调用C/C++函数

```c
int c_function(lua_State *L) {
    int arg = luaL_checkinteger(L, 1);
    lua_pushinteger(L, arg + 1);
    return 1;
}

lua_register(L, "c_function", c_function);
```

Lua 脚本一侧：

```lua
result = c_function(10)
print("Result from C function:", result)
```

#### 2.4 资源管理

资源紧张的环境里，用完要记得释放Lua状态：

```c
lua_close(L);
```

### 3. 嵌入式Lua应用示例

#### 3.1 配置文件

Lua脚本可以用作配置文件，用户改设置不用重新编译代码。

config.lua：

```lua
setting1 = true
setting2 = "value"
```

C 侧读取：

```c
luaL_dofile(L, "config.lua");
lua_getglobal(L, "setting1");
int setting1 = lua_toboolean(L, -1);
lua_pop(L, 1);
```

#### 3.2 动态脚本执行

Lua允许动态加载和执行脚本，适合需要在运行时调整行为的嵌入式系统。

script.lua：

```lua
function dynamic_function(x)
    return x * 2
end
```

C 侧执行：

```c
luaL_dofile(L, "script.lua");
lua_getglobal(L, "dynamic_function");
lua_pushnumber(L, 5);
if (lua_pcall(L, 1, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
} else {
    int result = lua_tonumber(L, -1);
    printf("Dynamic Function Result: %d\n", result);
    lua_pop(L, 1);
}
```

### 4. 嵌入式开发中的挑战

首先要盯住内存：Lua 的堆栈和内存使用不能超出嵌入式系统的限制。性能关键的应用里，光靠 Lua 不够，热点部分要用 C 代码实现。调试也不轻松，Lua 和 C 混合的代码排错比较麻烦，日志和调试工具能帮上忙。