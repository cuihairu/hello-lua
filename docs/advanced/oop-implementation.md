# 面向对象的实现

前面的章节从写法层面介绍了 self、类与继承，本章回到实现层面：Lua 语言里没有 `class` 关键字，也没有内建的继承。所谓面向对象，是用「表 + 元表」这套语言自带的机制在库层面搭出来的设施。理解了 `__index` 索引链这条主线，类、继承、多态、封装的种种写法就都有了统一的解释。

## 1. 原理：没有类，只有 `__index` 索引链

Lua 只有 table 这一种复合数据结构，"对象"就是一张表，"类"也只是另一张存放方法的表。把两者连起来的是元方法 `__index`，它接管"读取表中不存在的字段"这件事：

- 读取 `t.k` 时，Lua 先在表 `t` 本身查找；查不到，再看 `t` 的元表里有没有 `__index`。
- `__index` 是一张表：到那张表里继续找 `k`，而那张表自己也可以有元表、有自己的 `__index`。如此层层接续，形成一条索引链。
- `__index` 是一个函数：改调用 `__index(t, k)`，用返回值当作读取结果。
- 整条链都找不到，结果才是 `nil`。读取走链，写入不走链：`t.k = v` 永远写在 `t` 自己身上（除非元表定义了 `__newindex`）。

```lua
-- __index 是函数：所有缺失字段的读取都由它接管
local defaults = setmetatable({}, {
    __index = function(t, k)
        return "<default:" .. k .. ">"
    end
})

print(defaults.anything)   -- 输出 <default:anything>
print(defaults.name)       -- 输出 <default:name>
```

```lua
-- __index 是表：缺失字段沿链向上找
local base   = { greeting = "hello" }
local middle = setmetatable({}, { __index = base })
local top    = setmetatable({}, { __index = middle })

print(top.greeting)             -- 输出 hello（top → middle → base，沿链找到）
print(rawget(top, "greeting"))  -- 输出 nil（rawget 只看本表，不走链）

top.greeting = "hi"             -- 写入永远落在本表
print(top.greeting)             -- 输出 hi
print(middle.greeting)          -- 输出 hello（middle 不受影响）
```

`rawget(t, k)` 的意义正在这里：它跳过元表、只查 `t` 本身。后面排查"这个字段到底存在哪一层"时，它是最直接的工具。

## 2. 类的写法：`setmetatable` + `__index`

### 2.1 把类表自己当实例的元表

标准写法只有三步：建一张类表；让 `Class.__index = Class`；构造函数里 `setmetatable({}, self)` 造实例。这样实例查不到的字段会落到类上。字段存各实例自己身上，方法只在类表存一份，所有实例共享：

```lua
local Dog = {}
Dog.__index = Dog            -- 实例查不到的字段，到 Dog 上找

function Dog:new(name, age)  -- 冒号定义，self 指向"正在构造谁的实例"
    local instance = setmetatable({}, self)
    instance.name = name
    instance.age = age
    return instance
end

function Dog:bark()
    print(self.name .. ": woof")
end

local rex = Dog:new("Rex", 3)
rex:bark()                        -- 输出 Rex: woof

print(getmetatable(rex) == Dog)   -- 输出 true（实例的元表就是类本身）
print(rawget(rex, "bark"))        -- 输出 nil（方法不在实例上）
print(rex.bark == Dog.bark)       -- 输出 true（bark 是沿链找到的同一个函数）
```

### 2.2 构造函数里的 `self`：子类免写构造器

`new` 里写 `self` 而不是写死 `Dog`，是这套写法的关键细节。构造器被子类沿链继承时，`self` 指向的是发起调用的那个类。于是同一个构造器造出来的实例自动挂到子类上：

```lua
local Dog = {}
Dog.__index = Dog

function Dog:new(name)
    local instance = setmetatable({}, self)   -- self 是谁，实例就挂到谁
    instance.name = name
    return instance
end

local Puppy = setmetatable({}, { __index = Dog })
Puppy.__index = Puppy

-- Puppy 没有定义 new：调用沿链找到 Dog.new，此时 self 是 Puppy
local bit = Puppy:new("Bit")
print(getmetatable(bit) == Puppy)   -- 输出 true（实例挂到了子类）
print(getmetatable(bit) == Dog)     -- 输出 false
```

