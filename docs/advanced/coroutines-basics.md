# Coroutine basics

A coroutine is a special kind of function: it can pause (suspend) halfway through its execution, saving its current execution state, and later resume from exactly where it paused. Lua provides full coroutine support through the standard library's `coroutine` module, and a coroutine is itself a native Lua data type (the `thread` type).

## 1. What a coroutine is

You can think of a coroutine as "a function that can pause and resume":

- A normal function, once called, always runs from start to finish (or errors out partway).
- A coroutine can call `coroutine.yield` during execution to suspend itself, handing control back to the caller; it later resumes from the suspension point via `coroutine.resume`.

Coroutines are cooperative: when a switch happens is entirely up to the code — nothing is ever force-interrupted.

## 2. Creating and resuming

Use `coroutine.create` to create a coroutine; the argument is the coroutine's function body. A coroutine doesn't start running as soon as it's created — you need `coroutine.resume` to kick it off:

```lua
local co = coroutine.create(function()
    print("running inside the coroutine")
end)

print(co)                  -- looks like thread: 0x... (a coroutine is a value of type thread)
print(coroutine.resume(co))   -- prints true (started successfully, function returned normally)
print(coroutine.status(co))   -- prints dead (function finished, coroutine is dead)
```

The first return value of `coroutine.resume` is the status: `true` if the coroutine ended normally or suspended normally, `false` if an error occurred inside the coroutine, followed by the error message.

## 3. The back and forth between yield and resume

Inside a coroutine, `coroutine.yield` suspends it. `yield` can take arguments, and those arguments become the return values of the `resume` call; conversely, extra arguments passed to the next `resume` become the return value of `yield`. The two form a bidirectional channel:

```lua
local co = coroutine.create(function(a, b)
    print("coroutine started with", a, b)
    local x = coroutine.yield(a + b)   -- hands a+b to the resume caller and waits for the next resume
    print("received", x)
    return "done"
end)

print(coroutine.resume(co, 10, 20))   -- prints true	30
print(coroutine.resume(co, 99))       -- prints received	99 and true	done
```

The code above shows the full flow of data through a coroutine:

1. The first `resume` passes `10` and `20` as function arguments. When the function reaches `yield(a + b)`, it suspends and returns `30` to the caller.
2. The `99` passed to the second `resume` becomes the return value of `yield`, and the coroutine continues until it hits `return`.
3. The value returned by `return` is also handed back to the caller as the return value of `resume`.

## 4. coroutine.wrap: a lighter way to use coroutines

`coroutine.wrap` also creates coroutines, but returns a "resume function" instead of a coroutine object: each call to that function is equivalent to one `resume`, and the value the coroutine `yield`s is returned directly as the function's return value:

```lua
local gen = coroutine.wrap(function()
    for i = 1, 3 do
        coroutine.yield(i * i)
    end
end)

print(gen())  -- prints 1
print(gen())  -- prints 4
print(gen())  -- prints 9
```

`wrap` is more concise to use and is well suited to wrapping coroutines as iterators. The difference is that a function returned by `wrap` throws errors from inside the coroutine straight back to the caller, whereas `create` + `resume` quietly returns the error as a return value. When you need to check for errors, `create` is the better choice.

## Wrap-up

A coroutine boils down to three actions: `create` to make one, `resume` to continue it, `yield` to suspend it — plus `status` to check its state and `wrap` for lightweight wrapping. Suspend to save the scene, resume to continue, and pass values in both directions between `resume` and `yield`. The schedulers and async wrappers that come later are all combinations of these few actions.

## References

- [Lua 5.4 reference manual · 2.5 Error handling](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [PIL · Coroutines](https://www.lua.org/pil/10.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [coroutines](coroutines.md)
- [core-concepts](/knowledge/core-concepts.md)
