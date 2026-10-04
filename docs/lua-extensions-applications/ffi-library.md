### 使用 LuaJIT 的 FFI 库

LuaJIT 的 FFI（Foreign Function Interface）库允许 Lua 脚本直接调用 C 函数、使用 C 数据结构。相比写一套 C/C++ 插件再接到 Lua-C 接口上，FFI 免去了这些中间环节。

#### 1. 引入 FFI 库

用 FFI 之前，先在 Lua 脚本中引入 `ffi` 模块：

```lua
local ffi = require("ffi")
```

#### 2. 定义 C 语言函数和数据结构

C 函数和数据结构用 `ffi.cdef` 定义，它接受一个字符串参数，里面写 C 语言的声明。

##### 示例：定义 C 语言函数

```lua
ffi.cdef[[
    int printf(const char *fmt, ...);
]]
```

##### 示例：定义 C 语言结构体

```lua
ffi.cdef[[
    typedef struct {
        int x;
        int y;
    } Point;
]]
```

#### 3. 加载 C 动态库

用 `ffi.load` 加载 C 动态库（共享库），之后就能调用库中定义的函数。

##### 示例：加载 C 标准库

```lua
local libc = ffi.load("c") -- 加载标准 C 库
```

#### 4. 调用 C 函数

声明和加载都做完，这些 C 函数就能直接在 Lua 里调了。

##### 示例：调用 `printf` 函数

```lua
ffi.cdef[[
    int printf(const char *fmt, ...);
]]

local libc = ffi.load("c")
-- 可变参数里的 Lua 数字按 double 传给 C，%d 要先显式转成 int
libc.printf("Hello from C! %d\n", ffi.new("int", 42))  -- 输出 Hello from C! 42
```

#### 5. 使用 C 数据结构

定义了 C 数据结构后，可以在 Lua 里创建它的实例并操作字段。

##### 示例：创建和操作 C 结构体

```lua
ffi.cdef[[
    typedef struct {
        int x;
        int y;
    } Point;
]]

local myPoint = ffi.new("Point")
myPoint.x = 10
myPoint.y = 20

print("Point coordinates:", myPoint.x, myPoint.y)
```

#### 6. 使用 C 函数与结构体结合

C 函数和结构体可以配合起来用。

##### 示例：定义和调用一个处理结构体的 C 函数

```c
// mylib.c
#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

void print_point(Point *p) {
    printf("Point coordinates: x = %d, y = %d\n", p->x, p->y);
}
```

```lua
-- Lua script
ffi.cdef[[
    typedef struct {
        int x;
        int y;
    } Point;

    void print_point(Point *p);
]]

local mylib = ffi.load("mylib")  -- 加载 C 库
local myPoint = ffi.new("Point", 1, 2)
mylib.print_point(myPoint)
```

#### 7. 错误处理

在使用 FFI 时，需要特别注意类型安全和内存管理。传递不正确的数据类型或访问已释放的内存可能导致崩溃或未定义行为。

##### 示例：检查函数返回值

```lua
ffi.cdef[[
    int printf(const char *fmt, ...);
]]

local libc = ffi.load("c")
local result = libc.printf("Hello from C!\n")
if result < 0 then
    error("Error calling printf")
end
```

### 总结

FFI 用起来就一条主线：`ffi.cdef` 声明，`ffi.load` 加载，然后直接调用。要盯住的是声明必须和真实签名一致，类型和内存出错就是崩溃或未定义行为。