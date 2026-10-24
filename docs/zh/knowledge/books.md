# 书籍与论文记录

书籍与论文的引用散见正文和附录，我把出处、作者、相关知识点和站内对应笔记放在一处，方便回查。

## 书籍

### 《Programming in Lua》（第 4 版）

Lua 官方作者 Roberto Ierusalimschy 所著的语言类书籍，第 4 版对应 Lua 5.3。第 1 版在官网免费阅读：<https://www.lua.org/pil/>。

对应知识点：语言层细节——数据类型、表与元表、闭包、协程、模块。

站内相关：[数据类型](/zh/basics/data-types)、[元表和元方法](/zh/basics/metatables-and-metamethods)、[闭包](/zh/advanced/closures)。

### 《Lua 程序设计（第 2 版）》

《Programming in Lua》第 1 版的中译本。

对应知识点：语言基础。

站内相关：[基本语法](/zh/basics/syntax)。

### 《Lua 设计与实现》/《Lua 源码剖析》

中文书籍，以 Lua 5.1/5.3 源码为主线，讲词法分析、虚拟机与垃圾回收。

对应知识点：解释器实现、虚拟机、GC。

站内相关：[设计与实现](/zh/design-and-implementation/README)、[Lua 5.5 源码解析](/zh/design-and-implementation/lua55-source)。

### 《Game Programming Patterns》

Robert Nystrom 著。其中 Interpreter / Bytecode 两章用通俗语言解释字节码虚拟机的动机与取舍。

对应知识点：字节码与虚拟机。

站内相关：[字节码与虚拟机](/zh/design-and-implementation/bytecode-and-vm)。

## 论文

### The Evolution of Lua

Roberto Ierusalimschy 等，HOPL III，2007。讲 Lua 从 1993 年到 2005 年的演化，解释为什么 Lua 选择表作为唯一的数据结构、为什么嵌入式优先。

对应知识点：历史与设计哲学。

站内相关：[Lua 的历史和发展](/zh/basics/history-and-development)、[Lua 的设计原理](/zh/design-and-implementation/design-principles)。

### The Implementation of Lua 5.0

JUCS，2005。系统介绍 Lua 的寄存器虚拟机、哈希表实现与函数调用约定。<https://www.lua.org/doc/jucs05.pdf>

对应知识点：虚拟机架构、字节码、函数调用约定。

站内相关：[虚拟机架构](/zh/design-and-implementation/vm-architecture)、[字节码与虚拟机](/zh/design-and-implementation/bytecode-and-vm)。

### Revisiting Coroutines

ACM TOPLAS，2009。讨论对称与非对称协程的语义差异。

对应知识点：协程语义与设计。

站内相关：[协程与并发编程](/zh/advanced/coroutines)、[协程的设计理念](/zh/design-and-implementation/coroutines-design)。

## 来源

书籍与论文信息取自附录的[相关资源与社区](/zh/appendix/resources)与[延伸阅读与参考资料](/zh/appendix/further-reading)；作者与出版信息以这两页所载为准。

## 参考资料

- [PIL · 起步](https://www.lua.org/pil/1.html)
- [Lua 官方文档索引](https://www.lua.org/docs.html)
- [Lua_(programming_language)](https://en.wikipedia.org/wiki/Lua_(programming_language))

<!-- BACKLINKS-AUTO -->
## 相关页面

- [README](README.md)
