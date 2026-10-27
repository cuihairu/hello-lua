# Comparing coroutines and threads

Coroutines are often called "user-space threads," but they differ from OS threads in fundamental ways. Understanding those differences is what tells you when to use a coroutine and when you must use a thread.

## 1. The core differences at a glance

| Dimension | Lua coroutine | OS thread |
| --- | --- | --- |
| Scheduling | Cooperative: yields only at `yield` | Preemptive: the OS can interrupt and switch at any time |
| Parallelism | None: only one coroutine runs at a time | Yes: multiple threads can truly run in parallel on multiple cores |
| Switch cost | Tiny: a user-space switch that saves only the coroutine's stack | Larger: enters the kernel and saves the full context |
| Memory use | Each coroutine needs only a small stack (KB range) | Each thread reserves an MB-range stack by default |
| Scale | Tens of thousands, even hundreds of thousands, can be created easily | Usually hits a bottleneck in the hundreds or thousands |
| Data synchronization | No true parallelism, so locking is generally unnecessary | Requires locks, semaphores, and other synchronization primitives |
| Effect of blocking | `yield` does not affect other coroutines, but a blocking call (such as `io.read`) stalls the entire state | One blocked thread does not affect the others |
| Best for | Iterators, producer-consumer, async I/O wrappers, game frame logic | CPU-bound parallel computation, real multitasking |

## 2. What cooperative means

Where a coroutine switches is decided entirely by code: control is handed off only when `coroutine.yield` runs. So the output order of two coroutines is deterministic and reproducible:

```lua
local function worker(name)
    for i = 1, 2 do
        print(name, "step", i)
        coroutine.yield()      -- the only place it can be interrupted
    end
end

local coA = coroutine.create(worker)
local coB = coroutine.create(worker)
coroutine.resume(coA, "A")   -- A step 1
coroutine.resume(coB, "B")   -- B step 1
coroutine.resume(coA)        -- A step 2
coroutine.resume(coB)        -- B step 2
-- output
-- A	step	1
-- B	step	1
-- A	step	2
-- B	step	2
```

Threads, by contrast, can be interrupted by the OS at any moment, so running the same code in two threads yields a nondeterministic output order. Determinism makes coroutine code easier to debug and reason about, but it also means coroutines cannot take advantage of multiple cores. That is the price of being cooperative.

## 3. Blocking calls are a coroutine's nemesis

A coroutine's "concurrency" exists only inside the Lua world. The moment a coroutine calls something that truly blocks (reading a file, a network request, `os.execute`, etc.), the whole process stalls and there is nothing the other coroutines can do:

```lua
local co = coroutine.create(function()
    -- A blocking call such as io.read() stalls the entire program; other coroutines cannot run either
    local line = "simulated blocking result"
    coroutine.yield(line)
end)

print(coroutine.resume(co))   -- output true	simulated blocking result
```

This is exactly why coroutine-based async frameworks (such as OpenResty/ngx_lua) implement network I/O as a combination of "non-blocking + coroutine suspension": the request is sent, the coroutine `yield`s to give up, and when the data arrives the framework `resume`s the coroutine. From the coroutine user's point of view the code still reads as straight-line code.

## 4. "Concurrency" without locks

Because at most one coroutine runs at any moment, data access between two coroutines is naturally serial. As long as you do not modify shared state between `yield` calls, there is no race condition. Threads are different: every access to shared data can interleave with another thread and must be protected by a lock.

Of course, if a host program hands the same Lua state to multiple threads at once, the Lua state itself is not thread-safe. You still need external locking, or one separate state per thread (Lua 4.0 introduced multiple states specifically for this kind of scenario).

## 5. When to use coroutines, when to use threads

The choice rule boils down to one sentence: **use threads when you need parallelism, use coroutines when you need clear structure**.

- Use coroutines: tasks are mostly waiting on I/O, you need to rewrite async callbacks as straight-line code, you need generators and lazy evaluation, or you are splitting single-machine game logic across frames.
- Use threads: tasks are mostly CPU computation on a multicore machine, you need true concurrent throughput, or the libraries you call block by themselves.

In embedded and game development the most common combination is "a small number of system threads + one Lua state per thread + coroutines inside the state for logic scheduling" — the two complement each other.

## Wrap-up

Coroutines and threads solve problems at two different levels: threads solve "how to run at the same time," coroutines solve "how to write alternating execution as clear straight-line code." Lua makes coroutines a language builtin so the host program gets a controllable, deterministic multitasking model whose switches happen only in user space.

## References

- [Lua 5.4 reference manual · 2.5 Coroutines](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Coroutine](https://en.wikipedia.org/wiki/Coroutine)
- [Continuation](https://en.wikipedia.org/wiki/Continuation)

<!-- BACKLINKS-AUTO -->
## Related pages

- [coroutines](coroutines.md)
- [applications](/knowledge/applications.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
