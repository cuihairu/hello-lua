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
