# 进阶Lua编程

掌握了基本语法和数据结构之后，剩下的内容集中在四个方向：函数编程、面向对象编程、模块与包、错误处理。Lua 语言本身很小，这些高级用法大多是用表和函数两个基础构件搭出来的。

## 1. 函数编程

Lua 中函数是一等值，可以存进变量、当参数传、当返回值返回。闭包、高阶函数、匿名函数都建立在这之上。

- [闭包（Closures）](./closures.md)
- [高阶函数](./higher-order-functions.md)
- [匿名函数](./anonymous-functions.md)

## 2. 面向对象编程

Lua 没有内置的面向对象机制，类、继承、多态都要靠表（Tables）和元表（Metatables）自己搭。这一组文章讲的就是怎么搭。

- [self 的作用](./self.md)
- [基于表的对象系统](./object-system.md)
- [继承与多态](./inheritance-and-polymorphism.md)
- [面向对象设计模式](./design-patterns.md)
- [面向对象的实现](./oop-implementation.md)

## 3. 模块与包

这一部分讲代码组织：模块怎么定义、怎么加载，第三方包怎么安装和管理。

- [模块的定义与加载](./module-definition.md)
- [Lua的包管理](./package-management.md)
- [常用Lua模块介绍](./common-modules.md)

## 4. 错误处理

程序跑起来总会出错。这一部分讲错误怎么抛出、怎么捕获，以及出错之后有哪些类型可查、怎么调试。

- [错误处理机制](./error-handling-mechanism.md)
- [错误类型与调试](./error-types-debugging.md)
