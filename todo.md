# TODO

- [x] English side: translate the remaining Chinese pages under `docs/` to English (0 pages left, counting `docs/**` minus `docs/zh/`, `SUMMARY.md` and `docs/review/`)

## Progress

| Commit | Directory | Pages |
|---|---|---|
| 0ab3c77 | skeleton + `docs/index.md`, `basics/README`, `basics/introduction`, `basics/syntax`, `basics/data-types`, `advanced/README` | 6 |
| 62494ed | `docs/basics/` | 16 |
| 086add1 | `docs/advanced/` | 24 |
| 09823fa | `docs/knowledge/` (completed), `docs/appendix/README.md`, `docs/lua-extensions-applications/README.md` | 10 |
| bcb77b9 | `docs/design-and-implementation/` (12 pages) | 12 |
| 214da89 | `docs/design-and-implementation/` (9 pages) | 9 |
| d2552f3 | `docs/lua-best-practices/` (10 pages) | 10 |
| d792355 | `docs/lua-extensions-applications/` (10 pages) | 10 |
| d88325d | `docs/lua-extensions-applications/ffi-library.md`, `docs/appendix/` (4 pages), `docs/design-and-implementation/lua55-source.md`, `docs/glossary.md` | 7 |

Total translated: 104. Remaining: 0.

Pages in this round: `docs/appendix/faq.md`, `docs/appendix/further-reading.md`, `docs/appendix/resources.md`, `docs/appendix/standard-library.md`, `docs/design-and-implementation/lua55-source.md`, `docs/glossary.md`, `docs/lua-extensions-applications/ffi-library.md`.

Scope notes: `SUMMARY.md` is build-excluded and stays as the English maintenance note (its only CJK is the literal locale label `简体中文`). `docs/review/` holds two dated audit reports, not in the sidebar, counted as excluded by the task brief. Pages are picked in sidebar order (`docs/.vitepress/sidebar.json`), which is the live navigation; the legacy `docs/SUMMARY.md` no longer mirrors the tree.

## 审核发现

- [x] 审核发现：完成项仍写着“7 pages left”，与完成标记及“Remaining: 0”直接矛盾（todo.md:3）— 属实，已改“0 pages left”。证据：`git show cd8939b -- todo.md` 仅切换 `- [ ]`→`- [x]` 而未改文字；`find docs -name '*.md'` 非 zh/review/SUMMARY 计 104 页，全部完成。
- [x] 审核发现：Progress 表用 d88325d 的 7 页替换了 d792355 的 10 页记录，行合计仅 94，与 Total translated: 104 不符（todo.md:16）— 属实，已恢复 d792355 行（10 页）并保留 d88325d 行（7 页），合计 104。证据：`git show d792355:todo.md` 有 `docs/lua-extensions-applications/ (10 pages)` 行；`git diff d792355 d88325d -- todo.md` 为空，说明 cd8939b 误改；d88325d 实际改 7 个 md（`git show --stat d88325d`）。
- [x] 审核发现：两处 README 均移除了 `[English](README.md) | [中文](README.zh.md)` 语言切换链接，GitHub 读者无法再直接互切中英版本（README.md:1）— 属实，已恢复。证据：`git show 6f60261` 在两个 README 中删除该行；恢复后 `git diff HEAD~1 -- README.md README.zh.md` 为空。
- [x] 审核发现：头部同时保留本地 `docs/public/badges/docs.svg` 与新增 shields.io `docs` 徽章，存在重复的 docs 徽章（README.md:1）— 属实，已移除 shields.io 徽章，仅保留本地 `docs/public/badges/docs.svg`（aria-label `docs: VitePress`）。证据：恢复后两个 README 均无 `img.shields.io/badge/docs-`。
- ~~审核发现：README.zh.md 新增徽章 URL 内嵌未转义中文「文档」，可能无法被 shields.io 或部分渲染器正确解析（README.zh.md:1）~~ 不属实：`curl "https://img.shields.io/badge/docs-文档-blue"` 实测返回 HTTP 200 且 SVG 正确渲染 `docs: 文档`；非 ASCII 字符由浏览器/HTTP 客户端自动 percent-encode，无需手动转义。
- [x] 审核发现：头部删除 `# Hello Lua` 标题及「Read online / Knowledge Points」导航链接，README 信息量与可导航性下降（README.md:1）— 属实，已恢复。证据：恢复后两个 README 均含 `# Hello Lua`、Read online/在线阅读 及 Knowledge Points/知识点总览 链接；`git diff HEAD~1 -- README.md` 为空。
- [x] 审核发现：d9de274 重新引入 shields.io `docs-blue` 徽章，与本地 `docs/public/badges/docs.svg` 形成重复的 docs 徽章，撤销了上一轮已修复并记录的审核发现（README.md:11、README.md:18、README.zh.md:11、README.zh.md:18）— 属实，已移除 shields.io 徽章，仅保留本地 `docs/public/badges/docs.svg`。证据：`git show d9de274 -- README.md README.zh.md` 的 `+` 行新增该徽章；修复后 `grep -c 'img.shields.io/badge/docs-' README.md README.zh.md` 为 0/0，`docs/public/badges/docs.svg` 计数 1/1；两文件均无 `img.shields.io/badge/docs-`（README.zh.md 的 `/zh/` 链接路径于 todo.md:35 另行处理）。
- [x] 审核发现：Read online / Knowledge Points 链接路径被改为双斜杠 `//`（如 `hello-lua//`、`hello-lua//knowledge/README`），URL 不规范，且与 d9de274 提交“existing assets only”意图不符（README.md:16、README.md:18、README.zh.md:16、README.zh.md:18）— 属实，已改回单斜杠。证据：`git show d9de274` 的 `+` 行将 `hello-lua/` 改为 `hello-lua//`；修复后 `grep -n 'hello-lua//' README.md README.zh.md` 无匹配，链接路径为 `hello-lua/`、`hello-lua/knowledge/README`、`hello-lua/zh/`、`hello-lua/zh/knowledge/README`。
- [x] 审核发现：todo.md:33 的证据「`git diff d9de274 -- README.md README.zh.md` 恢复至与 d9de274 之前的 `-` 行一致」与事实不符——修复后 README.zh.md 的链接仍为 `hello-lua/zh/` 与 `hello-lua/zh/knowledge/README`（中文站），并未恢复至 d9de274 之前的 `hello-lua/` 与 `hello-lua/knowledge/README`（英文站）；「恢复至 d9de274 之前」仅对 README.md 成立，README.zh.md 实际保留并延续了 d9de274 引入的 `/zh/` 路径变更（todo.md:33）— 属实，已按资产铁律只修链接路径不改设计，将 README.zh.md 链接改回 `hello-lua/` 与 `hello-lua/knowledge/README`。证据：`git show d9de274 -- README.zh.md` 的 `+` 行将链接改为 `hello-lua/zh//` 与 `hello-lua/zh//knowledge/README`（中文站）；修复后 `grep -n 'hello-lua/zh/' README.zh.md` 无匹配，README.zh.md 链接为 `hello-lua/`、`hello-lua/knowledge/README`，与 d9de274 之前的 `-` 行链接一致。