如果构造函数里写死 `setmetatable({}, Dog)`，这段代码造出的实例就全都会挂到 `Dog` 上，子类字段和方法将无法通过实例访问。

## 3. 继承：`__index` 指向父类

### 3.1 一个表只有一张元表，所以继承要接两处

"实例 → 类"与"类 → 父类"是两条不同的链，而一张表只能挂一张元表，所以两处要用两种接法：

- 实例的元表直接用类本身，因为 `Class.__index = Class`，读取才落到类上；
- 子类的元表是一张一次性元表 `{ __index = Parent }`，只负责"子类缺的东西到父类找"。

### 3.2 多级原型链：逐层 `setmetatable`

子类再被子类继承时同样处理，链条自动延长。下面的例子里三层类共用 `Animal.new`，方法查找沿 `Puppy → Dog → Animal` 进行：

```lua
local Animal = {}
Animal.__index = Animal

function Animal:new(name)
    local instance = setmetatable({}, self)
    instance.name = name
    return instance
end

function Animal:speak()
    return self.name .. " makes a sound"
end

function Animal:describe()
    return self.name .. " says: " .. self:speak()
end

local Dog = setmetatable({}, { __index = Animal })   -- 类 → 父类
Dog.__index = Dog                                    -- 实例 → 类

function Dog:speak()
    return self.name .. " barks"
end

local Puppy = setmetatable({}, { __index = Dog })    -- 再接一层
Puppy.__index = Puppy

function Puppy:speak()
    return Dog.speak(self) .. " (cutely)"   -- 借父类实现，再补充行为
end

local a = Animal:new("Generic")
local d = Dog:new("Rex")
local p = Puppy:new("Bit")

print(a:describe())   -- 输出 Generic says: Generic makes a sound
print(d:describe())   -- 输出 Rex says: Rex barks
print(p:describe())   -- 输出 Bit says: Bit barks (cutely)

-- 验证链条本身：Puppy 的元表只是中转站，方法都在各级类表上
local mt = getmetatable(Puppy)
print(rawget(mt, "speak"))          -- 输出 nil（元表上没有方法）
print(type(mt.__index))             -- 输出 table（__index 指向 Dog）
print(type(rawget(Dog, "speak")))   -- 输出 function（speak 定义在 Dog 上）
```

注意 `Dog.speak(self)`：在子类方法里调用父类同名方法时，必须用点号并显式传入 `self`（写 `Dog:speak()` 会把 `Dog` 表本身当 `self`）。原因见 [self 的作用](./self.md) 一章。

## 4. 多态与封装

### 4.1 多态：方法覆盖即生效

Lua 的方法查找本来就是"沿调用对象的链找"，没有 `virtual` 之类的声明。子类定义同名方法，就自然覆盖了沿链的父类实现。同一个调用点，传入不同对象就走各自的方法：

```lua
local Shape = {}
Shape.__index = Shape

function Shape:describe()
    return string.format("%s: area = %g", self.name, self:area())
end

local Circle = setmetatable({}, { __index = Shape })
Circle.__index = Circle

function Circle:new(r)
    local instance = setmetatable({ name = "Circle", r = r }, Circle)
    return instance
end

function Circle:area()
    return math.pi * self.r * self.r
end

local Square = setmetatable({}, { __index = Shape })
Square.__index = Square

function Square:new(side)
    local instance = setmetatable({ name = "Square", side = side }, Square)
    return instance
end

function Square:area()
    return self.side * self.side
end

for _, s in ipairs({ Circle:new(2), Square:new(3) }) do
    print(s:describe())     -- describe 只写一份，area 各走各的
end
-- 输出 Circle: area = 12.5664
-- 输出 Square: area = 9
```

### 4.2 封装：Lua 没有访问修饰符，用闭包实现私有

Lua 的表字段对所有代码开放，没有 `private`。实践中有两条路线。约定式是私有字段用 `_` 前缀命名（如 `self._balance`），零成本，但只是团队协定，挡不住访问。闭包式走另一头：把私有状态做成构造函数里的 `local`，公开方法作为闭包捕获它，外界无论怎么翻表都拿不到这些值，它们根本不在表里：

