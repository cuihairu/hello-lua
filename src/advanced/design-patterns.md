面向对象设计模式是用于解决常见编程问题的解决方案。在 Lua 中，虽然没有内建的面向对象支持，但可以通过表和元表模拟这些设计模式。以下是一些常见的面向对象设计模式，并且我们会展示如何在 Lua 中实现这些模式。

### 1. 单例模式（Singleton）

**单例模式** 确保一个类只有一个实例，并提供一个全局访问点。以下是 Lua 中单例模式的实现：

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

-- 使用单例模式
local singleton1 = Singleton:getInstance()
local singleton2 = Singleton:getInstance()

singleton1:showMessage()  -- 输出: This is a singleton instance.
print(singleton1 == singleton2)  -- 输出: true
```

### 2. 工厂模式（Factory）

**工厂模式** 提供一个创建对象的接口，而不暴露创建逻辑。以下是 Lua 中工厂模式的实现：

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

-- 使用工厂模式
local dog = AnimalFactory:createAnimal("dog", "Rex")
dog:bark()  -- 输出: Rex barks!

local cat = AnimalFactory:createAnimal("cat", "Whiskers")
cat:meow()  -- 输出: Whiskers meows!
```

### 3. 观察者模式（Observer）

**观察者模式** 定义了一种一对多的依赖关系，使得当一个对象状态改变时，所有依赖于它的对象都会得到通知并自动更新。以下是 Lua 中观察者模式的实现：

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

-- 使用观察者模式
local subject = Subject:new()

local observer1 = Observer:new("Observer1")
local observer2 = Observer:new("Observer2")

subject:addObserver(observer1)
subject:addObserver(observer2)

subject:notifyObservers("Hello Observers!") 
-- 输出: Observer1 received message: Hello Observers!
--       Observer2 received message: Hello Observers!
```

### 4. 策略模式（Strategy）

**策略模式** 定义了一系列算法，将每一个算法封装起来，并使它们可以互相替换。以下是 Lua 中策略模式的实现：

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

-- 使用策略模式
local addStrategy = Strategy:new(function(a, b) return a + b end)
local subtractStrategy = Strategy:new(function(a, b) return a - b end)

local context = Context:new(addStrategy)
print(context:performAction(10, 5))  -- 输出: 15

context:setStrategy(subtractStrategy)
print(context:performAction(10, 5))  -- 输出: 5
```

### 5. 装饰器模式（Decorator）

**装饰器模式** 动态地给对象添加一些额外的职责。以下是 Lua 中装饰器模式的实现：

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

-- 使用装饰器模式
local coffee = Coffee:new()
print("Cost of coffee: " .. coffee:cost())  -- 输出: Cost of coffee: 5

local milkCoffee = MilkDecorator:new(coffee)
print("Cost of milk coffee: " .. milkCoffee:cost())  -- 输出: Cost of milk coffee: 7
```

### 总结

- **单例模式** 确保一个类只有一个实例，并提供全局访问点。
- **工厂模式** 提供一个创建对象的接口，而不暴露创建逻辑。
- **观察者模式** 使得对象状态改变时，所有依赖于它的对象都会得到通知。
- **策略模式** 封装一系列算法，并使它们可以互相替换。
- **装饰器模式** 动态地给对象添加额外的职责。

这些设计模式可以帮助你在 Lua 中实现更灵活和可维护的代码结构。