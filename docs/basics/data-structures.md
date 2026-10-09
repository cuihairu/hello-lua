# 数据结构

Lua 只提供一种数据结构：表（tables）。数组、字典以及更复杂的数据组织，都靠它。本组四页：

- [表（Tables）](/basics/tables)：表的创建、数组与字典用法、嵌套表。
- [元表和元方法](/basics/metatables-and-metamethods)：`setmetatable`、`__index`/`__newindex`、运算符重载。
- [字符串处理](/basics/string-handling)：拼接、子串、格式化、模式匹配。
- [数组和字典的使用](/basics/arrays-and-dictionaries)：从 1 起的数组、关联数组、混合表。

## 结语

整数索引的表就是数组，字符串索引的表就是字典，改表的行为用元表，处理文本用 `string` 库。Lua 管数据的工具就这些。
