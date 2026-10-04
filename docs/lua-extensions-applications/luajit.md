LuaJIT 是 Lua 的一个 JIT（即时编译）实现，把 Lua 代码编译成机器码来提速，执行速度比标准解释器快。

### LuaJIT 概述

#### 1. 什么是 LuaJIT

对使用者来说，记住三点就够了：跑得快、兼容 Lua 5.1、自带 FFI。它在标准 Lua 的语义之上加了一层编译和优化。

#### 2. LuaJIT 的特点

JIT 编译把字节码变成机器码，省掉每次执行时的解释开销，通常比标准 Lua 快几倍甚至几十倍。兼容性以 Lua 5.1 的大多数特性为准，5.2 和 5.3 只有部分功能。FFI（Foreign Function Interface）库让 Lua 直接调用 C 函数、使用 C 数据结构，互操作不用再绕一圈。

### LuaJIT 的主要组件

#### 1. 即时编译器（JIT Compiler）

LuaJIT 的 JIT 编译器会动态地将 Lua 字节码编译成机器码。编译过程分三步：先在运行时优化字节码，让生成的机器码更高效；再识别频繁执行的代码路径，重点优化；编译出的机器码缓存起来，后续调用直接复用，省掉重新编译的开销。

#### 2. FFI（Foreign Function Interface）

FFI 允许 Lua 脚本直接调用 C 函数、操作 C 数据结构。用法两步：先用 `ffi.cdef` 声明 C 函数原型和结构体：
  ```lua
  local ffi = require("ffi")
  ffi.cdef[[
      int printf(const char *fmt, ...);
  ]]
  ```
然后通过 `ffi.C` 表调用：
  ```lua
  ffi.C.printf("Hello, %s!\n", "world")
  ```

### 使用 LuaJIT

#### 1. 安装 LuaJIT

LuaJIT 可以从 [官方网站](http://luajit.org/) 下载，也可以用包管理工具安装。Linux 下：
```sh
sudo apt-get install luajit
```
或者，下载源代码并编译：
```sh
git clone https://github.com/LuaJIT/LuaJIT
cd LuaJIT
make
sudo make install
```

#### 2. 运行 LuaJIT

使用 `luajit` 命令来运行 LuaJIT：
```sh
luajit your_script.lua
```

#### 3. LuaJIT 与标准 Lua 的差异

虽然 LuaJIT 兼容大多数标准 Lua 5.1 的特性，但仍有一些差异。Lua 5.2 和 5.3 引入的新特性不支持，比如新版本的模块系统。标准库和 5.1 相同，个别边界条件下行为可能不同。

### LuaJIT 的性能优化

把脚本里性能关键的代码路径识别出来，LuaJIT 会重点优化它们。内存分配和回收它也有一套改进的实现。要跨语言就优先用 FFI，直接调 C 函数，调用开销比传统方式小。

### LuaJIT 的最佳实践

用 `luajit -jdump` 这类性能分析工具盯住编译情况，性能问题才有得查。C 函数调用能少则少，跨语言交互本身有成本。迁移到 LuaJIT 前先验证脚本的兼容性，尤其是依赖特定 Lua 5.1 版本特性的部分。