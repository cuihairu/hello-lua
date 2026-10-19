# Hello Lua 文档结构审计（2026-10-19）

范围：只读核查仓库现有文档与导航；本报告为唯一新增文件。行数按 Markdown 物理行统计，构建产物 `docs/.vitepress/dist/` 不纳入源文档。

## 量化事实

### docs 下一级目录规模

| docs 下一级 | Markdown 数 | 总行数 |
|---|---:|---:|
| 根目录（`index.md`、`glossary.md`、`SUMMARY.md`） | 3 | 311 |
| `advanced/` | 25 | 3,067 |
| `appendix/` | 5 | 587 |
| `basics/` | 20 | 2,414 |
| `design-and-implementation/` | 22 | 1,770 |
| `knowledge/` | 6 | 581 |
| `lua-best-practices/` | 12 | 1,408 |
| `lua-extensions-applications/` | 12 | 1,366 |
| **合计** | **105** | **11,504** |

### 组织轴盘点

这里把“内容分区”和“导航/索引”分开计数，避免把目录数量和组织方式混为一谈。内容层有 **7 个并行主题轴**；导航层有 VitePress 侧边栏和 mdBook 遗留映射两份索引。

| 组织轴/类型 | 条目数 | 命名规律 | 有无编号 | 编号连续性 |
|---|---:|---|---|---|
| 基础 `basics/` | 19 篇非 README 页面 | 英文小写 kebab-case，按基础概念与学习顺序分组 | 否 | 不适用 |
| 进阶 `advanced/` | 24 篇非 README 页面 | 英文小写 kebab-case，按函数、对象、协程、模块、错误处理分组 | 否 | 不适用 |
| 设计实现 `design-and-implementation/` | 21 篇非 README 页面 | 英文小写 kebab-case，偏运行时/实现专题 | 否 | 不适用 |
| 扩展应用 `lua-extensions-applications/` | 11 篇非 README 页面 | 英文小写 kebab-case，C 交互、嵌入式、LuaJIT | 否 | 不适用 |
| 最佳实践 `lua-best-practices/` | 11 篇非 README 页面 | 英文小写 kebab-case，规范、优化、测试、部署 | 否 | 不适用 |
| 附录 `appendix/` | 4 篇非 README 页面 | 英文小写 kebab-case，FAQ/标准库/资源 | 否 | 不适用 |
| 知识汇总 `knowledge/` | 5 篇非 README 页面 | 英文小写 kebab-case，概念/书籍/官方文档/应用/坑 | 否 | 不适用 |
| 侧边栏 `docs/.vitepress/sidebar.json` | 103 个唯一链接 | 按 7 个主题轴编组，链接无 `.md` 后缀 | 否 | 不适用 |
| 遗留索引 `docs/SUMMARY.md` | 102 个唯一链接 | Markdown 树，路径带 `.md` 后缀 | 否 | 不适用 |
| 独立参考页（历史、术语/API 等） | 历史 1 页；API 独立目录 0 页 | 历史归基础；术语表在根目录；API 页面并入附录/扩展专题 | 否 | 不适用 |

数字前缀抽查覆盖全部 105 个 Markdown 文件：**0 个文件名以数字开头**，排序结果为空，因此没有文件级编号断档、跳号或重复编号。页面内部章节编号属于局部标题层级，不构成跨文件编号序列，例如 `docs/basics/install.md:5-96`、`docs/basics/syntax.md:5-192` 均各自从 1 起；不能据此判为跨章节断号。

## 问题清单与证据

严重度：高表示读者导航/内容正确性可能直接受损；中表示理解或维护成本可见上升；低表示一致性或冗余的轻微成本。

