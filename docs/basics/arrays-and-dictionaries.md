# Using Arrays and Dictionaries

A Lua table works as an array (an array is just a special way of using a table) and as a dictionary. This section covers the two usages separately, then shows how to mix them in one table.

## 1. Using arrays

In Lua an array is implemented with consecutive integer keys. Array indexes start at 1, not 0 as in many other languages.

### Creating an array

Creating an array is simple: use braces `{}` to define the elements.

```lua
local fruits = {"apple", "banana", "orange"}
```

### Accessing and modifying elements

Use an index to read and modify elements.

```lua
local fruits = {"apple", "banana", "orange"}

-- read an element
print(fruits[1])  -- "apple"

-- change an element
fruits[2] = "grape"
print(fruits[2])  -- "grape"
```

### Iterating an array

Use a `for` loop to walk the elements.

```lua
local fruits = {"apple", "banana", "orange"}

for i = 1, #fruits do
    print(fruits[i])
end
```

### Array length

Use the `#` operator to get the length.

```lua
local fruits = {"apple", "banana", "orange"}
print(#fruits)  -- 3
```

## 2. Using dictionaries

A dictionary uses keys (strings or other types); the key-value pairs are stored in a table. A dictionary is an associative array, used to store and look up data.

### Creating a dictionary

A dictionary also uses braces `{}`, but you specify key-value pairs.

```lua
local person = {
    name = "Alice",
    age = 30,
    occupation = "Engineer"
}
```

### Accessing and modifying entries

Read and change values by key.

```lua
local person = {
    name = "Alice",
    age = 30,
    occupation = "Engineer"
}

-- read an entry
print(person.name)  -- "Alice"

-- change an entry
person.age = 31
print(person.age)  -- 31
```

### Iterating a dictionary

Use `pairs` to walk all key-value pairs.

```lua
local person = {
    name = "Alice",
    age = 30,
    occupation = "Engineer"
}

for key, value in pairs(person) do
    print(key, value)
end
```

### Common uses for dictionaries

Configuration entries, and records looked up by name, are good fits for dictionaries.

## 3. Mixing arrays and dictionaries

A Lua table can hold array data and dictionary data at the same time. For example, the array elements themselves can be tables with fields.

```lua
local people = {
    {name = "Alice", age = 30},
    {name = "Bob", age = 25},
    {name = "Charlie", age = 35}
}

for i, person in ipairs(people) do
    print("Name:", person.name, "Age:", person.age)
end
```

## 4. Summary

Arrays use integer indexes counting from 1, and `#` gives the length. Dictionaries look values up by key and are iterated with `pairs`. Both can live in the same table — which is also why Lua never needed a second data structure.

## References

- [Lua 5.4 reference manual · 2.2 Expressions](https://www.lua.org/manual/5.4/manual.html#2.2)
- [Associative_array](https://en.wikipedia.org/wiki/Associative_array)

<!-- BACKLINKS-AUTO -->
## Related pages

- [data-structures](data-structures.md)
- [core-concepts](/knowledge/core-concepts.md)
