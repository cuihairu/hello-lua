# Common Coding Mistakes

The mistakes below recur in Lua code; each comes with a fix.

## 1. Ignoring Local Variables

Using global variables instead of local ones invites name collisions and is slower to access.

Counterexample:

```lua
-- Not recommended
count = 0

function increment()
    count = count + 1
end
```

The fix is `local`, limiting scope to a function or block.

After:

```lua
local count = 0

function increment()
    count = count + 1
end
```

## 2. Incorrect Table Key Usage

Using a freshly created table as a key means the value you wrote cannot be retrieved.

A table itself can be a key (Lua allows any non-`nil` value as a key), but in the following code every `{}` creates a **new** table. The write and the read use two different objects, so what comes back is `nil`.

Counterexample:

```lua
local t = {}
t[{}] = "value"   -- write: the key is the table created here

print(t[{}])      -- read: creates another new table here, prints nil
```

Fix: use keys that construct stably, such as strings or numbers. When a table must be a key, store it in a local variable and reuse it.

After:

```lua
local t = {}
t["key"] = "value"  -- correct key usage

print(t["key"])  -- prints "value"
```

## 3. Unhandled Errors

Calling a function that may fail without handling the failure crashes the program on the spot.

Counterexample:

```lua
local file = io.open("nonexistent_file.txt", "r")
local content = file:read("a")  -- when the file doesn't exist, file is nil, so this errors
```

Note: `io.open` **does not raise** an error when opening fails; it returns `nil, errmsg`. So `pcall(io.open, ...)` cannot catch "file not found"; what actually errors is calling `read` on `nil` afterward.

Fix: check `io.open`'s return value before reading.

After:

```lua
local file, err = io.open("nonexistent_file.txt", "r")
if file then
    local content = file:read("a")
    file:close()
    print(content)
else
    print("Error opening file: " .. tostring(err))
end
```

## 4. Duplicate Code

Copying and pasting similar code without extracting a function means fixing one place requires remembering the other.

Example:

```lua
function calculate_area(width, height)
    return width * height
end

-- duplicate code
local area1 = 10 * 20
local area2 = 15 * 25
```

Fix: extract duplicate code into a function so one change suffices.

After:

```lua
function calculate_area(width, height)
    return width * height
end

local area1 = calculate_area(10, 20)
local area2 = calculate_area(15, 25)
```

## 5. Inappropriate Use of the Global Table

Stuffing data into the global table means sooner or later someone overwrites it, or you overwrite someone else's.

Counterexample:

```lua
-- Not recommended
_G.some_variable = "value"  -- modifying the global table directly
```

Fix: organize and store data in local tables or modules, and leave the global table alone.

After:

```lua
local MyModule = {}

function MyModule.set_value(value)
    MyModule.value = value
end

return MyModule
```

## 6. Unreasonable Table Operations

Acting on a table without thinking through its characteristics easily produces slow code or logic errors.

Example:

```lua
local t = {1, 2, 3, 4}
table.insert(t, 5)
print(t[5])  -- prints 5: the value was appended to the table
```

Understand the table's characteristics and operation methods first, saving a lot of needless overhead and errors.

Example:

```lua
local t = {1, 2, 3, 4}
table.insert(t, 5)  -- insert a value into the table
for i, v in ipairs(t) do
    print(i, v)  -- iterate over the table's values
end
```

## 7. Incorrect String Operations

Before using string functions, remember: strings are immutable, cannot be changed in place, and only new strings can be created.

Counterexample:

```lua
local str = "Hello"
-- str:sub(1, 3) = "Hi"  -- wrong: strings are immutable and cannot be assigned to (this line is also a syntax error)
```

Fix: use appropriate string functions to produce a new string instead of trying to modify in place.

After:

```lua
local str = "Hello"
local new_str = "Hi" .. str:sub(4)  -- creates a new string: "Hi" concatenated with "lo"
print(new_str)  -- prints "Hilo"
```

## 8. Not Using Lua's Coroutine Feature

Writing a long task as one straight call chain leaves you waiting. Coroutines can yield execution mid-way so the main flow doesn't stall.

Counterexample:

```lua
function task1()
    -- run a long task
end

function task2()
    -- run another long task
end

task1()  -- blocks execution
task2()
```

Fix: put the tasks in coroutines, drive them with `coroutine.resume`, and they yield at `coroutine.yield`.

After:

```lua
local co1 = coroutine.create(function()
    -- run a long task
end)

local co2 = coroutine.create(function()
    -- run another long task
end)

coroutine.resume(co1)
coroutine.resume(co2)
```

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Exception_handling](https://en.wikipedia.org/wiki/Exception_handling)

<!-- BACKLINKS-AUTO -->
## Related pages

- [pitfalls](/knowledge/pitfalls.md)
- [code-style](code-style.md)