| 严重度 | 现象与证据 | 判断 |
|---|---|---|
| 中 | **主题交叉且有同名页面。** 协程分别在 `docs/advanced/coroutines.md`（概念与并发）与 `docs/design-and-implementation/coroutines.md`（实现专题）；GC 分布于 `docs/design-and-implementation/garbage-collection.md`、`gc-implementation.md`、`gc-optimization.md` 与 `docs/lua-best-practices/gc-tuning.md`；应用场景出现在 `docs/basics/applications.md`、`docs/knowledge/applications.md`、`docs/lua-extensions-applications/embedded-development.md`。知识汇总明确将条目定义为“横向收拢”并回链原页（`docs/knowledge/README.md:3`），因此交叉本身有设计意图，但协程两份同名 URL 需要读者依靠上下文区分。 | 采用“概念/使用/实现”跨主题拆分总体合理；应补足交叉导航，后续再判断 GC 或同名概览页是否合并。不是要求把同主题内容机械挪到同一目录。 |
| 中 | **两套导航索引并存。** `docs/.vitepress/config.mts:12-13` 明确排除 `SUMMARY.md` 构建；侧边栏导入 `docs/.vitepress/config.mts:2` 并使用 `docs/.vitepress/config.mts:32`。`docs/SUMMARY.md:1-111` 是完整镜像映射底稿，维护者需要同时意识到一份生效配置和一份非生效索引。两者链接集合分别 103、102 项，差异是首页 `docs/index.md` 只承担首页用途。 | 低至中。侧边栏是唯一运行时导航，SUMMARY 被明确标记为遗留，尚未造成页面丢失；不过改目录时双份映射易漂移。 |
| 低 | **文件命名/语言风格存在混合。** 页面文件名整体使用英文小写 kebab-case；可见标题与侧边栏条目使用中文，术语常夹英文，如 `docs/.vitepress/sidebar.json` 中“闭包（Closures）”“表（Tables）”；文档中链接文字也有原始英文短名，例如 `docs/basics/README.md:40` 的 `applications`、`docs/basics/functions.md` 中可见函数专题标题。根 README 分成 `README.md` 与 `README.zh.md`（根目录），而分区导航页统一叫 `README.md`。 | 这是“面向 URL 的英文 slug + 中文正文/导航”的混合，不是目录结构失控。建议只统一链接可见文字与文件命名约定，不为中文化 slug 批量改 URL。 |
| 低 | **主题目录名较长且粒度不同。** `basics/`、`advanced/` 是宽泛层级，`design-and-implementation/`、`lua-extensions-applications/` 是较窄复合主题；同时 `appendix/`、`knowledge/` 是资料性质的分组（目录均见上表）。 | 7 轴可以让读者按学习阶段、实现深度、实践用途与参考资料选择入口；命名宽窄差别可见，但有侧边栏中文标签补充，不足以支持大规模合并。 |
| 低 | **根目录文档较散。** `docs/index.md`、`docs/glossary.md`、`docs/SUMMARY.md` 与七个主题目录并列；其中首页和术语表对站点入口有用，SUMMARY 是配置排除的旧索引（`docs/.vitepress/config.mts:12-13`）。 | 只有 SUMMARY 有维护冗余；首页与术语表是合理的站级页面，不应当作杂散文件清除。 |

### 侧边栏对账

逐条读取 `docs/.vitepress/sidebar.json` 的链接并映射到 Markdown 文件：**配置但文件不存在 0 条**。反向检查源 Markdown 页面：除首页 `docs/index.md` 外，所有页面都进入侧边栏；首页作为站点首页不列侧边栏是预期行为。因此“文件存在但没进侧边栏”只有 1 条：

| 排名 | 文件 | 说明 |
|---:|---|---|
| 1 | `docs/index.md` | 首页由 VitePress 路由提供，不是遗漏项 |

配置侧缺失与 orphan 两组各最多 10 项；前一组为空，后一组只有上面这一项，没有隐藏未收录专题。交叉核对依据 `docs/.vitepress/sidebar.json`、`docs/.vitepress/config.mts:2,32`。

### 链接与构建核查

- 本地 Markdown 链接静态扫描（跳过 fenced code、外部 URL，按相对路径及无扩展名 `.md` 规则解析）：**0 条缺失**。初次未跳过 Lua 代码块时把 `docs/basics/functions.md:74-75` 的数组索引 `[1]`、`[2]` 误当链接，排除代码块后为零；这不是死链证据。
- VitePress 构建：已尝试 `npm run docs:build`，失败于 `sh: 1: vitepress: not found`，当前工作区未安装依赖。因此 VitePress 自身死链检查/渲染结果**未核实**。`package.json:5-11` 声明构建命令和 `vitepress` 开发依赖。

### 根目录杂散文件

- 非 `docs/` Markdown：`README.md`、`README.zh.md`，是两种语言的仓库说明；不是重复文件。依据：仓库根目录文件清单与两文件各约 36 行。
- 临时文件：在仓库根目录一级未发现临时 Markdown 或编辑器备份；`.obsidian/` 是仓库配置目录，`package-lock.json` 是 npm 锁文件。依据：根目录文件清单。
- 重复 README：根目录双语 README 与每主题一个 `README.md` 用途不同；7 个主题 README 是分区导览。未发现同目录重复 README。

