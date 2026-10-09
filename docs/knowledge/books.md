# 权威书籍要点

站内对书籍与论文的引用集中在附录两页，正文里零散提到。这里按条目收拢：书名（或论文名）、作者、它对应的知识点，再给回站内相关章节。

## 书籍

### 《Programming in Lua》（第 4 版）

Lua 官方作者 Roberto Ierusalimschy 写的语言教程，第 4 版对应 Lua 5.3。第 1 版在官网免费阅读：<https://www.lua.org/pil/>。

对应知识点：语言层细节——数据类型、表与元表、闭包、协程、模块。

站内相关：[数据类型](/basics/data-types)、[元表和元方法](/basics/metatables-and-metamethods)、[闭包](/advanced/closures)。

### 《Lua 程序设计（第 2 版）》

《Programming in Lua》第 1 版的中译本，面向入门读者。

对应知识点：语言基础入门。

站内相关：[基本语法](/basics/syntax)。

### 《Lua 设计与实现》/《Lua 源码剖析》

中文书籍，以 Lua 5.1/5.3 源码为主线，讲词法分析、虚拟机与垃圾回收。

对应知识点：解释器实现、虚拟机、GC。

站内相关：[设计与实现](/design-and-implementation/README)、[Lua 5.5 源码解析](/design-and-implementation/lua55-source)。

### 《Game Programming Patterns》

Robert Nystrom 著。其中 Interpreter / Bytecode 两章用通俗语言解释字节码虚拟机的动机与取舍。

对应知识点：字节码与虚拟机。

站内相关：[字节码与虚拟机](/design-and-implementation/bytecode-and-vm)。

## 论文

### The Evolution of Lua

Roberto Ierusalimschy 等，HOPL III，2007。讲 Lua 从 1993 年到 2005 年的演化，解释为什么 Lua 选择表作为唯一的数据结构、为什么嵌入式优先。

对应知识点：历史与设计哲学。

站内相关：[Lua 的历史和发展](/basics/history-and-development)、[Lua 的设计原理](/design-and-implementation/design-principles)。

### The Implementation of Lua 5.0

JUCS，2005。系统介绍 Lua 的寄存器虚拟机、哈希表实现与函数调用约定。<https://www.lua.org/doc/jucs05.pdf>

对应知识点：虚拟机架构、字节码、函数调用约定。

站内相关：[虚拟机架构](/design-and-implementation/vm-architecture)、[字节码与虚拟机](/design-and-implementation/bytecode-and-vm)。

### Revisiting Coroutines

ACM TOPLAS，2009。讨论对称与非对称协程的语义差异。

对应知识点：协程语义与设计。

站内相关：[协程与并发编程](/advanced/coroutines)、[协程的设计理念](/design-and-implementation/coroutines-design)。

## 来源

书籍与论文信息取自附录的[相关资源与社区](/appendix/resources)与[扩展阅读与学习资源](/appendix/further-reading)；作者与出版信息以这两页所载为准。
