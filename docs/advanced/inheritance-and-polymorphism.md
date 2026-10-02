在 Lua 中，继承和多态是通过基于表的对象系统实现的。虽然 Lua 本身并没有直接的面向对象编程支持，但可以通过表和元表（metatables）来模拟这些特性。以下是如何在 Lua 中实现继承和多态的详细介绍。

### 1. 继承

**继承** 是面向对象编程中的一个重要特性，它允许一个类（子类）继承另一个类（父类）的属性和方法。Lua 的继承机制基于原型链（prototype chain），使用元表（metatable）来实现。

#### 1.1 基本继承实现

首先定义一个父类 `Animal`，然后创建一个 `Dog` 类继承 `Animal` 类：

```lua
-- 定义父类 Animal
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

-- 定义子类 Dog 继承 Animal
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

在上面的代码中：

- `Animal` 是父类，提供了基本的 `speak` 方法。
- `Dog` 通过设置 `__index` 元表为 `Animal`，实现了继承。
- `Dog:new` 调用 `Animal.new` 方法来初始化父类属性，并增加了自己的属性 `breed`。
- `Dog:speak` 重写了 `Animal` 的 `speak` 方法，展示了子类特有的行为。

#### 1.2 使用继承

创建 `Dog` 的实例并调用方法：

```lua
local myDog = Dog:new("Rex", "German Shepherd")
myDog:speak()  -- 输出: Rex barks.
```

### 2. 多态

**多态** 允许不同类的对象以相同的接口调用不同的实现。在 Lua 中，多态通常通过方法重写来实现，这意味着子类可以重写父类的方法，并提供自己的实现。

#### 2.1 多态实现示例

继续使用上面的 `Animal` 和 `Dog` 示例，并添加一个新的子类 `Cat`，实现多态：

```lua
-- 定义子类 Cat 继承 Animal
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

在这个示例中：

- `Cat` 类继承自 `Animal` 类。
- `Cat:speak` 方法重写了 `Animal` 的 `speak` 方法，提供了 `Cat` 的具体实现。

#### 2.2 使用多态

通过创建 `Animal` 类型的变量来演示多态：

```lua
local function makeAnimalSpeak(animal)
    animal:speak()
end

local myDog = Dog:new("Rex", "German Shepherd")
local myCat = Cat:new("Whiskers", "White")

makeAnimalSpeak(myDog)  -- 输出: Rex barks.
makeAnimalSpeak(myCat)  -- 输出: Whiskers meows.
```

在这个例子中：

- `makeAnimalSpeak` 函数接受任何类型的 `Animal` 对象，并调用其 `speak` 方法。
- 实际调用的是每个具体对象（`Dog` 或 `Cat`）重写的 `speak` 方法，实现了多态。

### 3. 总结

- **继承**：在 Lua 中，继承通过设置元表（metatable）的 `__index` 实现，使子类可以继承父类的方法和属性。
- **多态**：多态通过方法重写来实现，不同的类可以定义相同的方法名，但提供不同的实现。

这种基于表和元表的继承和多态机制，使得 Lua 的面向对象编程非常灵活，并且适用于各种编程场景。