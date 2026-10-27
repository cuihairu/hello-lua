# The Role of `self`

`self` is a core concept of object-oriented programming in Lua: it refers to "the object the current method is operating on." Lua itself has no `self` keyword — the `self` we see is just a conventional parameter name, passed in automatically by the colon (`:`) syntactic sugar.

## 1. The Colon Syntactic Sugar and the Implicit `self`

When you define a method with a colon, Lua automatically adds a hidden parameter named `self` to the function; when you call with a colon, Lua automatically passes the object before the colon in as the first argument:

```lua
local Dog = {}
Dog.__index = Dog

function Dog.new(name)
    return setmetatable({ name = name }, Dog)
end

function Dog:bark()           -- equivalent to function Dog.bark(self)
    print(self.name .. " says: Woof!")
end

local dog = Dog.new("Rex")
dog:bark()          -- the usual form: pass dog in as self
Dog.bark(dog)       -- the equivalent form: pass dog explicitly as the first argument
-- output
-- Rex says: Woof!
-- Rex says: Woof!
```

`obj:method(a)` and `obj.method(obj, a)` are completely equivalent; `self` is the first argument passed in implicitly. So when a method's definition and its call both use the colon, `self` lands in place on its own.

## 2. `self` Lets a Method Operate on Its Own Data

The point of `self` is to let one method serve different objects. Each instance has its own fields, and a method reaches its own copy through `self`:

```lua
local Counter = {}
Counter.__index = Counter

function Counter:increment(step)
    self.count = self.count + (step or 1)
    return self.count
end

local c1 = setmetatable({ count = 0 }, Counter)
local c2 = setmetatable({ count = 100 }, Counter)

print(c1:increment())    -- 1
print(c2:increment())    -- 101
print(c2:increment(10))  -- 111
```

The same `increment` function operates on a different counter each time, because the `self` passed in differs. Without `self`, a method could not know which object's data it should modify.

## 3. A Common Error: Mixing the Dot and the Colon

A method defined with a colon takes `self` as its first argument; if you call it with a dot instead, that argument is never passed in, and `self` inside the function is `nil`:

```lua
local Counter = {}

function Counter:increment(step)
    self.count = self.count + (step or 1)
    return self.count
end

local ok, err = pcall(Counter.increment)   -- forgot to pass self
print(ok)   -- false
print(err)  -- something like "demo.lua:4: attempt to index a nil value (local 'self')"
```

Conversely, "defined with a dot, called with a colon" is equally broken. The colon passes the object itself in as the first argument, which misaligns with the parameter list the function was defined with. So the working rule in practice is: any method that needs `self` is defined with a colon and called with a colon; functions that genuinely do not need `self` (such as the constructor `Dog.new`) use the dot.

## 4. `self` and Inheritance, Polymorphism

In a metatable-based inheritance scheme, `self` is the key to method reuse and polymorphism: inside a subclass method, `self` still points at the actual calling object, so parent-class logic operates on the subclass instance's fields:

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

-- LimitedAccount inherits from Account: any method not found is located by following __index up to Account
local LimitedAccount = setmetatable({}, { __index = Account })
LimitedAccount.__index = LimitedAccount

function LimitedAccount.new(balance, limit)
    local obj = Account.new(balance)   -- obj's metatable is Account at first
    obj.limit = limit
    return setmetatable(obj, LimitedAccount)   -- swap in the subclass's metatable
end

-- Override (polymorphism): a same-named method replaces the parent's implementation
function LimitedAccount:withdraw(amount)
    if amount > self.limit then
        return nil, "over limit"
    end
    return Account.withdraw(self, amount)   -- pass self explicitly to the parent method
end

local acc = Account.new(100)
print(acc:withdraw(30))          -- 70

local lacc = LimitedAccount.new(100, 50)
print(lacc:withdraw(30))         -- 70 (allowed by the subclass rule)
print(lacc:withdraw(80))         -- nil	over limit
print(lacc.balance)              -- 70 (the earlier withdrawal already took effect)
```

Note the `Account.withdraw(self, amount)` form: when calling a parent's same-named method from inside a subclass method, the colon syntactic sugar does not apply (writing `Account:withdraw(amount)` would pass the `Account` table itself as `self`), so you must pass `self` back in as the first argument explicitly.

## 5. Losing `self` in a Callback

When you pass a method around as a callback (event handling, timers, sort comparison functions, etc.), the method becomes "detached" from its object, and `self` is `nil` at call time:

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

-- Wrong example: pass the method itself out as an ordinary function, and self is lost at call time
local ok, err = pcall(dog.bark)
print(ok)    -- false
print(err)   -- something like "demo.lua:9: attempt to index a nil value (local 'self')"

-- Correct approach 1: wrap it in a closure to capture self
local bark = function() dog:bark() end
bark()       -- Rex says: Woof!

-- Correct approach 2: supply self manually at call time
local bark2 = dog.bark
bark2(dog)   -- Rex says: Woof!
```

Of the two approaches, the closure form is the most common: it "packages" the object and the method together, so the callback will not lose `self` no matter who calls it.

## Wrap-up

`self` has no magic; it is just the first argument that the colon syntactic sugar passes in automatically. Three rules avoid the vast majority of problems: define with a colon and call with a colon; pass `self` explicitly when reusing a method across classes (as in `Account.withdraw(self, amount)`); and bind the object with a closure when passing a method around as a callback.

## References

- [Lua 5.4 reference manual · 2.6 Tables](https://www.lua.org/manual/5.4/manual.html#2.6)
- [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [object-oriented](object-oriented.md)
- [oop-implementation](oop-implementation.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