```lua
local Account = {}
Account.__index = Account

function Account.new(opening)
    local balance = opening                -- 私有成员：只是构造函数里的 local
    local self = setmetatable({}, Account)

    function self:deposit(amount)
        balance = balance + amount         -- 公开方法经由闭包改写它
    end

    function self:current()
        return balance
    end

    return self
end

local acc = Account.new(100)
acc:deposit(50)
print(acc:current())      -- 输出 150

print(acc.balance)        -- 输出 nil（表上没有 balance 字段，谁也读不走）
acc.balance = 1000000     -- 只是往表上放了一个无关字段
print(acc:current())      -- 输出 150（私有余额不受影响）
```

闭包式的代价也要清楚：方法随 `new` 逐实例创建（不在类表上共享），内存与构造开销都更大；而且方法不在类表上，第 3 节的 `__index` 继承链帮不上忙，闭包类要另做继承设计。因此它适合实例少、状态确需保护的对象（见第 5 节的对比）。

## 5. 常见变体：原型风格、类库风格与闭包类

同一套元机制可以搭出不同风格的面向对象设施。三种常见变体各有取舍。

### 5.1 原型风格（JS 系）

以"对象"为中心：没有独立的类，新对象直接以已有对象为原型，`Object.create(proto)` 的 Lua 对应物就是 `setmetatable({}, { __index = proto })`。字段实行"写时复制"。读默认值走原型，一写就落到自己身上：

```lua
local function clone(proto)
    return setmetatable({}, { __index = proto })
end

local counter = { count = 0 }        -- 这张表既是默认值载体，也是原型

function counter:inc(step)           -- 方法直接写在原型对象上
    self.count = self.count + (step or 1)
    return self.count
end

local c1 = clone(counter)
local c2 = clone(counter)            -- 两个克隆互不影响

print(c1:inc())        -- 输出 1（读 count 沿链取到 0，写入落在 c1 自己身上）
print(c2:inc(5))       -- 输出 5
print(counter.count)   -- 输出 0（原型上的默认值没动）
```

与 JavaScript 的对应关系：`Object.create` ≈ `clone`，`this` ≈ `self`，原型链就是 `__index` 链。适合配置对象、少层级的小规模场景。

### 5.2 类库风格（middleclass 等）

把第 2、3 节的手工仪式封装成库。以 middleclass 为例（需先 `luarocks install middleclass`），类、继承、实例检查都有现成入口：

```lua
local class = require("middleclass")

local Animal = class("Animal")

function Animal:initialize(name)     -- 构造器叫 initialize
    self.name = name
end

function Animal:speak()
    return self.name .. " makes a sound"
end

local Dog = Animal:subclass("Dog")   -- 一行完成继承

function Dog:speak()
    return self.name .. " barks"
end

local rex = Dog("Rex")               -- 类可像函数一样调用
print(rex:speak())                   -- 输出 Rex barks
print(rex.class.name)                -- 输出 Dog（class 是实例上指向类的字段）
print(rex:isInstanceOf(Animal))      -- 输出 true
```

类库内部仍然是用 `setmetatable` + `__index` 实现的，并没有脱离本章的机制；它买到的是一致的写法和现成的类操作 API。项目成规模、多人协作时值得引入，小脚本则未必需要这一层依赖。

### 5.3 闭包类

第 4 节出现过的路线独立成类：不用元表，把方法连同私有状态一起打包在构造函数里返回。方法不需要 `self`，因为要操作的状态都被闭包捕获了：

```lua
local function newStack()
    local items = {}                 -- 私有状态，不在返回的表上

    local function push(v) items[#items + 1] = v end
    local function pop() return table.remove(items) end
    local function size() return #items end

    return { push = push, pop = pop, size = size }
end

local s = newStack()
s.push("a")
s.push("b")
print(s.size())   -- 输出 2
print(s.pop())    -- 输出 b
print(s.pop())    -- 输出 a
```

### 5.4 三种变体对比

