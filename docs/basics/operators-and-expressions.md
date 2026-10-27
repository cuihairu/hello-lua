# Operators and Expressions

An expression is made up of operators and operands, and it evaluates to a value. Lua's operators fall into six groups; this page goes through them one at a time.

## 1. Arithmetic operators

Arithmetic operators perform mathematical operations. Lua provides the basic ones: addition, subtraction, multiplication, division, modulus, exponentiation and integer division.

### Addition (`+`)

```lua
local a = 10
local b = 5
local sum = a + b
print(sum)  -- 15
```

### Subtraction (`-`)

```lua
local a = 10
local b = 5
local difference = a - b
print(difference)  -- 5
```

### Multiplication (`*`)

```lua
local a = 10
local b = 5
local product = a * b
print(product)  -- 50
```

### Division (`/`)

```lua
local a = 10
local b = 5
local quotient = a / b
print(quotient)  -- 2.0
```

### Modulus (`%`)

```lua
local a = 10
local b = 3
local remainder = a % b
print(remainder)  -- 1
```

### Exponentiation (`^`)

The exponentiation operator always returns a floating point result.

```lua
local a = 2
local b = 3
local power = a ^ b
print(power)  -- 8.0
```

### Integer division (`//`)

Integer division (floor division) returns an integer result when both operands are integers.

```lua
local a = 10
local b = 3
local quotient = a // b
print(quotient)  -- 3
```

## 2. Comparison operators

Comparison operators compare the size or equality of two values and return a boolean (`true` or `false`).

### Equal (`==`)

```lua
local a = 10
local b = 5
print(a == b)  -- false
```

### Not equal (`~=`)

```lua
local a = 10
local b = 5
print(a ~= b)  -- true
```

### Greater than (`>`)

```lua
local a = 10
local b = 5
print(a > b)  -- true
```

### Less than (`<`)

```lua
local a = 10
local b = 5
print(a < b)  -- false
```

### Greater than or equal (`>=`)

```lua
local a = 10
local b = 5
print(a >= b)  -- true
```

### Less than or equal (`<=`)

```lua
local a = 10
local b = 5
print(a <= b)  -- false
```

## 3. Logical operators

Logical operators handle boolean values and logical operations.

### AND (`and`)

```lua
local a = true
local b = false
print(a and b)  -- false
```

### OR (`or`)

```lua
local a = true
local b = false
print(a or b)  -- true
```

### NOT (`not`)

```lua
local a = true
print(not a)  -- false
```

## 4. Concatenation operator

The concatenation operator joins strings together.

### String concatenation (`..`)

```lua
local firstName = "Lua"
local lastName = "Programming"
local fullName = firstName .. " " .. lastName
print(fullName)  -- Lua Programming
```

## 5. Assignment operator

The assignment operator `=` stores the value of the right-hand expression into the variable on the left. Note that it is different from the comparison operator `==`.

### Assignment (`=`)

```lua
local a = 10
local b = 5
a = b  -- assigns the value of b to a
print(a)  -- 5
```

## 6. Combined expressions

An expression can contain several operators and operands to perform more involved calculations and tests.

### Example

```lua
local a = 10
local b = 5
local c = 2
local result = (a + b) * c / (b - c)
print(result)  -- 10.0
```

## Wrap-up

Seven arithmetic operators, six comparisons, three logical ones, plus `..` for concatenation and `=` for assignment — that is the complete operator set.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [Lua 5.4 reference manual · 2.3 Operators](https://www.lua.org/manual/5.4/manual.html#2.3)
- [PIL · Lexical and Syntax Analysis](https://www.lua.org/pil/2.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
