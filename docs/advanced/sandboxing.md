# Sandboxing and Untrusted Code

In scenarios where Lua is embedded, the scripts often come from untrusted sources: mods written by players, extensions downloaded from a plugin marketplace, user-uploaded configurations. A sandbox has to let that code run while keeping it out of reach of anything beyond its granted permissions. Lua has no built-in sandboxing mechanism, so environment isolation, resource limiting, and a clear sense of the boundaries all have to be built by hand.

## 1. Environment Isolation

The fourth argument of `load` gives the code a restricted environment table (`_ENV`); what you put in the table is all the code can use:

```lua
local env = {
    print = print,
    string = string,
    table = table,
    math = math,
    tonumber = tonumber,
    tostring = tostring,
    type = type,
    pairs = pairs,
    ipairs = ipairs,
    select = select,
    pcall = pcall,
    error = error,
    assert = assert,
}

local chunk = [[
    name = "guest"
    function greet()
        return "hello, " .. name
    end
    -- os.execute("rm -rf /")  -- os is not available, so this line cannot even be written
]]

local fn = load(chunk, "guest_chunk", "t", env)
fn()
print(env.greet())  -- hello, guest
print(env.os)       -- nil
```

Nothing outside the whitelist goes in: `io`, `os`, `package`, `debug`, `load`, `require` (reads the filesystem), `dofile`, `collectgarbage`. Leave one out and its corresponding attack surface opens up.

## 2. Resource Limits

Environment isolation cannot control "runs too long" and "eats too much"; those two need counting hooks via `debug.sethook`.

Instruction quota — the hook fires once every 100 instructions, and raises an error when the quota is exceeded:

```lua
local budget = 100000
local steps = 0

local function quota()
    steps = steps + 1
    if steps > budget then
        error("instruction budget exceeded")
    end
end

debug.sethook(quota, "", 100)  -- the third argument, 100, is the counting interval for the hook

local ok, err = pcall(function()
    local n = 0
    for i = 1, 1e9 do n = n + i end  -- far beyond the quota
    return n
end)

debug.sethook()
print(ok, err)  -- false  instruction budget exceeded
```

Time quota — check `os.clock()` inside the same hook, and raise an error once the deadline passes; even an infinite loop can be cut off:

```lua
local deadline = os.clock() + 0.5
local function timecheck()
    if os.clock() > deadline then
        error("time limit exceeded")
    end
end

debug.sethook(timecheck, "", 1000)

local ok, err = pcall(function()
    while true do end  -- infinite loop
end)

debug.sethook()
print(ok, err)  -- false  time limit exceeded
```

Memory quota — `collectgarbage("count")` returns the current memory usage (KB); pair it with a pre-allocation check:

```lua
local limit = 1024  -- KB
local before = collectgarbage("count")
if before + 512 > limit then
    error("memory budget exceeded")
end
```

## 3. Know the Boundaries

A sandbox is one layer of defense in depth, not a security boundary. Three holes that cannot be avoided:

- The `debug` library is itself an escape hatch: sandboxed code that gets `debug` can read hooks, modify hooks, and access the registry, so `debug` must be removed from the environment — but once it is removed, `debug.sethook` is unreachable too, and quota hooks can only be installed by the host outside the sandbox.
- C extensions are not bound by the Lua layer: C code loaded via `ffi.load` and C modules pulled in via `require` both bypass every check Lua applies.
- Side channels at the interpreter level: differences in timing and memory layout cannot be plugged at the Lua layer.

For running untrusted code in production, hard isolation belongs on the operating-system side: a separate process plus a container, with syscall filtering via seccomp or similar. A Lua sandbox is one layer of defense in depth, not a wall.

## Wrap-up

Whitelist the environment, gate resources with hooks, and keep the boundaries clear: a sandbox only stops code that plays by Lua's rules; real isolation is the operating system's job.

## References

- [Lua 5.4 reference manual · 2.7 Environment](https://www.lua.org/manual/5.4/manual.html#2.7)
- [Lua 5.4 reference manual · 2.8 Vararg Parameters](https://www.lua.org/manual/5.4/manual.html#2.8)
- [Sandbox_(computer_security)](https://en.wikipedia.org/wiki/Sandbox_(computer_security))
- [Principle_of_least_privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)