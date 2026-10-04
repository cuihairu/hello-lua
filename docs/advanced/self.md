# self 的作用

`self` 是 Lua 面向对象编程的核心概念：它指代"当前这个方法正在操作的那个对象"。Lua 本身并没有 `self` 关键字，我们看到的 `self` 只是一个约定俗成的参数名，由冒号（`:`）语法糖自动传入。

## 1. 冒号语法糖与隐式 self

用冒号定义方法时，Lua 会自动给函数加上一个名为 `self` 的隐藏参数；用冒号调用时，Lua 会自动把冒号前的对象作为第一个参数传进去：

```lua
local Dog = {}
Dog.__index = Dog

function Dog.new(name)
    return setmetatable({ name = name }, Dog)
end

function Dog:bark()           -- 等价于 function Dog.bark(self)
    print(self.name .. " says: Woof!")
end

local dog = Dog.new("Rex")
dog:bark()          -- 常规写法：把 dog 作为 self 传入
Dog.bark(dog)       -- 等价写法：显式地把 dog 作为第一个参数传入
-- 输出
-- Rex says: Woof!
-- Rex says: Woof!
```

也就是说，`obj:method(a)` 与 `obj.method(obj, a)` 完全等价，`self` 只是被隐藏起来的第一个参数。理解了这一点，冒号与点号的选择就不再神秘：**定义和调用都用冒号，`self` 就会自动就位**。

## 2. self 让方法操作各自的数据

`self` 的意义在于让同一个方法服务于不同的对象——每个实例有自己的字段，方法通过 `self` 访问"自己的"那份：

```lua
local Counter = {}
Counter.__index = Counter

function Counter:increment(step)
    self.count = self.count + (step or 1)
    return self.count
end

local c1 = setmetatable({ count = 0 }, Counter)
local c2 = setmetatable({ count = 100 }, Counter)

print(c1:increment())    -- 输出 1
print(c2:increment())    -- 输出 101
print(c2:increment(10))  -- 输出 111
```

同一个 `increment` 函数，因为传入的 `self` 不同，操作的就是不同的计数器。如果没有 `self`，方法就无法知道自己该修改哪个对象的数据。

## 3. 常见错误：点号与冒号混用

冒号定义的方法第一个参数是 `self`，若改用点号调用，这个参数不会被传入，函数内的 `self` 就是 `nil`：

```lua
local Counter = {}

function Counter:increment(step)
    self.count = self.count + (step or 1)
    return self.count
end

local ok, err = pcall(Counter.increment)   -- 忘了传 self
print(ok)   -- 输出 false
print(err)  -- 输出形如 "demo.lua:4: attempt to index a nil value (local 'self')"
```

反过来，"点号定义、冒号调用"同样会出错——冒号会把对象本身当作第一个参数传进去，与函数定义的参数表错位。因此实战中的准则是：需要 `self` 的方法一律用冒号定义、用冒号调用；确实不需要 `self` 的函数（如构造函数 `Dog.new`）则用点号。

## 4. self 与继承、多态

在基于元表的继承体系中，`self` 是实现方法复用和多态的关键：子类方法中 `self` 仍指向实际的调用对象，因此父类逻辑操作的是子类实例的字段：

```lua
local Account = {}
Account.__index = Account

function Account.new(balance)
    return setmetatable({ balance = balance }, Account)
end

function Account:withdraw(amount)
    self.balance = self.balance - amount
    return self.balance
end

-- LimitedAccount 继承 Account：找不到的方法会顺着 __index 找到 Account
local LimitedAccount = setmetatable({}, { __index = Account })
LimitedAccount.__index = LimitedAccount

function LimitedAccount.new(balance, limit)
    local obj = Account.new(balance)   -- obj 的元表先是 Account
    obj.limit = limit
    return setmetatable(obj, LimitedAccount)   -- 换成子类的元表
end

-- 重写（多态）：同名方法覆盖父类实现
function LimitedAccount:withdraw(amount)
    if amount > self.limit then
        return nil, "over limit"
    end
    return Account.withdraw(self, amount)   -- 显式把 self 传给父类方法
end

local acc = Account.new(100)
print(acc:withdraw(30))          -- 输出 70

local lacc = LimitedAccount.new(100, 50)
print(lacc:withdraw(30))         -- 输出 70（子类规则允许）
print(lacc:withdraw(80))         -- 输出 nil	over limit
print(lacc.balance)              -- 输出 70（前一次取款已生效）
```

注意 `Account.withdraw(self, amount)` 这种写法：在子类方法里调用父类的同名方法时，冒号语法糖不适用（写 `Account:withdraw(amount)` 会把 `Account` 表本身当作 `self`），必须显式地把 `self` 作为第一个参数传回去。

## 5. 回调中丢失 self

把方法当作回调函数传递时（事件处理、定时器、排序比较函数等），方法会和它的对象"脱钩"，调用时 `self` 变成 `nil`：

```lua
local Dog = {}
Dog.__index = Dog

function Dog.new(name)
    return setmetatable({ name = name }, Dog)
end

function Dog:bark()
    print(self.name .. " says: Woof!")
end

local dog = Dog.new("Rex")

-- 错误示范：把方法本身当普通函数传出去，调用时 self 丢了
local ok, err = pcall(dog.bark)
print(ok)    -- 输出 false
print(err)   -- 输出形如 "demo.lua:9: attempt to index a nil value (local 'self')"

-- 正确做法一：包一层闭包，把 self 捕获进来
local bark = function() dog:bark() end
bark()       -- 输出 Rex says: Woof!

-- 正确做法二：调用时手动补上 self
local bark2 = dog.bark
bark2(dog)   -- 输出 Rex says: Woof!
```

两种做法中，闭包方式最常用，它把对象和方法一起"打包"，回调无论被谁调用都不会再丢失 `self`。

## 结语

`self` 没有任何魔法，它只是冒号语法糖自动传入的第一个参数。三条规则避开绝大多数问题：冒号定义配冒号调用；跨类复用方法时显式传递 `self`（如 `Account.withdraw(self, amount)`）；把方法作为回调传递时用闭包绑定对象。
