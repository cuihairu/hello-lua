# Implementing Object Orientation

I previously wrote up notes on `self`, and on the idioms for classes and inheritance; coming back to look at the implementation, Lua has no `class` keyword and no built-in inheritance. The object-oriented machinery is built at the library layer out of "tables + metatables." Following the `__index` lookup chain, the idioms for classes, inheritance, polymorphism, and encapsulation all map onto the same mechanism.

## 1. The Principle: No Classes, Only an `__index` Lookup Chain

Lua has only one composite data structure, the table. An "object" is just a table, and a "class" is only another table that holds methods. What ties the two together is the metamethod `__index`, which takes over the job of "reading a field that does not exist in the table":

- Reading `t.k`, Lua first looks in the table `t` itself; if it is not found there, it checks whether `t`'s metatable has an `__index`.
- If `__index` is a table: keep looking for `k` in that table, and that table itself may have a metatable with its own `__index`. The chain continues like this, layer upon layer, forming a lookup chain.
- If `__index` is a function: call `__index(t, k)` instead and use the return value as the read result.
- Only when the whole chain turns up nothing is the result `nil`. Reads walk the chain, but writes do not: `t.k = v` always writes to `t` itself (unless the metatable defines `__newindex`).

```lua
-- __index is a function: it takes over every read of a missing field
local defaults = setmetatable({}, {
    __index = function(t, k)
        return "<default:" .. k .. ">"
    end
})

print(defaults.anything)   -- <default:anything>
print(defaults.name)       -- <default:name>
```

```lua
-- __index is a table: missing fields are looked up up the chain
local base   = { greeting = "hello" }
local middle = setmetatable({}, { __index = base })
local top    = setmetatable({}, { __index = middle })

print(top.greeting)             -- hello (top → middle → base, found by walking the chain)
print(rawget(top, "greeting"))  -- nil (rawget looks only at the table itself, no chain)

top.greeting = "hi"             -- a write always lands on the table itself
print(top.greeting)             -- hi
print(middle.greeting)          -- hello (middle is unaffected)
```

`rawget(t, k)` matters precisely here: it skips the metatable and looks only at `t` itself. When you later need to work out "which layer a field actually lives on," it is the most direct tool.

## 2. The Class Idiom: `setmetatable` + `__index`

### 2.1 Using the Class Table Itself as the Instance's Metatable

The standard idiom has only three steps: build a class table; set `Class.__index = Class`; and create the instance inside the constructor with `setmetatable({}, self)`. That way any field an instance cannot find falls through onto the class. Fields live on each instance itself, while methods are stored once on the class table and shared by all instances:

```lua
local Dog = {}
Dog.__index = Dog            -- a field an instance cannot find is looked up on Dog

function Dog:new(name, age)  -- defined with a colon; self points at "whose instance is being constructed"
    local instance = setmetatable({}, self)
    instance.name = name
    instance.age = age
    return instance
end

function Dog:bark()
    print(self.name .. ": woof")
end

local rex = Dog:new("Rex", 3)
rex:bark()                        -- Rex: woof

print(getmetatable(rex) == Dog)   -- true (the instance's metatable is the class itself)
print(rawget(rex, "bark"))        -- nil (the method is not on the instance)
print(rex.bark == Dog.bark)       -- true (bark is the same function, found by walking the chain)
```

### 2.2 `self` in the Constructor: Subclasses Need No Constructor of Their Own

Writing `self` inside `new` rather than hard-coding `Dog` is the key detail of this idiom. When a subclass inherits the constructor through the chain, `self` points at the class that initiated the call. So instances produced by that very same constructor end up attached to the subclass automatically:

```lua
local Dog = {}
Dog.__index = Dog

function Dog:new(name)
    local instance = setmetatable({}, self)   -- whichever class self is, the instance attaches to it
    instance.name = name
    return instance
end

local Puppy = setmetatable({}, { __index = Dog })
Puppy.__index = Puppy

-- Puppy defines no new: the call walks the chain to Dog.new, and at that point self is Puppy
local bit = Puppy:new("Bit")
print(getmetatable(bit) == Puppy)   -- true (the instance attached to the subclass)
print(getmetatable(bit) == Dog)     -- false
```

