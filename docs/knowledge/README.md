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

## 盘点修正记录

整理过程顺带发现几处站内不一致，2026-10-10 已全部修复：

- [设计与实现](/design-and-implementation/README) 概览页的编译链路（误写 AST 与死代码消除）和 GC 表述（误列引用计数）已按专页实测结论改写。
- [环境搭建](/basics/setup) 已改为导览页，安装与 IDE 细节指向专页，补上缺失的结语。
- [基本语法](/basics/syntax) 的算术操作符已补上 `//`，与七种的说法对齐。
- 「Lua代码的部署」与 [部署与发布](/lua-best-practices/deployment) 高度重合，重复页已删除，主题统一到后者。
- [Lua的历史和发展](/basics/history-and-development) 的 5.5 年份已按官方 versions 页核实改为 2025 年。

## 重叠页处置记录

盘点发现的 8 组内容重叠页，2026-10-10 按下列口径处置：逐组核对是真重复还是互补；同题异稿且一方覆盖另一方，删被覆盖页；互补则把散页要点融合进主页面；带 sidebar 子页的组页不删，改写成导览页。逐组结论：

| 组 | 页面 | 判定 | 处置 |
| --- | --- | --- | --- |
| 1 | [数据结构](/basics/data-structures) | 组页四节与子页逐字重复 | 组页改导览，四个子页保留 |
| 2 | [错误处理](/advanced/error-handling) | 组页每节被子页覆盖（pcall/xpcall 同稿；错误类型与调试被专页更详尽覆盖） | 组页改导览；错误处理机制、错误类型与调试互补，均保留 |
| 3 | [面向对象编程](/advanced/object-oriented) | 组页三节分别被子页覆盖（Dog 类同稿、Animal/Cat 更详尽、设计模式少两种） | 组页改导览，五个子页保留 |
| 4 | [模块与包](/advanced/modules-and-packages) | 组页各节被子页与热加载专页覆盖 | 组页改导览；标准库五模块清单折进导览 |
| 5 | [性能优化](/lua-best-practices/performance-optimization) | 与优化技巧页七节同稿，但两页各有独有内容（互补） | 独有要点（`table.insert` 与预分配说明、元表开销）融入 [Lua代码的优化技巧](/lua-best-practices/optimization-techniques)（扩为 11 节），组页改导览 |
| 6 | [测试与调试](/lua-best-practices/testing-debugging) | 组页四节被子页与错误处理机制页覆盖 | 组页改导览，两个子页保留 |
| 7 | [代码风格与规范](/lua-best-practices/code-style) | 与编码规范页四节同稿，组页另有零星独有细节（互补） | 独有细节（全局变量前缀、表名驼峰、函数拆分）融入 [Lua的编码规范](/lua-best-practices/coding-standards)，组页改导览 |
| 8 | [Lua相关资源与社区](/appendix/resources)、[扩展阅读与学习资源](/appendix/further-reading) | 互补：一页管安装与求助渠道，一页管论文、源码阅读路线与字节码实证工具，重叠仅限公认官方链接 | 两页保留，总结互加链接 |

组页（sidebar 主链接且带子页的页面）不删改删的理由：它们是侧边栏的导航锚点，删除会破坏整组结构；正文与子页重复的部分删掉后，导览页保留组内入口和一句收束，导航职责不变。
