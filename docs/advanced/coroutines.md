# Coroutines and concurrent programming

Coroutines are a cooperative multitasking mechanism provided by Lua. Unlike OS threads, switching between coroutines is controlled entirely by the program explicitly: a coroutine only gives up execution when it calls `coroutine.yield`, and otherwise keeps running until it finishes. With this property, Lua can implement iterators, the producer-consumer model, a cooperative scheduler, and async I/O wrappers at very low cost.

## 1. Concurrency vs. parallelism

Before discussing coroutines, it is worth separating two easy-to-confuse concepts. Parallelism means multiple tasks truly execute at the same time, which requires multicore or multiprocessor hardware. Concurrency means multiple tasks make progress in turn over a period of time: they appear to happen "at the same time" at a macro level, while at a micro level only one may be executing.

Lua coroutines belong to concurrency rather than parallelism. In the same Lua state, at most one coroutine runs at any moment, and the rest are suspended. Because there is no true parallel execution, coroutines do not produce race conditions when accessing shared data and usually do not need locking — a major advantage of coroutines over threads.

## 2. Alternating multitasking with coroutines

The following example creates two coroutines that the main program resumes alternately, simulating two tasks advancing "concurrently":

```lua
local function task(name)
    for i = 1, 3 do
        print(name, "step", i)
        coroutine.yield()   -- give up execution, waiting for the next resume
    end
end

local coA = coroutine.create(task)
local coB = coroutine.create(task)

for i = 1, 3 do
    coroutine.resume(coA, "A")
    coroutine.resume(coB, "B")
end
-- output
-- A	step	1
-- B	step	1
-- A	step	2
-- B	step	2
-- A	step	3
-- B	step	3
```

You can see that the two tasks execute in strict alternation: each `resume` starts one task, the task runs until it suspends at `yield` and hands control back to the main program, and the main program then decides which task to run next. The entire switching process is controlled explicitly by code, so the output is deterministic.

## 3. Producer and consumer

Producer-consumer is one of the most classic uses of coroutines. The producer generates data inside a coroutine and `yield`s each item as it is produced; the consumer requests data through `resume`:

```lua
local producer = coroutine.create(function()
    for i = 1, 3 do
        coroutine.yield("item-" .. i)   -- produce one item and hand it to the consumer
    end
end)

for i = 1, 3 do
    local ok, item = coroutine.resume(producer)
    print("consumer got", item)
end
-- output
-- consumer got	item-1
-- consumer got	item-2
-- consumer got	item-3
```

Compared with the traditional buffered-queue approach, the coroutine version is written as straight-line code, needs no extra synchronization mechanism, and the logic is immediately clear.

## 4. A simple cooperative scheduler

Putting several coroutines into a list and resuming them in turn gives you the simplest cooperative scheduler. The coroutines decide for themselves when to yield; the scheduler is only responsible for "who gets to keep running":

```lua
local function scheduler(tasks)
    while #tasks > 0 do
        local remaining = {}
        for _, co in ipairs(tasks) do
            coroutine.resume(co)
            if coroutine.status(co) ~= "dead" then
                table.insert(remaining, co)   -- tasks that have not finished move to the next round
            end
        end
        tasks = remaining
    end
    print("all tasks finished")
end

scheduler({
    coroutine.create(function()
        for i = 1, 2 do print("task A:", i); coroutine.yield() end
    end),
    coroutine.create(function()
        for i = 1, 2 do print("task B:", i); coroutine.yield() end
    end)
})
-- output
-- task A:	1
-- task B:	1
-- task A:	2
-- task B:	2
-- all tasks finished
```

This "task rotation + voluntary yielding" pattern is the basis for how many Lua frameworks implement async I/O and game frame logic: wrap a network request, an animation step, or a batch of data processing in a coroutine, call `yield` at its waiting point to give up, and have the host program resume it at the right moment.

## 5. Related sections

- [Coroutine basics](./coroutines-basics.md)
- [Creating and using coroutines](./creating-using-coroutines.md)
- [Coroutine states and lifecycle](./coroutine-lifecycle.md)
- [Comparing coroutines and threads](./coroutines-vs-threads.md)
- [Coroutine use cases and best practices](./coroutine-best-practices.md)

## Wrap-up

Coroutines give Lua structured concurrency at very little cost: they are a control structure for writing "alternating tasks" as clear straight-line code. Pushing through more computation is what parallelism is for, and has nothing to do with coroutines. In the same Lua state only one coroutine runs at any moment, so shared data does not need locking.

## References

- [Lua 5.4 reference manual · 2.5 Coroutines](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [PIL · Coroutines](https://www.lua.org/pil/10.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [books](/knowledge/books.md)
- [core-concepts](/knowledge/core-concepts.md)