If the constructor hard-coded `setmetatable({}, Dog)`, every instance this code produced would attach to `Dog`, and subclass fields and methods would no longer be reachable through the instance.

## 3. Inheritance: `__index` Points at the Parent

### 3.1 A Table Has Only One Metatable, So Inheritance Needs Two Hooks

"Instance → class" and "class → parent" are two different chains, and a table can hold only one metatable, so the two places need two different ways of hooking:

- The instance's metatable is the class itself, because `Class.__index = Class` is what makes the read land on the class;
- The subclass's metatable is a throwaway table `{ __index = Parent }` whose only job is "look for what the subclass lacks on the parent."

### 3.2 A Multi-Level Prototype Chain: `setmetatable` Layer by Layer

When a subclass is itself inherited by another subclass, the same treatment applies and the chain extends on its own. In the example below, three levels of classes share `Animal.new`, and method lookup runs along `Puppy → Dog → Animal`:

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

local Dog = setmetatable({}, { __index = Animal })   -- class → parent
Dog.__index = Dog                                    -- instance → class

function Dog:speak()
    return self.name .. " barks"
end

local Puppy = setmetatable({}, { __index = Dog })    -- one more layer
Puppy.__index = Puppy

function Puppy:speak()
    return Dog.speak(self) .. " (cutely)"   -- borrow the parent's implementation, then add behavior
end

local a = Animal:new("Generic")
local d = Dog:new("Rex")
local p = Puppy:new("Bit")

print(a:describe())   -- Generic says: Generic makes a sound
print(d:describe())   -- Rex says: Rex barks
print(p:describe())   -- Bit says: Bit barks (cutely)

-- verifying the chain itself: Puppy's metatable is only a pass-through, the methods all live on the class tables at each level
local mt = getmetatable(Puppy)
print(rawget(mt, "speak"))          -- nil (no methods on the metatable)
print(type(mt.__index))             -- table (__index points at Dog)
print(type(rawget(Dog, "speak")))   -- function (speak is defined on Dog)
```

Note `Dog.speak(self)`: when calling a parent's same-named method from inside a subclass method, you must use the dot and pass `self` explicitly (writing `Dog:speak()` would pass the `Dog` table itself as `self`). See the [The Role of `self`](./self.md) chapter for the reason.

## 4. Polymorphism and Encapsulation

### 4.1 Polymorphism: Overriding a Method Takes Effect Immediately

Lua's method lookup already works "up the chain of the calling object," with no `virtual`-style declaration. When a subclass defines a same-named method, it naturally overrides the parent's implementation found up the chain. At the same call site, different objects passed in each go to their own method:

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
    print(s:describe())     -- describe is written once; area goes its own way per object
end
-- Circle: area = 12.5664
-- Square: area = 9
```

### 4.2 Encapsulation: Lua Has No Access Modifiers, So Use Closures for Privacy

Fields of a Lua table are open to all code; there is no `private`. In practice there are two routes. The conventional one names private fields with a `_` prefix (such as `self._balance`) — zero cost, but it is only a team agreement and does not stop access. The closure-based route goes the other way: make the private state a `local` inside the constructor, with the public methods as closures capturing it. No amount of digging through the table from outside can reach those values, because they are not in the table at all:

```lua
local Account = {}
Account.__index = Account

function Account.new(opening)
    local balance = opening                -- a private member: just a local inside the constructor
    local self = setmetatable({}, Account)

    function self:deposit(amount)
        balance = balance + amount         -- a public method rewrites it via the closure
    end

    function self:current()
        return balance
    end

    return self
end

local acc = Account.new(100)
acc:deposit(50)
print(acc:current())      -- 150

print(acc.balance)        -- nil (there is no balance field on the table, so nobody can read it away)
acc.balance = 1000000     -- merely puts an unrelated field on the table
print(acc:current())      -- 150 (the private balance is unaffected)
```

