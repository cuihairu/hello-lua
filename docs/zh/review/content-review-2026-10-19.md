# 结构改动内容复核（2026-10-19）

## 复核范围

先执行 `git fetch origin && git pull --rebase origin main`；工作区起始干净，拉取结果为 `Already up to date`。按实际 HEAD 最近四个提交复核（`HEAD~4..HEAD`）：

| Commit | 内容 |
|---|---|
| `0378bff` | Align docs with developer notes voice（C） |
| `181a9d4` | Consolidate repeated topic facts（B） |
| `fb2955f` | Unify docs navigation source（A） |
| `6f9736f` | Add documentation structure audit（收口前审计记录） |

范围统计：17 个文件，176 insertions、231 deletions。复核也查阅了 `6f9736f` 新增的审计说明，以核对 A/B/C 的执行口径。下文行号指当前文件；“改前”行号来自相应提交的父版本。

## 四项核查

### 1. 内容丢失

**结论：发现 1 处明确遗漏，已补回；其余抽查的合并内容在权威页或专题页可找到。**

- **GC 分代参数示例遗漏（中，已修）。** 改前 `docs/design-and-implementation/gc-optimization.md:40-45` 有 `collectgarbage("generational", 20, 100)` 示例，注释说明小回收倍率/大回收倍率，并与增量模式示例并列。B 改后该段消失；当时权威页 `docs/design-and-implementation/garbage-collection.md:15-19,36-46` 虽介绍两种模式和增量参数，却没有分代模式的两个参数及示例，因此属于独有内容没有迁移。现已在 `docs/design-and-implementation/garbage-collection.md:21-26` 补上倍率语义和两种模式示例。参数含义按 [Lua 5.4 官方手册 §2.5](https://www.lua.org/manual/5.4/manual.html#2.5) 核对。
- **GC 其余删段：未见其他独有内容丢失。** 改前优化页 `:5-15` 的增量/分代概述及 `collectgarbage` 调参入口，与总览页标记-清除、模式定义及控制章节（现 `docs/design-and-implementation/garbage-collection.md:9-19,28-46`）重叠；改前 `:45` 的模式选型建议仍保留在优化页现 `:28-30`。
- **协程删段：未发现内容性遗漏。** 改前实现页 `docs/design-and-implementation/coroutines.md:5-92` 的创建/恢复/挂起/状态/调度/应用介绍，改后分别指向进阶总览和专题页（现 `:5-21`）；进阶页 `docs/advanced/coroutines.md:3-99` 及其列出的生命周期、创建使用、最佳实践页面保留了这些使用层主题。实现层入口仍链接设计、实现、调度页（现实现页 `:9,13,17`）。
- **SUMMARY 精简：属于转为说明页，没有发现内容页被删。** 改前 `docs/SUMMARY.md` 是 111 行导航映射；改后 `docs/SUMMARY.md:1-5` 明确侧栏为权威源、此文件仅为维护说明。侧栏共 103 个链接，逐项映射结果为 0 个目标缺失。导航条目被移出 SUMMARY，但没有从生效侧栏删除。

### 2. 表述被改错

**结论：未发现改错数字或把技术含义改反。**

- `README.md:16,24` 与 `README.zh.md:16,24` 改为开发者笔记/分享定位，覆盖范围仍列 Lua 基础、进阶、虚拟机实现、C 扩展/LuaJIT、实践经验；这些主题在 `docs/` 的七个主题目录中均有对应内容。两份 README 没有篇数、文件数或目录数等数字声明，故无错误计数。
- 定位调整没有将“不支持”改为“支持”之类的技术反转。逐条检查 `0378bff` 对 README、分区介绍、附录资源和扩展阅读的句子改写，改动集中在“手册/本书/学习路径”等出版或课程口吻；API 基线仍是 Lua 5.4（例如 `docs/appendix/README.md:20`、`docs/appendix/resources.md:7`）。
- `docs/knowledge/applications.md:3` 把“按九个领域”改成“按领域”；这避免了与 `docs/basics/applications.md` 实际七个顶层领域（现 `:5-59`）不符的数字，并未改变应用主题含义。

### 3. 链接与导航

**结论：侧栏目标存在；改写/新增的交叉链接抽查目标主题匹配。构建渲染未核实。**

- 自动枚举 `docs/.vitepress/sidebar.json` 的 103 个链接并映射 Markdown 源文件，缺失 0 个。A 改动只把导航权威源说明改为侧栏，没有新增、删除侧栏条目。
- 人工检查 B/C 涉及的主要交叉链接：`docs/basics/applications.md:67` 指向有案例和来源的横向速查 `docs/knowledge/applications.md`；后者 `:68` 回到领域介绍页；实现协程页 `docs/design-and-implementation/coroutines.md:7,9,13,17,21` 分别指向进阶用法、实现专题、生命周期与最佳实践，主题匹配。
- `docs/.vitepress/config.mts:2,25,46` 从 `sidebar.json` 加载侧栏，并排除 SUMMARY；符合改后的维护说明 `docs/SUMMARY.md:3,5`。
- **未核实：** 未运行 VitePress 构建，因此真实构建解析和渲染结果没有本次证据；以上是侧栏目标存在性与人工语义核对，不等同于构建验证。

### 4. 问题与验收判断

**结论：原批次发现一处中等严重度内容遗漏，修复提交后可验收；章节编号瑕疵也一并清理。**

- **中：** GC 分代模式参数示例未迁移，见第 1 项。已在修复提交中补回权威页。
- **低：** 合并后的 `docs/design-and-implementation/gc-optimization.md` 标题编号原为 `1、4、5、6`（改后、修复前），是删除章节后留下的编号空洞。现已顺排为 `1-4`（`docs/design-and-implementation/gc-optimization.md:5,9,13,28`）。
- **用户拍板：无。** 本次发现的问题均有明确证据和无争议的修复方式。

## 结论

原 A/B/C 批次不能在未修复前视为完全验收：GC 分代模式示例没有迁入权威页。该内容已补回，并以独立修复提交保留审计痕迹；侧栏目标、README 口径和相关语义检查未发现其他明确错误。**修复提交后，这批结构改动可视为已验收。** 构建/渲染仍未核实。

修复提交：`7363e69`（Restore GC tuning example）。
