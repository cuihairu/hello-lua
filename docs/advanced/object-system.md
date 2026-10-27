# A Table-Based Object System

Lua has no built-in class or inheritance mechanism, but using tables and metatables you can build up the object-oriented features of classes, instances, and inheritance.

## 1. Basic Concepts

Tables are Lua's core data structure — arrays, dictionaries, and objects can all be represented with one. The object system is built right on top of tables. Metatables attach behavior to tables, such as operator overloading, or performing a specific operation when a nonexistent field is accessed.

## 2. Defining Classes and Creating Instances

With tables and metatables, you can simulate the concepts of classes and instances. Here is a simple implementation:

### 2.1 Defining a Class

Defining a class usually involves creating a table and assigning it a metatable. That metatable will contain the class's methods.

```lua
local Dog = {}
Dog.__index = Dog

function Dog:new(name, age)
    local instance = setmetatable({}, self)
    instance.name = name
    instance.age = age
    return instance
end

function Dog:bark()
    print(self.name .. " says: Woof!")
end
```

In this example:

- The `Dog` table represents a class.
- `Dog.__index = Dog` lets instances of the `Dog` table access the methods defined on the `Dog` table.
- `Dog:new` is a constructor used to create a new `Dog` instance.
- `Dog:bark` is an instance method that every `Dog` instance can call.

### 2.2 Creating Instances

An instance is created by calling the `new` method:

```lua
local myDog = Dog:new("Rex", 5)
myDog:bark()  -- Rex says: Woof!
```

## 3. Inheritance

Lua supports prototype-based inheritance: create a new table and use it as an extension of an existing one.

### 3.1 Defining Inheritance

The example below builds a `Poodle` class on top of the `Dog` class and adds behavior specific to it:

```lua
local Poodle = setmetatable({}, { __index = Dog })
Poodle.__index = Poodle

function Poodle:new(name, age, size)
    local instance = Dog:new(name, age)
    setmetatable(instance, self)
    instance.size = size
    return instance
end

function Poodle:describe()
    print(self.name .. " is a " .. self.size .. " poodle.")
end
```

In this example:

- The `Poodle` table inherits the methods and properties of the `Dog` table through `setmetatable`.
- The `Poodle:new` method calls `Dog:new` to create a basic `Dog` instance and adds the `size` property.
- `Poodle:describe` is a method unique to the `Poodle` class, used to describe the dog's size.

### 3.2 Using Inheritance

Create a `Poodle` instance and use its specific method:

```lua
local myPoodle = Poodle:new("Fluffy", 3, "large")
myPoodle:bark()      -- Fluffy says: Woof!
myPoodle:describe()  -- Fluffy is a large poodle.
```

## 4. Composition

Besides inheritance, Lua's object system also achieves reuse through composition. Composition means extending functionality by making one object a property of another.

### 4.1 A Composition Example

```lua
local Engine = {}
Engine.__index = Engine

function Engine:new(type, horsepower)
    local instance = setmetatable({}, self)
    instance.type = type
    instance.horsepower = horsepower
    return instance
end

function Engine:info()
    print("Engine type: " .. self.type .. ", Horsepower: " .. self.horsepower)
end

local Car = {}
Car.__index = Car

function Car:new(make, model, engine)
    local instance = setmetatable({}, self)
    instance.make = make
    instance.model = model
    instance.engine = engine
    return instance
end

function Car:describe()
    print("Car make: " .. self.make .. ", model: " .. self.model)
    self.engine:info()
end
```

In this example:

- `Engine` represents an engine class.
- `Car` represents a car class and contains an `Engine` instance as a property.
- The `Car:describe` method calls the `Engine:info` method, demonstrating how composition is implemented.

### 4.2 Using Composition

```lua
local myEngine = Engine:new("V8", 400)
local myCar = Car:new("Ford", "Mustang", myEngine)
myCar:describe()
-- output:
-- Car make: Ford, model: Mustang
-- Engine type: V8, Horsepower: 400
```

## 5. Summary

Although Lua has no built-in class or inheritance mechanism, the combination of tables and metatables is enough to implement defining classes, creating instances, inheritance, and composition. The only primitives used throughout are `setmetatable` and `__index`; everything else is convention.

## References

- [Lua 5.4 reference manual · 2.6 Tables](https://www.lua.org/manual/5.4/manual.html#2.6)
- [Object-oriented_programming](https://en.wikipedia.org/wiki/Object-oriented_programming)
- [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [object-oriented](object-oriented.md)
- [oop-implementation](oop-implementation.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