| 维度 | 元表类（第 2、3 节） | 原型风格 | 类库（middleclass） | 闭包类 |
| --- | --- | --- | --- | --- |
| 私有成员 | 无，靠命名约定 | 无，靠命名约定 | 无，靠命名约定 | 天然支持 |
| 继承 | `__index` 链手工接 | 原型链克隆，链自动延长 | `:subclass()` 一行 | 需另行设计，较费事 |
| 方法存储 | 类表一份，实例共享 | 原型表一份，实例共享 | 类表一份，实例共享 | 每个实例一套闭包 |
| 实例成本 | 一张表 + 一次 `setmetatable` | 一张表 + 一张一次性元表 | 同元表类（库内同机制） | 一张表 + 多个闭包 |
| 适用场景 | 通用写法，Lua 社区默认 | 配置对象、浅层级原型复用 | 中大型项目、想要成体系 API | 实例少、状态需保护的模块 |

## 6. 性能注意与坑

### 6.1 `__index` 查找链的成本

每次读取缺失字段都要走一遍链，方法调用 `obj:m()` 中的 `m` 也属于这种读取。链越长、调用越频繁，这笔查找开销就越显眼。热点路径上的对策是**把方法缓存到局部变量**，把链查找变成一次直接调用：

```lua
local Vec = {}
Vec.__index = Vec

function Vec.new(x, y)
    return setmetatable({ x = x, y = y }, Vec)
end

function Vec:norm2()
    return self.x * self.x + self.y * self.y
end

local v = Vec.new(3, 4)
local N = 10000000

local t0 = os.clock()
for _ = 1, N do v:norm2() end          -- 每次：查 m（走一次 __index）+ 调用
local t1 = os.clock()

local norm2 = Vec.norm2                -- 方法缓存成局部变量
for _ = 1, N do norm2(v) end           -- 直接调用，不再查表
local t2 = os.clock()

print(string.format("via __index : %.3fs", t1 - t0))
print(string.format("local cache : %.3fs", t2 - t1))
-- 两次输出为同机一次实测的示意值（10⁷ 次调用，约 0.83s 对 0.65s），
-- 绝对值因机器而异，差距方向稳定：局部缓存不慢于走链
```

除缓存方法外，还可以把热点字段直接放到实例上（缩短链深），或在模块顶层用 `local` 持有频繁访问的类和函数。

### 6.2 `new` 的分配成本

每次 `new` 都分配一张新表并挂元表。批量创建时，这直接体现为内存占用和垃圾回收压力：

```lua
local Point = {}
Point.__index = Point

function Point.new(x, y)
    return setmetatable({ x = x, y = y }, Point)
end

collectgarbage()
local before = collectgarbage("count")

local pts = {}
for i = 1, 100000 do
    pts[i] = Point.new(i, i)
end

collectgarbage("stop")
local after = collectgarbage("count")
print(string.format("10 万个实例驻留约 %.1f MB", (after - before) / 1024))
-- 实测输出约 12 MB（每实例约 0.12 KB），数值随 Lua 版本与平台略有出入
```

量大时的常见做法：对象池复用（`new` 少做，回收站多收）；纯数据对象改用平表（不挂元表，字段直接读写，少一层查找）；构造函数里避免再做重度初始化。

### 6.3 常见坑清单

最常踩的坑有五个。第一个是忘了 `Class.__index = Class`：`setmetatable({}, Class)` 之后实例上依然找不到方法，元表挂上了，但没有 `__index`，查找在实例处就停。

`pairs` 与 `#` 不走 `__index` 链，`pairs(instance)` 看不到类上的方法，继承来的字段也不计入 `#`，元表链只服务于普通读取。点号冒号混用是最多发的错误：`obj.m()` 丢 `self`，`Class:m(x)` 错位传参，详见 [self 的作用](./self.md)。

还有两条容易后知后觉。一张表只有一张元表，第二次 `setmetatable` 是整体替换，先挂的类链会静默丢失；`__newindex` 一旦定义就接管写入，普通赋值不再落在本表，要写入本表得用 `rawset`，给"带默认值的共享表"直接挂 `__newindex` 前先想清楚写入语义。

## 结语

Lua 的面向对象没有关键字加持，全部建立在一条 `__index` 索引链上：实例挂类的元表、类挂父类的元表，读取沿链上升，写入落在本地。把这条链想清楚，类的三步写法、多层继承、方法覆盖、闭包私有与各路变体，都是同一机制的不同组合方式；性能上的主要功课也只有两件：热点路径缓存方法，批量创建留意分配。

## 相关阅读

- [self 的作用](./self.md)
- [基于表的对象系统](./object-system.md)
- [继承与多态](./inheritance-and-polymorphism.md)
