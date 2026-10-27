# String Handling

Lua's built-in string functions cover the everyday operations: concatenation, slicing, searching, formatting and case conversion. This page goes through them one at a time.

## 1. Basic string operations

### Concatenation

The `..` operator joins strings into a new one.

```lua
local s1 = "Hello"
local s2 = "World"
local result = s1 .. " " .. s2
print(result)  -- "Hello World"
```

### Length

Use the `#` operator to get a string's length.

```lua
local s = "Hello World"
print(#s)  -- 11
```

### Substring extraction

Use `string.sub` to extract a substring.

```lua
local s = "Hello World"
local substr = string.sub(s, 1, 5)
print(substr)  -- "Hello"
```

### Replacement

Use `string.gsub` to replace text in a string.

```lua
local s = "Hello World"
local new_s = string.gsub(s, "World", "Lua")
print(new_s)  -- "Hello Lua"
```

## 2. Formatting

Lua provides `string.format` for formatting strings.

```lua
local name = "Alice"
local age = 30
local formatted = string.format("Name: %s, Age: %d", name, age)
print(formatted)  -- "Name: Alice, Age: 30"
```

### Common format specifiers

- `%s` - string
- `%d` - integer
- `%f` - floating point

## 3. Searching and matching

### Finding a substring

Use `string.find` to locate a substring.

```lua
local s = "Hello World"
local start_pos, end_pos = string.find(s, "World")
print(start_pos, end_pos)  -- 7 11
```

### Matching a substring

Use `string.match` to extract a matching part of a string.

```lua
local s = "Hello World"
local match = string.match(s, "World")
print(match)  -- "World"
```

### Pattern matching

`string.match` and `string.gmatch` support Lua's pattern syntax.

```lua
local s = "Hello 123 World 456"
for num in string.gmatch(s, "%d+") do
    print(num)  -- 123 and 456
end
```

## 4. Splitting and joining

### Splitting

Lua has no built-in string-splitting function, but you can get the effect with `string.gmatch` and a pattern.

```lua
local s = "apple,banana,orange"
for fruit in string.gmatch(s, "([^,]+)") do
    print(fruit)
end
-- output
-- apple
-- banana
-- orange
```

### Joining

Use `table.concat` to join several strings.

```lua
local fruits = {"apple", "banana", "orange"}
local s = table.concat(fruits, ", ")
print(s)  -- "apple, banana, orange"
```

## 5. Conversion

### Upper- and lower-case

Use `string.upper` and `string.lower` to change case.

```lua
local s = "Hello World"
print(string.upper(s))  -- "HELLO WORLD"
print(string.lower(s))  -- "hello world"
```

## 6. Strings and patterns

Lua's pattern syntax is similar to regular expressions but not identical; it is used for more involved matching and extraction.

### Common patterns

- `.` - matches any single character
- `%a` - matches any alphabetic character
- `%d` - matches any digit
- `%s` - matches any whitespace character
- `%w` - matches any alphanumeric character

### Example: extracting an email address

```lua
local s = "Contact us at support@example.com"
local email = string.match(s, "%S+@%S+")
print(email)  -- "support@example.com"
```

## 7. Summary

Concatenate with `..`, get length with `#`, search with `string.find`, extract with `string.match`, split with `string.gmatch`, join with `table.concat`, and format with `string.format`. Day-to-day text handling rarely needs anything beyond these.

## References

- [Lua 5.4 reference manual · 6.1 String Library](https://www.lua.org/manual/5.4/manual.html#6.1)
- [Hash_function](https://en.wikipedia.org/wiki/Hash_function)

<!-- BACKLINKS-AUTO -->
## Related pages

- [data-structures](data-structures.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
