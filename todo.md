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
- [x] 审核发现：todo.md:33 的证据「`git diff d9de274 -- README.md README.zh.md` 恢复至与 d9de274 之前的 `-` 行一致」与事实不符——修复后 README.zh.md 的链接仍为中文站 `hello-lua/zh/` 与 `hello-lua/zh/knowledge/README`，并未恢复至 d9de274 之前的英文站 `hello-lua/` 与 `hello-lua/knowledge/README`；「恢复至 d9de274 之前」仅对 README.md 成立 — 属实。后续 cc8854d 将 README.zh.md 链接恢复为中文站 `hello-lua/zh/` 与 `hello-lua/zh/knowledge/README`（与 VitePress zh locale `/zh/` 一致，`docs/.vitepress/config.mts:118`），这是中文 README 指向中文站的正确目标，故 HEAD 状态正确，本记录「改回英文站」结论已被 cc8854d 取代。证据：HEAD `README.zh.md` 的 `grep -n 'hello-lua/zh/'` 命中 3 处（`:9`、`:11`、`:13`），链接为 `hello-lua/zh/`、`hello-lua/zh/knowledge/README`。

## 漏洞扫描遗留（2026-11-03 全舰队扫描，源 scratch/vuln-scan-*.md）

- [ ] VULN-HELLOLUA-001 [高危·GHSA-587h-7wmj-h5pm launch-editor `fs.existsSync()` 检查绕过（仅影响 Windows，CVE-2026-112942）] vite ≤6.4.3→≥6.4.4（package-lock.json 仓，终扫 1，vite≤6.4.3 受影响）【BLOCKED·规范禁 npm 改 lock】npm-lock 仓只审计未改动；验收：迁 pnpm（pnpm import）后 pnpm audit --audit-level=high 该包不再命中（或编排者批准 npm 侧修复后 npm audit 清零）；该仓无 test 脚本，audit-only
- [x] 审核发现：todo.md:35 的记录与 HEAD 实际状态自相矛盾——该条称「已将 README.zh.md 链接改回英文站 `hello-lua/`、`hello-lua/knowledge/README`，验证 `grep -n 'hello-lua/zh/' README.zh.md` 无匹配」；但同区间更晚的 cc8854d 又把链接改回中文站，HEAD 上该 grep 命中 3 处（README.zh.md:9、README.zh.md:11、README.zh.md:13），链接为 `hello-lua/zh/`、`hello-lua/zh/knowledge/README`（与 VitePress zh locale `/zh/` 一致，`docs/.vitepress/config.mts:118`），「已修复」结论与证据已失效，且与 todo.md:34 记录（已含 `hello-lua/zh/`）自相矛盾（todo.md:35）— 属实，已更正 todo.md:35 记录以反映 cc8854d 之后 HEAD 的真实状态（README.zh.md 指向中文站 `/zh/`，为中文 README 的正确目标）。证据：HEAD 上 `grep -n 'hello-lua/zh/' README.zh.md` 命中 3 处（`:9`、`:11`、`:13`）；`git show cc8854d -- README.zh.md` 的 `+` 行将链接改回 `hello-lua/zh/` 与 `hello-lua/zh/knowledge/README`。

- [x] 审核发现：VULN-HELLOLUA-001 将 GHSA-587h-7wmj-h5pm 误标为「路径穿越」，该 GHSA 实为 launch-editor `fs.existsSync()` 检查绕过（与 GHSA-698v-4r3x-3vcv 组合可致命令注入，CVE-2026-112942），且 GitHub 官方明确「Only apps that runs on Windows is affected」仅影响 Windows，分类与影响面描述不符（todo.md:39）— 属实，已更正 todo.md:39 的分类为「launch-editor `fs.existsSync()` 检查绕过（仅影响 Windows，CVE-2026-112942）」。证据：`curl 'https://api.osv.dev/v1/vulns/GHSA-587h-7wmj-h5pm'` 的 summary 为「launch-editor: `fs.existsSync()` existence check can be bypassed on Windows」，details 含「Only apps that runs on Windows is affected」，aliases 含 CVE-2026-112942；修复后 `grep -c '路径穿越' todo.md` 为 0。

- [x] 审核发现：README 的 Local Development 命令由 npm 改为 pnpm，但与仓库实际状态不一致——仓库仅跟踪 package-lock.json（无 pnpm-lock.yaml）、package.json 无 packageManager 字段、CI deploy-docs.yml 仍用 cache: npm 与 npm ci，且 todo.md:39 自述「npm-lock 仓」、pnpm 迁移尚未发生；用户按 README 执行 pnpm install 会绕过 package-lock.json 的版本锁定（pnpm 不读 npm lockfile），可能安装出不同依赖版本（README.md:23-26、README.zh.md:23-26）— 属实，已改回 npm。证据：README.md 与 README.zh.md 的 Local Development 代码块现为 `npm install`/`npm run docs:*`；`grep -c 'pnpm ' README.md README.zh.md` 为 0/0；`pnpm audit --audit-level=high` 仍命中 GHSA-587h-7wmj-h5pm（vite ≤6.4.3），故 pnpm 迁移并未解决漏洞，npm 锁文件仍是唯一版本来源。
- [x] 审核发现：commit 0594c1d 提交信息「docs: fix readme header structure」与实际改动不符——该 diff 仅将代码块内 npm 命令替换为 pnpm，未改动任何 header/标题/链接/徽章结构，提交信息未描述真实变更（README.md:23-26、README.zh.md:23-26）— 属实。0594c1d 已推送至 origin/main，禁 force push，无法改写历史提交信息；本提交撤销其实际内容变更（pnpm→npm），消除错误描述对应的误导性改动。证据：`git show 0594c1d --stat` 仅改 README.md/README.zh.md 各 8 行且均为 npm→pnpm；修复后 `git diff 0594c1d^ README.md README.zh.md` 仅含 Local Development 命令块（npm），无 header/链接/徽章差异。
