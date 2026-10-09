# 面向对象编程

Lua 没有内建的类和继承机制，对象、继承、多态都靠表加元表搭出来。本组五页，从 `self` 到设计模式一路展开：

- [self 的作用](/advanced/self)：冒号语法糖隐式传入的 `self` 从哪来。
- [基于表的对象系统](/advanced/object-system)：用表和元表定义类、创建实例，继承与组合两种复用方式。
- [继承与多态](/advanced/inheritance-and-polymorphism)：`__index` 挂出原型链，方法重写实现多态。
- [面向对象设计模式](/advanced/design-patterns)：单例、工厂、观察者、策略、装饰器五种模式的 Lua 写法。
- [面向对象的实现](/advanced/oop-implementation)：从实现层面统一解释 `__index` 索引链这条主线。

## 结语

`setmetatable` 造实例，`__index` 挂继承，方法重写实现多态。Lua 的面向对象没有新机制，全是表和元表的约定。
