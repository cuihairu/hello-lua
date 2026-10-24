# Advanced Lua Programming

I split the advanced topics I actually hit in projects into four groups: functional programming, object-oriented programming, modules and packages, and error handling. The Lua language itself is tiny, so most of these techniques are combinations of the two basic building blocks — tables and functions.

## 1. Functional Programming

In Lua a function is a first-class value: you can store it in a variable, pass it as an argument, and return it as a result. Closures, higher-order functions and anonymous functions all build on that.

- [Closures](./closures.md)
- [Higher-order functions](./higher-order-functions.md)
- [Anonymous functions](./anonymous-functions.md)

## 2. Object-Oriented Programming

Lua has no built-in object system. Classes, inheritance and polymorphism are all your own construction on top of tables and metatables. This group is about how to build that.

- [The role of self](./self.md)
- [Table-based object systems](./object-system.md)
- [Inheritance and polymorphism](./inheritance-and-polymorphism.md)
- [OOP design patterns](./design-patterns.md)
- [Implementing OOP in Lua](./oop-implementation.md)

## 3. Modules and Packages

This part is about organizing code: how modules are defined and loaded, and how third-party packages are installed and managed.

- [Defining and loading modules](./module-definition.md)
- [Package management](./package-management.md)
- [Common Lua modules](./common-modules.md)

## 4. Error Handling

Programs run into errors. This part covers how errors are raised and caught, what kinds of error information you can inspect afterwards, and how to debug them.

- [How error handling works](./error-handling-mechanism.md)
- [Error types and debugging](./error-types-debugging.md)

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
