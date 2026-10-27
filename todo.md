# TODO

- [ ] English side: translate the remaining Chinese pages under `docs/` to English (7 pages left, counting `docs/**` minus `docs/zh/`, `SUMMARY.md` and `docs/review/`)

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
| this commit | `docs/lua-extensions-applications/` (10 pages) | 10 |

Total translated: 97. Remaining: 7 (`lua-extensions-applications/` 1, `appendix/` 4, `design-and-implementation/` 1, `glossary.md` 1).

Pages in this round: `docs/lua-extensions-applications/c-interaction.md`, `docs/lua-extensions-applications/writing-c-extensions.md`, `docs/lua-extensions-applications/calling-lua-from-c.md`, `docs/lua-extensions-applications/mixed-programming.md`, `docs/lua-extensions-applications/embedded-development.md`, `docs/lua-extensions-applications/using-lua-embedded.md`, `docs/lua-extensions-applications/memory-gc.md`, `docs/lua-extensions-applications/luajit.md`, `docs/lua-extensions-applications/introduction-to-luajit.md`, `docs/lua-extensions-applications/luajit-optimization.md`.

Scope notes: `SUMMARY.md` is build-excluded and stays as the English maintenance note (its only CJK is the literal locale label `简体中文`). `docs/review/` holds two dated audit reports, not in the sidebar, counted as excluded by the task brief. Pages are picked in sidebar order (`docs/.vitepress/sidebar.json`), which is the live navigation; the legacy `docs/SUMMARY.md` no longer mirrors the tree.