## 判断与推荐

当前是 **7 个内容主题轴 + 2 份导航/索引表达（其中 SUMMARY 明确不参与构建）**。建议保留 7 个主题入口，把维护中的导航收敛为 **1 套生效目录**：侧边栏作为唯一权威索引；SUMMARY 若因 mdBook 导出仍需保留，则明确它是生成/同步产物，避免手工独立维护。没有证据要求把内容目录合并成少数几个大目录；优先处理映射单一事实来源及主题交叉链接。

| 问题 | 严重度 | 理由 |
|---|---|---|
| 双份目录维护可能漂移 | 中 | 当前链接都能对上，但两个索引 103/102 项，未来移动页面要记得双改。 |
| 协程/GC/应用等主题横跨目录 | 中 | 读者可能需要在“使用”和“实现”之间切换；已有概念边界与知识页回链，合并成本可能超过收益。 |
| 命名中英混合与 slug 规范 | 低 | 英文 slug 稳定，中文导航可读，混合只在可见文字/个别链接锚文本上显得不整齐。 |
| 构建死链验证未完成 | 中（验证缺口） | 依赖缺失使 VitePress 真实解析未核实；静态本地链接扫描为零缺失。 |

### 其实不乱、不用动

- 七个主题目录各自意图可辨，侧边栏按基础、进阶、设计实现、扩展应用、实践、附录、知识汇总分组；它们服务不同阅读任务，不是重复的编号章节。
- 目录内文件名统一为英文小写 kebab-case，数字前缀不存在；无需补号或重命名 URL。
- 侧边栏的 103 个目标全部存在，未发现失效配置项；正文扫描也没有发现本地 Markdown 死链。
- `knowledge/` 的横向清单有原页回链（`docs/knowledge/README.md:3`），适合作为速查层；它与主题讲解互补，不是天然重复。
- 根 README 双语、分区 README、首页与术语表有清晰用途；不应为“减少文件数”而删掉。

## 三期收口方案

| 期次 | 动作清单 | 影响范围 | 风险（链接/搜索/外链） | 用户拍板 |
|---|---|---|---|---|
| 一期：约 1 小时，保持 URL 与侧栏链接不变 | 补一份维护说明，说明侧边栏是当前权威导航、SUMMARY 的遗留/同步规则；统一分区 README 中的链接显示文案（英文裸 slug 改成中文标题），只改可见文字；给协程、GC、应用等交叉页补“概念/实现/实践”互链。 | 维护说明、各分区 README 与少量专题正文；不改路径、不改侧边栏目标。 | 低；不改变 URL、搜索索引的页面集合或外链地址。 | 文案统一范围由维护者确认即可；无需对外链兼容性拍板。 |
| 二期：导航变更与重定向 | 若确认弃用手工 SUMMARY，删除它或改成生成文件并在 CI 校验；若调整侧边栏层次/标签，逐项核对 VitePress 路由；只有确需改 slug 时，配置旧路径重定向并保留旧 URL 兼容。 | `docs/.vitepress/sidebar.json`、`docs/.vitepress/config.mts`、`docs/SUMMARY.md` 以及可能的重定向配置。 | 中；侧边栏层次会影响阅读路径；更改 slug 可影响搜索收录与已有外链，需重定向且部署后抽查。 | **必须用户拍板** SUMMARY 是继续支持导出、生成维护还是删除；任何 URL/侧栏层级改变也须用户确认。 |
| 三期：删除/合并章节的深度重构 | 基于实际内容逐页判定协程概览、GC 主题页及重复应用说明是否合并；决定知识汇总保留独立速查还是下沉为专题索引；合并前做内容差异表、迁移唯一内容、旧 URL 重定向。 | 多个专题 Markdown、侧边栏、SUMMARY、可能的重定向与站内链接。 | 高；页面合并/删除会影响搜索结果、引用与外链，漏迁内容也会造成信息损失。 | **必须用户拍板** 合并边界、保留哪篇为 canonical、删页政策、URL 兼容期限。 |

## 最该先做的三件事

1. 安装锁文件中声明的依赖并跑 `npm run docs:build`，补齐死链/渲染验证；目前只能标为未核实。
2. 确定 `docs/SUMMARY.md` 的未来角色，让目录映射成为可生成或可校验的单一事实来源。
3. 在协程与 GC 的主题页补清楚“概念/使用/实现/调优”边界和互链；先改善读者定位，再依据内容重复度决定是否合并。
