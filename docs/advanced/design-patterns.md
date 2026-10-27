# Object-Oriented Design Patterns

Object-oriented design patterns solve common problems of organizing objects. Lua has no built-in object-oriented support, but tables and metatables are enough to implement these patterns. Below are five common patterns written in Lua.

## 1. Singleton Pattern

The Singleton pattern guarantees that a class has only one instance and provides a global point of access to it. In Lua the implementation relies on a local variable that caches the instance:

```lua
local Singleton = {}
Singleton.__index = Singleton

local instance

function Singleton:getInstance()
    if not instance then
        instance = setmetatable({}, Singleton)
    end
    return instance
end

function Singleton:showMessage()
    print("This is a singleton instance.")
end

-- using the Singleton pattern
local singleton1 = Singleton:getInstance()
local singleton2 = Singleton:getInstance()

singleton1:showMessage()  -- This is a singleton instance.
print(singleton1 == singleton2)  -- true
```

## 2. Factory Pattern

The Factory pattern provides an interface for creating objects without exposing the creation logic. The factory below decides whether to make a dog or a cat based on `animalType`:

```lua
local Dog = {}
Dog.__index = Dog

function Dog:new(name)
    local instance = setmetatable({}, self)
    instance.name = name
    return instance
end

function Dog:bark()
    print(self.name .. " barks!")
end

local Cat = {}
Cat.__index = Cat

function Cat:new(name)
    local instance = setmetatable({}, self)
    instance.name = name
    return instance
end

function Cat:meow()
    print(self.name .. " meows!")
end

local AnimalFactory = {}

function AnimalFactory:createAnimal(animalType, name)
    if animalType == "dog" then
        return Dog:new(name)
    elseif animalType == "cat" then
        return Cat:new(name)
    else
        error("Unknown animal type")
    end
end

-- using the Factory pattern
local dog = AnimalFactory:createAnimal("dog", "Rex")
dog:bark()  -- Rex barks!

local cat = AnimalFactory:createAnimal("cat", "Whiskers")
cat:meow()  -- Whiskers meows!
```

## 3. Observer Pattern

The Observer pattern defines a one-to-many dependency: when one object's state changes, every object depending on it is notified and updates itself automatically. The Subject keeps a list of observers and calls `update` on each one when notifying:

```lua
local Subject = {}
Subject.__index = Subject

function Subject:new()
    local instance = setmetatable({}, self)
    instance.observers = {}
    return instance
end

function Subject:addObserver(observer)
    table.insert(self.observers, observer)
end

function Subject:notifyObservers(message)
    for _, observer in ipairs(self.observers) do
        observer:update(message)
    end
end

local Observer = {}
Observer.__index = Observer

function Observer:new(name)
    local instance = setmetatable({}, self)
    instance.name = name
    return instance
end

function Observer:update(message)
    print(self.name .. " received message: " .. message)
end

-- using the Observer pattern
local subject = Subject:new()

local observer1 = Observer:new("Observer1")
local observer2 = Observer:new("Observer2")

subject:addObserver(observer1)
subject:addObserver(observer2)

subject:notifyObservers("Hello Observers!")
-- Observer1 received message: Hello Observers!
--       Observer2 received message: Hello Observers!
```

## 4. Strategy Pattern

The Strategy pattern encapsulates a family of algorithms separately so they can replace each other. The algorithm is injected into the Context as a function and can be swapped out at runtime:

```lua
local Strategy = {}
Strategy.__index = Strategy

function Strategy:new(strategyFunction)
    local instance = setmetatable({}, self)
    instance.strategyFunction = strategyFunction
    return instance
end

function Strategy:execute(...)
    return self.strategyFunction(...)
end

local Context = {}
Context.__index = Context

function Context:new(strategy)
    local instance = setmetatable({}, self)
    instance.strategy = strategy
    return instance
end

function Context:setStrategy(strategy)
    self.strategy = strategy
end

function Context:performAction(...)
    return self.strategy:execute(...)
end

-- using the Strategy pattern
local addStrategy = Strategy:new(function(a, b) return a + b end)
local subtractStrategy = Strategy:new(function(a, b) return a - b end)

local context = Context:new(addStrategy)
print(context:performAction(10, 5))  -- 15

context:setStrategy(subtractStrategy)
print(context:performAction(10, 5))  -- 5
```

## 5. Decorator Pattern

The Decorator pattern dynamically adds extra responsibilities to an object. MilkDecorator wraps a Coffee object, and `cost` adds 2 on top of the wrapped object's cost:

```lua
local Coffee = {}
Coffee.__index = Coffee

function Coffee:new()
    local instance = setmetatable({}, self)
    return instance
end

function Coffee:cost()
    return 5
end

local MilkDecorator = {}
MilkDecorator.__index = MilkDecorator

setmetatable(MilkDecorator, {
    __index = Coffee
})

function MilkDecorator:new(coffee)
    local instance = setmetatable({}, self)
    instance.coffee = coffee
    return instance
end

function MilkDecorator:cost()
    return self.coffee:cost() + 2
end

-- using the Decorator pattern
local coffee = Coffee:new()
print("Cost of coffee: " .. coffee:cost())  -- Cost of coffee: 5

local milkCoffee = MilkDecorator:new(coffee)
print("Cost of milk coffee: " .. milkCoffee:cost())  -- Cost of milk coffee: 7
```

## Summary

These five patterns rely on nothing beyond tables and metatables: the Singleton on a cached instance, the Factory on branching to pick a constructor, the Observer on a list of callbacks, the Strategy on storing a function as a field, and the Decorator on wrapping a layer and forwarding calls.

## References

- [PIL · Object-oriented programming](https://www.lua.org/pil/13.html)
- [Object-oriented_programming](https://en.wikipedia.org/wiki/Object-oriented_programming)
- [Prototype-based_programming](https://en.wikipedia.org/wiki/Prototype-based_programming)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [object-oriented](object-oriented.md)
- [core-concepts](/knowledge/core-concepts.md)