The price of the closure route is worth knowing clearly: methods are created per instance by `new` (they are not shared on the class table), so memory and construction cost are both higher; and since the methods are not on the class table, the `__index` inheritance chain from section 3 cannot help, so a closure class needs its own inheritance design. It therefore suits objects with few instances whose state genuinely needs protecting (see the comparison in section 5).

## 5. Common Variants: Prototype Style, Class-Library Style, and Closure Classes

The same metamethods can be assembled into object-oriented machinery in different styles. Three common variants each have their own trade-offs.

### 5.1 Prototype Style (JS Family)

Centered on the "object": there is no separate class, and a new object takes an existing object directly as its prototype. The Lua counterpart of `Object.create(proto)` is `setmetatable({}, { __index = proto })`. Fields follow "copy on write": reading a default walks the prototype, and a single write lands on the object itself:

```lua
local function clone(proto)
    return setmetatable({}, { __index = proto })
end

local counter = { count = 0 }        -- this table is both the carrier of defaults and the prototype

function counter:inc(step)           -- methods are written directly on the prototype object
    self.count = self.count + (step or 1)
    return self.count
end

local c1 = clone(counter)
local c2 = clone(counter)            -- the two clones do not affect each other

print(c1:inc())        -- 1 (reading count walks the chain to 0; the write lands on c1 itself)
print(c2:inc(5))       -- 5
print(counter.count)   -- 0 (the default on the prototype is untouched)
```

The correspondence with JavaScript: `Object.create` ≈ `clone`, `this` ≈ `self`, and the prototype chain is the `__index` chain. It suits configuration objects and small, shallow-hierarchy scenarios.

### 5.2 Class-Library Style (middleclass and the like)

Wrap the manual ritual of sections 2 and 3 into a library. Taking middleclass as an example (you need `luarocks install middleclass` first), classes, inheritance, and instance checks all have ready-made entry points:

```lua
local class = require("middleclass")

local Animal = class("Animal")

function Animal:initialize(name)     -- the constructor is called initialize
    self.name = name
end

function Animal:speak()
    return self.name .. " makes a sound"
end

local Dog = Animal:subclass("Dog")   -- inheritance in one line

function Dog:speak()
    return self.name .. " barks"
end

local rex = Dog("Rex")               -- a class can be called like a function
print(rex:speak())                   -- Rex barks
print(rex.class.name)                -- Dog (class is the field on the instance that points at the class)
print(rex:isInstanceOf(Animal))      -- true
```

Inside a class library the implementation is still `setmetatable` + `__index`; it does not escape the mechanism discussed here. What it buys you is a consistent idiom and a ready-made API for class operations. When a project grows large enough to involve several people, introducing it is worthwhile; a small script may not need this extra layer of dependency.

### 5.3 Closure Classes

The route that showed up in section 4, turned into a class on its own: no metatable, with methods packaged together with the private state inside the constructor and returned. Methods do not need `self`, because the state they operate on is all captured by the closure:

```lua
local function newStack()
    local items = {}                 -- private state, not on the returned table

    local function push(v) items[#items + 1] = v end
    local function pop() return table.remove(items) end
    local function size() return #items end

    return { push = push, pop = pop, size = size }
end

local s = newStack()
s.push("a")
s.push("b")
print(s.size())   -- 2
print(s.pop())    -- b
print(s.pop())    -- a
```

### 5.4 Comparing the Three Variants

| Dimension | Metatable class (sections 2, 3) | Prototype style | Class library (middleclass) | Closure class |
| --- | --- | --- | --- | --- |
| Private members | None, by naming convention | None, by naming convention | None, by naming convention | Built in |
| Inheritance | `__index` chain, hooked by hand | Prototype-chain cloning, the chain extends on its own | `:subclass()` in one line | Needs a separate design, more work |
| Method storage | One copy on the class table, shared by instances | One copy on the prototype table, shared by instances | One copy on the class table, shared by instances | A set of closures per instance |
| Instance cost | One table + one `setmetatable` | One table + one throwaway metatable | Same as the metatable class (same mechanism inside the library) | One table + several closures |
| Best fit | The general idiom, the Lua community's default | Configuration objects, shallow prototype reuse | Medium to large projects, a structured API | Modules with few instances whose state needs protecting |

