# Inheritance and Polymorphism

Lua itself has no direct support for object-oriented programming; inheritance and polymorphism both have to be built out of tables and metatables.

## 1. Inheritance

Inheritance lets one class (a subclass) pick up the properties and methods of another (a parent class). Lua's inheritance mechanism is based on a prototype chain and is implemented with metatables.

### 1.1 A Basic Inheritance Implementation

First define a parent class `Animal`, then create a `Dog` class that inherits from `Animal`:

```lua
-- define the parent class Animal
local Animal = {}
Animal.__index = Animal

function Animal:new(name)
    local instance = setmetatable({}, self)
    instance.name = name
    return instance
end

function Animal:speak()
    print(self.name .. " makes a sound.")
end

-- define the subclass Dog, inheriting from Animal
local Dog = setmetatable({}, { __index = Animal })
Dog.__index = Dog

function Dog:new(name, breed)
    local instance = Animal.new(self, name)
    instance.breed = breed
    return instance
end

function Dog:speak()
    print(self.name .. " barks.")
end
```

In the code above:

- `Animal` is the parent class and provides the basic `speak` method.
- `Dog` implements inheritance by setting the `__index` metatable to `Animal`.
- `Dog:new` calls the `Animal.new` method to initialize the parent's properties and adds its own property, `breed`.
- `Dog:speak` overrides `Animal`'s `speak` method, demonstrating behavior specific to the subclass.

### 1.2 Using Inheritance

Create a `Dog` instance and call its method:

```lua
local myDog = Dog:new("Rex", "German Shepherd")
myDog:speak()  -- Rex barks.
```

## 2. Polymorphism

Polymorphism lets objects of different classes be called through the same interface with different implementations. In Lua, polymorphism is achieved through method overriding: a subclass defines a method with the same name as the parent's and replaces the parent's version.

### 2.1 A Polymorphism Implementation Example

Continuing with the `Animal` and `Dog` examples above, add a new subclass `Cat` to demonstrate polymorphism:

```lua
-- define the subclass Cat, inheriting from Animal
local Cat = setmetatable({}, { __index = Animal })
Cat.__index = Cat

function Cat:new(name, color)
    local instance = Animal.new(self, name)
    instance.color = color
    return instance
end

function Cat:speak()
    print(self.name .. " meows.")
end
```

In this example:

- The `Cat` class inherits from the `Animal` class.
- The `Cat:speak` method overrides `Animal`'s `speak` method and supplies `Cat`'s concrete implementation.

### 2.2 Using Polymorphism

Demonstrate polymorphism by creating a variable of type `Animal`:

```lua
local function makeAnimalSpeak(animal)
    animal:speak()
end

local myDog = Dog:new("Rex", "German Shepherd")
local myCat = Cat:new("Whiskers", "White")

makeAnimalSpeak(myDog)  -- Rex barks.
makeAnimalSpeak(myCat)  -- Whiskers meows.
```

In this example:

- The `makeAnimalSpeak` function accepts any `Animal`-type object and calls its `speak` method.
- What is actually called is each concrete object's (`Dog` or `Cat`) overridden `speak` method, which realizes polymorphism.

## 3. Summary

Inheritance is implemented by pointing the metatable's `__index` at the parent class, so the subclass picks up the parent's methods and properties. Polymorphism is implemented through method overriding: different classes define the same method name, each supplying its own implementation. Neither requires extra support from the language — tables and metatables are enough.

## References

- [Lua 5.4 reference manual · 2.6 Tables](https://www.lua.org/manual/5.4/manual.html#2.6)
- [Object-oriented_programming](https://en.wikipedia.org/wiki/Object-oriented_programming)
- [Operator_overloading](https://en.wikipedia.org/wiki/Operator_overloading)
- [Prototype-based_programming](https://en.wikipedia.org/wiki/Prototype-based_programming)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [object-oriented](object-oriented.md)
- [oop-implementation](oop-implementation.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
