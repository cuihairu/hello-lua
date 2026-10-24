# 源码、论文与延伸阅读

这些是我查 Lua 设计、源码与工程问题时用过或记下的材料，按主题放在一起，方便回查。

## 1. 论文：理解设计决策

The Evolution of Lua（Roberto Ierusalimschy 等，HOPL III, 2007）讲 Lua 从 1993 年到 2005 年的演化，解释了为什么 Lua 选择表作为唯一的数据结构、为什么嵌入式优先。The Implementation of Lua 5.0（JUCS, 2005）系统介绍 Lua 的寄存器虚拟机、哈希表实现与函数调用约定，是理解字节码与虚拟机章节的经典文献：<https://www.lua.org/doc/jucs05.pdf>。Revisiting Coroutines（ACM TOPLAS, 2009）讨论对称与非对称协程的语义差异，与站内协程主题相关。

## 2. 官方手册与源码阅读

- Lua 5.5 参考手册：<https://www.lua.org/manual/5.5/>，第 2 章（语言）和第 3 章（标准库）覆盖新版本的语言与库变化；旧版手册（如 [5.4](https://www.lua.org/manual/5.4/)）仍在原地址维护。
- 源码阅读路线（约 3 万行 C 代码，核心文件更少）：
  1. `llex.c` / `lparser.c` / `lcode.c`：词法分析、语法分析与代码生成，直接生成字节码，不经过 AST；
  2. `lopcodes.h` / `lvm.c`：指令编码与虚拟机主循环 `luaV_execute`；
  3. `lgc.c`：增量标记-清除与分代回收的实现；
  4. `lapi.c` / `lstate.c`：C API 与 `lua_State`（协程线程）的管理；
  5. `ldo.c`：调用栈与错误处理（setjmp/longjmp）。
- 源码在线浏览：<https://www.lua.org/source/>，或 GitHub 镜像 <https://github.com/lua/lua>；站内的 [Lua 5.5 源码解析](/zh/design-and-implementation/lua55-source) 按 v5.5.1 逐文件走过一遍，可作这条路线的对照读本。

## 3. 书籍

《Programming in Lua》第 4 版是 Lua 官方作者 Roberto Ierusalimschy 所著的语言类书籍，第 4 版对应 Lua 5.3；第 1 版免费：<https://www.lua.org/pil/>。《Lua 设计与实现》（中文）以 5.1/5.3 源码为主线讲解词法分析、虚拟机与 GC。《Game Programming Patterns》中的 Interpreter / Bytecode 章节（Robert Nystrom）用通俗语言解释字节码虚拟机的动机与取舍。

## 4. 工具实践

- `luac -l -l`：查看编译器生成的真实字节码，是验证虚拟机相关表述的第一手工具：

  ```bash
  echo 'local a = 10 + 5' > /tmp/t.lua
  luac -l -l /tmp/t.lua
  ```

- `collectgarbage("count")` / `collectgarbage("step")`：观察 GC 行为与内存曲线。
- LuaJIT 的 `jit.dump` 与 `-jp` 分析器：查看 trace 编译与采样分析结果，理解 JIT 与解释器的差异。

## 5. 社区资料

lua-users wiki 的 LuaImplementations 条目（<http://lua-users.org/wiki/LuaImplementations>）对比了各 Lua 实现，Lua、LuaJIT、Ravi、PUC Lua 衍生版都在其中。LuaJIT 扩展文档（<https://luajit.org/extensions.html>）说明 FFI、`bit` 库以及与 Lua 5.1/5.2/5.3 的差异。awesome-lua（<https://github.com/LewisJEllis/awesome-lua>）是第三方库与工具清单。

## 我的源码阅读顺序

我读源码时会先用 `luac -l -l` 看实际字节码，再读《The Implementation of Lua 5.0》补原理，然后沿“解析器 → 虚拟机 → GC → C API”往下看；有疑问时回到官方手册核对。这条顺序把几个实现主题串了起来。工具安装与社区求助渠道见[Lua相关资源与社区](/zh/appendix/resources)。

## 参考资料

- [PIL · 进阶主题](https://www.lua.org/pil/14.html)
- [Lua 官方文档索引](https://www.lua.org/docs.html)
- [Lua_(programming_language)](https://en.wikipedia.org/wiki/Lua_(programming_language))

<!-- BACKLINKS-AUTO -->
## 相关页面

- [resources](resources.md)
- [README](/zh/knowledge/README.md)
- [books](/zh/knowledge/books.md)
- [official-docs](/zh/knowledge/official-docs.md)