## 6. Performance Notes and Pitfalls

### 6.1 The Cost of the `__index` Lookup Chain

Every read of a missing field walks the chain once, and the `m` in a method call `obj:m()` is exactly such a read. The longer the chain and the more frequent the calls, the more this lookup cost shows up. The fix on hot paths is to **cache the method in a local variable**, turning the chain lookup into a single direct call:

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
for _ = 1, N do v:norm2() end          -- each time: look up m (one __index walk) + call
local t1 = os.clock()

local norm2 = Vec.norm2                -- the method cached in a local variable
for _ = 1, N do norm2(v) end           -- direct call, no table lookup
local t2 = os.clock()

print(string.format("via __index : %.3fs", t1 - t0))
print(string.format("local cache : %.3fs", t2 - t1))
-- the two numbers are illustrative values from a single measured run on one machine (10⁷ calls, roughly 0.83s versus 0.65s);
-- absolute values vary by machine, but the direction of the gap is stable: a local cache is no slower than walking the chain
```

Besides caching methods, you can also place hot fields directly on the instance (shortening the chain) or hold frequently accessed classes and functions in a `local` at the top of the module.

### 6.2 The Allocation Cost of `new`

Every `new` allocates a fresh table and attaches a metatable. When creating in bulk, this shows up directly as memory usage and garbage-collection pressure:

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
print(string.format("100k instances resident: about %.1f MB", (after - before) / 1024))
-- a measured run gives about 12 MB (roughly 0.12 KB per instance); the number varies slightly by Lua version and platform
```

At large scale, the common tactics are: reuse via an object pool (fewer `new` calls, more collected into the discard bin); switch pure data objects to plain tables (no metatable, fields read and written directly, one lookup level less); and avoid heavy initialization inside the constructor.

### 6.3 A Checklist of Common Pitfalls

Five pitfalls get stepped on most often. The first is forgetting `Class.__index = Class`: after `setmetatable({}, Class)`, the instance still cannot find the methods — the metatable is attached, but with no `__index`, so the lookup stops at the instance.

`pairs` and `#` do not walk the `__index` chain: `pairs(instance)` cannot see the methods on the class, inherited fields are not counted by `#`, and the metatable chain serves ordinary reads only. Mixing dots and colons is the most frequent error: `obj.m()` drops `self`, and `Class:m(x)` passes arguments out of alignment — see [The Role of `self`](./self.md) for details.

Two more tend to bite you with hindsight. A table has only one metatable, and a second `setmetatable` is a wholesale replacement, so a class chain attached earlier is lost silently. Once `__newindex` is defined, it takes over writes and ordinary assignment no longer lands on the table itself; writing to the table itself requires `rawset`. Think carefully about write semantics before slapping an `__newindex` onto a "shared table with defaults."

## Wrap-up

Lua's object orientation gets no keyword support; everything rests on a single `__index` lookup chain: an instance's metatable is the class, a class's metatable is the parent, reads walk up the chain, and writes land locally. Once you think this chain through clearly, the three-step class idiom, multi-level inheritance, method overriding, closure-based privacy, and the various variants are all different combinations of the same mechanism. And the main homework on the performance side is only two things: cache methods on hot paths, and watch allocations when creating in bulk.

## Related reading

- [The Role of `self`](./self.md)
- [A Table-Based Object System](./object-system.md)
- [Inheritance and Polymorphism](./inheritance-and-polymorphism.md)

## References

- [Lua 5.4 reference manual · 2.6 Tables](https://www.lua.org/manual/5.4/manual.html#2.6)
- [Prototype-based_programming](https://en.wikipedia.org/wiki/Prototype-based_programming)
- [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [object-oriented](object-oriented.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
