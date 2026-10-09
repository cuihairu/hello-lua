# 知识点总览

全站 98 页按板块纵向展开，这一组页面把调研产出横向收拢成五类清单：概念、书籍、官方文档、应用、坑。每条给结论和站内回链，原页才是完整讲解。

## 主题页

| 页面 | 收拢内容 | 条目 |
| --- | --- | --- |
| [核心概念](/knowledge/core-concepts) | 语言基础、进阶抽象、设计与实现、扩展工程四组 | 32 |
| [权威书籍要点](/knowledge/books) | 4 本书与 3 篇论文：书名、作者、对应知识点 | 7 |
| [官方文档要点](/knowledge/official-docs) | lua.org 手册、源码、LuaJIT、LuaRocks 与第三方仓库 | 21 |
| [应用场景](/knowledge/applications) | 游戏、嵌入式、Web、配置等八个领域 | 16 |
| [常见坑与误区](/knowledge/pitfalls) | 语法、元表、协程、GC、实现层误传等八组 | 39 |

## 口径

- 来源以站内各页与附录资源页为准；查无实据的条目标「来源未考」。
- 版本基线：语言示例以 Lua 5.4 为准，5.5 内容以 v5.5.1 源码实测为准。

## 盘点中发现的站内问题

整理过程顺带发现几处站内不一致，如实记录在此：

- [设计与实现](/design-and-implementation/README) 概览页写「语法分析出 AST」「代码生成做死代码消除」，与专页实测结论（不建 AST、不做死代码消除）相矛盾，引用时以专页为准。
- [环境搭建](/basics/setup) 与 [安装Lua](/basics/install) 的安装章节大量重叠，且前者结尾疑似截断。
- [基本语法](/basics/syntax) 的算术操作符只列六种，漏了 `//`，与 [操作符和表达式](/basics/operators-and-expressions) 的七种不一致。
- [部署与发布](/lua-best-practices/deployment) 与 [Lua代码的部署](/lua-best-practices/code-deployment) 内容高度重合，是同一主题的两份近似文本。
- [Lua的历史和发展](/basics/history-and-development) 对 Lua 5.5 的年份标注与公开记录不一致（来源未考）。
