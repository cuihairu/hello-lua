# Coroutine states and lifecycle

Every coroutine has its own lifecycle: from creation, running, and suspension, to eventual death. `coroutine.status` can query a coroutine's current state at any time, and understanding these states and the conditions that transition between them is the foundation for avoiding errors like "resuming a dead coroutine."

## 1. The four coroutine states

`coroutine.status(co)` returns one of the following four strings:

| State | Meaning |
| --- | --- |
| `suspended` | Suspended: created but not yet run, or stopped at a `yield` waiting to be resumed |
| `running` | Running: currently holding execution (only visible from within the coroutine being queried itself) |
| `normal` | Alive but not running: this coroutine resumed another one and is now waiting for it to yield or finish |
| `dead` | Dead: the function returned or an unrecoverable error occurred; it may also have been closed with `close` |

## 2. A state-flow example

The following example walks through the "suspended → running → suspended → dead" flow in full:

```lua
local co   -- declare first, then assign, so the coroutine body can reference this local variable
co = coroutine.create(function()
    print("inside:", coroutine.status(co))   -- while running, it sees itself as running
    coroutine.yield()
    print("resumed again")
end)

print(coroutine.status(co))    -- output suspended (created but not yet started)
coroutine.resume(co)           -- output inside:	running
print(coroutine.status(co))    -- output suspended (suspended at the yield)
coroutine.resume(co)           -- output resumed again
print(coroutine.status(co))    -- output dead (function returned)
```

The `normal` state is less common: when coroutine A resumes another coroutine B, B is `running` and A is `normal`. A is "alive," but execution is in someone else's hands:

```lua
local main = coroutine.running()   -- the current (main) coroutine

local co = coroutine.create(function()
    -- co is running here, and main, which resumed it, is normal
    print("status of main:", coroutine.status(main))
end)

coroutine.resume(co)   -- output status of main:	normal
```

## 3. Querying the currently running coroutine

`coroutine.running` returns the currently running coroutine itself, along with whether it is the main coroutine:

```lua
local co, is_main = coroutine.running()
print(co ~= nil, is_main)   -- executed in the script's main flow: output true	true
```

The main coroutine is the one that exists from the moment the program starts. It is never in the `suspended` state (you cannot `resume` it), and it only finishes when the program exits.

## 4. Dead coroutines and resume errors

After a coroutine is dead, calling `resume` on it again returns an error instead of crashing:

```lua
local co = coroutine.create(function() end)

coroutine.resume(co)             -- the coroutine has finished running and enters the dead state
print(coroutine.status(co))      -- output dead
print(coroutine.resume(co))      -- output false	cannot resume dead coroutine
```

Likewise, trying to resume the main coroutine, or resuming a coroutine that is already running, also returns failure. The safe way to write this is to always check the first return value of `resume`.

## 5. Ending early with coroutine.close

Lua 5.4 added `coroutine.close`, which can move a suspended coroutine straight into the dead state:

```lua
local co = coroutine.create(function()
    coroutine.yield("waiting")
    print("never reached")
end)

coroutine.resume(co)         -- output true	waiting
print(coroutine.close(co))   -- output true
print(coroutine.status(co))  -- output dead
```

The value of `close` is in resource cleanup: when closing, any to-be-closed variables (`<close>` locals) in the coroutine that have not yet been destroyed have their `__close` metamethod called in reverse order. This is a good fit for releasing resources like file handles and database connections. If one of the `__close` calls raises an error, `close` returns `false` and the error object.

## 6. Lifecycle summary

A coroutine's typical lifecycle can be summarized as:

1. Created with `coroutine.create`, enters `suspended`;
2. Started with `coroutine.resume`, enters `running`;
3. Hits `coroutine.yield`, returns to `suspended`, waiting for the next resume;
4. Repeats 2-3 until the function `return`s (or an error occurs, or it is `close`d), entering `dead`;
5. Any `resume` after `dead` fails.

## Wrap-up

A coroutine's state machine is not complicated: `resume`/`yield` switch back and forth between `suspended` and `running`, and `dead` is the only irreversible endpoint. When writing code, do not resume a dead coroutine; call `close` when you need to end early so that to-be-closed variables can finish cleaning up.

## References

- [Lua 5.4 reference manual · 2.5 Coroutines](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [Call_stack](https://en.wikipedia.org/wiki/Call_stack)

<!-- BACKLINKS-AUTO -->
## Related pages

- [coroutines](coroutines.md)
- [core-concepts](/knowledge/core-concepts.md)
