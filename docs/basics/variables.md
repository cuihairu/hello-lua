# Variables and Assignment

Lua variables are dynamically typed; you can assign values of different types to the same variable at runtime. This section covers definition, assignment and scoping.

## 1. Defining variables

In Lua a variable needs no prior type declaration: use the `local` keyword, or just assign to it. `local` defines a local variable; a variable without `local` becomes global.

### Local variables

A local variable's scope is limited to the block in which it is defined, such as a function or a control structure. Locals help avoid name clashes and make code easier to read.

```lua
local x = 10
local y = 20

print(x)  -- 10
print(y)  -- 20
```

### Global variables

Globals are the default in Lua: if you do not use `local`, the variable is global. A global's scope is the whole script or program.

```lua
z = 30  -- global
print(z) -- 30
```

## 2. Assignment

Lua binds values to variables through assignment. Several variables can be assigned at once, and you can assign the result of an expression.

### Single assignment

Assign a value directly:

```lua
local name = "Lua"
local version = 5.4
```

### Multiple assignment

Lua supports multiple assignment, giving several variables values on one line.

```lua
local a, b, c = 1, 2, 3
print(a)  -- 1
print(b)  -- 2
print(c)  -- 3
```

### Assignment from an expression

You can also assign an expression's result to a variable:

```lua
local sum = 10 + 20
local product = 5 * 6
print(sum)      -- 30
print(product)  -- 30
```

### Assignment in tables

Lua tables store and organize data, and assigning to a table's fields follows the same rules:

```lua
local person = {}
person.name = "Lua"
person.age = 5
print(person.name)  -- Lua
print(person.age)   -- 5
```

## 3. Variable scope

In Lua, a variable's scope determines its visibility and lifetime. A local variable can only be accessed inside the block where it is defined; a global can be accessed anywhere.

### Scope of local variables

A local is valid inside the block where it is defined; once the block ends, the local is destroyed:

```lua
do
    local x = 10
    print(x)  -- 10
end

print(x)  -- nil: the local x is out of scope, so this reads the global x
```

### Scope of global variables

A global is valid throughout the script, unless it is reassigned somewhere:

```lua
globalVar = "I am global"

function test()
    globalVar = "Modified in function"
end

test()
print(globalVar)  -- Modified in function
```

## 4. Initializing variables

A Lua variable is initialized the first time it is assigned. If a variable is used without ever being assigned, its default value is `nil`.

```lua
local a
print(a)  -- nil
```

## Wrap-up

Use `local` whenever you can: the scope is smaller, there are fewer name clashes, and problems are easier to track down. Without `local` the variable becomes global — that is Lua's default behavior, and it should not become your habit.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [PIL · Lexical and Syntax Analysis](https://www.lua.org/pil/2.html)
- [Scope_(computer_science)](https://en.wikipedia.org/wiki/Scope_(computer_science))

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)
