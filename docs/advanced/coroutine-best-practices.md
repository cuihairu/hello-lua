# Coroutine Use Cases and Best Practices

Coroutines are used heavily in Lua: iterators in the standard library such as `string.gmatch` and `io.lines` are essentially coroutines. Below I first look at typical use cases, then at the guidelines for real-world development.

## 1. Typical Use Cases

### 1.1 Flattening Callbacks into Sequential Code

This is the most valuable use of coroutines: put asynchronous callback-style logic inside a coroutine, `yield` when a long-running operation is hit, and `resume` once the data arrives. What the user sees is sequentially executing code, while the underlying event loop keeps running in the ordinary callback fashion.

### 1.2 Producer-Consumer and Lazy Evaluation

Coroutines can produce data on demand; the consumer processes one item and resumes once, so the two ends are naturally decoupled:

```lua
local function producer(count)
    return coroutine.wrap(function()
        for i = 1, count do
            coroutine.yield("data-" .. i)   -- produce only when needed
        end
    end)
end

local p = producer(3)
print(p())   -- data-1
print(p())   -- data-2
```

`io.lines` and `string.gmatch` in the standard library are implementations of this pattern: they do not read all the data into memory at once, but produce the next item only when it is consumed.

### 1.3 Frame-Spread Execution and Cooperative Scheduling

In games and interactive applications, a large task is often split into several small executions, each handling a fixed number of entries, to avoid stalling:

```lua
local function chunkedTask(items, size)
    return coroutine.wrap(function()
        for i = 1, #items, size do
            local last = math.min(i + size - 1, #items)
            coroutine.yield(table.concat(items, ", ", i, last))
        end
    end)
end

local items = {"a", "b", "c", "d", "e"}
for chunk in chunkedTask(items, 2) do
    print("process:", chunk)
end
-- Output
-- process:	a, b
-- process:	c, d
-- process:	e
```

Each call to the generator function processes one batch, and the main loop can slot rendering, input handling, and other work in between batches.

### 1.4 Implementing Generic Iterators with Coroutines

Wrapping traversal logic in a coroutine lets you expose a unified `for`-loop interface:

```lua
local function values(t)
    return coroutine.wrap(function()
        for _, v in ipairs(t) do
            coroutine.yield(v)
        end
    end)
end

for v in values({10, 20, 30}) do
    print(v)
end
-- Output
-- 10
-- 20
-- 30
```

Swap out the internal traversal strategy and the calling code does not change at all — that is the "lazy sequence" abstraction coroutines provide.

## 2. Best Practices

### 2.1 Always Check the Return Value of resume

The first return value of `coroutine.resume` tells whether the coroutine ran normally; ignoring it is the same as ignoring every error raised inside the coroutine:

```lua
local co = coroutine.create(function()
    error("task failed", 0)
end)

local ok, err = coroutine.resume(co)
if not ok then
    print("task error:", err)   -- task error:	task failed
end
```

### 2.2 Do Not Reuse Dead Coroutines

Once a coroutine enters the `dead` state it cannot be resumed; resuming it only gets you `cannot resume dead coroutine`. A long-running scheduler should remove a coroutine from its task list when it dies, and `create` a new one when the work needs to run again.

### 2.3 Avoid Blocking Calls Inside Coroutines

`io.read`, synchronous network requests, `os.execute`, and the like block the whole process, so the coroutine's concurrency never gets a chance to show. Either switch to non-blocking interfaces, or have the framework suspend the coroutine at the wait point.

### 2.4 Only Call yield Inside a Coroutine

Calling `coroutine.yield` in an ordinary function errors out because there is no coroutine to suspend (`attempt to yield from outside a coroutine`). If a utility function may be used inside a coroutine, check with `coroutine.isyieldable()`.

### 2.5 Use close to Manage Resources

In Lua 5.4, whether a coroutine is ended with `coroutine.close` or its coroutine function returns naturally, to-be-closed variables (`<close>`) fire their `__close` metamethod. Declaring resources such as files and connections as `<close>` variables guarantees they are released no matter how the coroutine ends.

### 2.6 wrap for Trusted Logic, create for Fault-Tolerant Scenarios

Errors from `wrap` are thrown straight to the caller: concise to write, but easy to miss. `create` + `resume` turns errors into return values, which suits schedulers and other code that needs to handle failures uniformly.

## Wrap-up

Coroutines have four typical use cases: flattening callbacks into sequential code, lazy sequences produced on demand, frame-spread batch processing, and reusable iterators. Beyond the use cases, remember four more: check the return value of resume, do not reuse dead coroutines, do not make blocking calls, and use close to clean up resources.

## References

- [Lua 5.4 reference manual · 2.5 Functions](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [lua-users wiki](http://lua-users.org/wiki/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [coroutines](coroutines.md)
- [glossary](/glossary.md)
- [pitfalls](/knowledge/pitfalls.md)