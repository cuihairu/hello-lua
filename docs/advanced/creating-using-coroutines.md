# Creating and Using Coroutines

When I use coroutines in a project, what I mostly come back to check are the details of creation, argument passing, and error handling; the relevant operations are provided by Lua's `coroutine` library.

## 1. Two Ways to Create a Coroutine

### 1.1 coroutine.create

`coroutine.create(f)` returns a coroutine object of type `thread`, which you have to start or resume explicitly with `coroutine.resume`:

```lua
local co = coroutine.create(function(name)
    print("hello,", name)
    return "finished"
end)

print(type(co))               -- thread
print(coroutine.resume(co, "Lua"))   -- hello,	Lua  and true	finished
```

On the first `resume`, the arguments other than the coroutine object are passed to the coroutine function; the function's return values are handed back to the caller as the return values of `resume`.

### 1.2 coroutine.wrap

`coroutine.wrap(f)` returns an ordinary function; calling it is equivalent to one `resume` of the coroutine, and you get the `yield`ed value directly:

```lua
local counter = coroutine.wrap(function()
    for i = 1, 3 do
        coroutine.yield(i)
    end
end)

print(counter())  -- 1
print(counter())  -- 2
print(counter())  -- 3
```

The trade-off between the two: the coroutine object returned by `create` works with functions like `status` and `close`, and errors are reported as return values, which is safer. `wrap` is more concise and is often used to treat a coroutine as an iterator or generator.

## 2. Exchanging Data with a Coroutine

There are two data channels between a coroutine and its caller, running in opposite directions:

- The arguments of `yield(args)` → become the return values of this `resume`, flowing from the coroutine to the caller.
- The extra arguments of `resume(co, args)` → become the return values of the previous `yield`, flowing from the caller to the coroutine.

```lua
local co = coroutine.create(function(initial)
    local n = initial
    while true do
        local step = coroutine.yield(n)   -- hand out the current value n, wait for the caller to supply a step
        if not step then break end
        n = n + step
    end
    return n
end)

print(coroutine.resume(co, 100))   -- true	100
print(coroutine.resume(co, 5))     -- true	105
print(coroutine.resume(co, 20))    -- true	125
print(coroutine.resume(co))        -- true	125
```

This example implements an accumulator whose step is driven from the outside: every time the caller `resume`s, the coroutine advances one step and hands out the intermediate result.

## 3. Error Handling in Coroutines

When an error occurs inside a coroutine created with `create`, it does not terminate the whole program; it is reported through the return values of `resume`:

```lua
local co = coroutine.create(function()
    error("something failed")
end)

local ok, err = coroutine.resume(co)
print(ok)   -- false
print(err)  -- something like "demo.lua:2: something failed" (includes the error location)
```

The function returned by `wrap` does not have this protection: errors inside the coroutine are thrown at the call site directly and need to be wrapped with `pcall`:

```lua
local f = coroutine.wrap(function()
    error("boom", 0)
end)

print(pcall(f))   -- false	boom
```

After an error the coroutine goes straight into the dead state and cannot be resumed again:

```lua
local co = coroutine.create(function()
    error("oops")
end)

coroutine.resume(co)        -- returns false and the error message
print(coroutine.status(co)) -- dead
```

If you need error messages with the full call stack, wrap the business logic inside the coroutine function with `xpcall`, or switch to `wrap` and handle it on the outside with `pcall`.

## 4. Ending a Coroutine

A coroutine dies naturally once its coroutine function returns; you can also close a suspended coroutine explicitly with `coroutine.close` (new in Lua 5.4):

```lua
local co = coroutine.create(function()
    coroutine.yield("working")
    print("never reached")
end)

print(coroutine.resume(co))    -- true	working
print(coroutine.close(co))     -- true (the coroutine is closed)
print(coroutine.status(co))    -- dead
```

A coroutine closed by `close` cannot be resumed again; if to-be-closed variables are defined inside the coroutine, their `__close` metamethods are called in turn when it is closed, which makes this a good fit for releasing resources.

## Wrap-up

Creating a coroutine takes only one line of `create` or `wrap`; the real key is understanding how arguments flow in both directions between `resume` and `yield`, and how `create` and `wrap` differ in error handling. Iterators, task schedulers, and the like are all built on top of this.

## References

- [Lua 5.4 reference manual · 2.5 Functions](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [PIL · Coroutines](https://www.lua.org/pil/10.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [coroutines](coroutines.md)
- [core-concepts](/knowledge/core-concepts.md)