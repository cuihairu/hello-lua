# 数据结构

Lua 只提供一种数据结构：表（tables）。数组、字典以及更复杂的数据组织，都靠它。本组四页：

- [表（Tables）](/zh/basics/tables)：表的创建、数组与字典用法、嵌套表。
- [元表和元方法](/zh/basics/metatables-and-metamethods)：`setmetatable`、`__index`/`__newindex`、运算符重载。
- [字符串处理](/zh/basics/string-handling)：拼接、子串、格式化、模式匹配。
- [数组和字典的使用](/zh/basics/arrays-and-dictionaries)：从 1 起的数组、关联数组、混合表。

## 结语

整数索引的表就是数组，字符串索引的表就是字典，改表的行为用元表，处理文本用 `string` 库。Lua 管数据的工具就这些。

## 参考资料

- [Lua 5.4 官方手册](https://www.lua.org/manual/5.4/manual.html#2.2)
- [Associative_array](https://en.wikipedia.org/wiki/Associative_array)
- [Hash_table](https://en.wikipedia.org/wiki/Hash_table)
- [PIL · 表](https://www.lua.org/pil/12.html)

<!-- BACKLINKS-AUTO -->
## 相关页面

- [glossary](/zh/glossary.md)
- [README](/zh/knowledge/README.md)
- [core-concepts](/zh/knowledge/core-concepts.md)
