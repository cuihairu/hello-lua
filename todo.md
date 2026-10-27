# TODO

- [ ] English side: translate the remaining Chinese pages under `docs/` to English (27 pages left, counting `docs/**` minus `docs/zh/`, `SUMMARY.md` and `docs/review/`)

## Progress

| Commit | Directory | Pages |
|---|---|---|
| 0ab3c77 | skeleton + `docs/index.md`, `basics/README`, `basics/introduction`, `basics/syntax`, `basics/data-types`, `advanced/README` | 6 |
| 62494ed | `docs/basics/` | 16 |
| 086add1 | `docs/advanced/` | 24 |
| 09823fa | `docs/knowledge/` (completed), `docs/appendix/README.md`, `docs/lua-extensions-applications/README.md` | 10 |
| bcb77b9 | `docs/design-and-implementation/` (12 pages) | 12 |
| this commit | `docs/design-and-implementation/` (9 pages) | 9 |

Total translated: 77. Remaining: 27 (`design-and-implementation/` 1, `lua-extensions-applications/` 11, `lua-best-practices/` 10, `appendix/` 4, `glossary.md` 1).

Pages in this round: `docs/design-and-implementation/coroutines-scheduling.md`, `docs/design-and-implementation/dynamic-linking.md`, `docs/design-and-implementation/garbage-collection.md`, `docs/design-and-implementation/gc-implementation.md`, `docs/design-and-implementation/gc-optimization.md`, `docs/design-and-implementation/hot-reloading.md`, `docs/design-and-implementation/module-system-design.md`, `docs/design-and-implementation/module-system.md`, `docs/design-and-implementation/reference-counting.md`.

Scope notes: `SUMMARY.md` is build-excluded and stays as the English maintenance note (its only CJK is the literal locale label `简体中文`). `docs/review/` holds two dated audit reports, not in the sidebar, counted as excluded by the task brief. Pages are picked in sidebar order (`docs/.vitepress/sidebar.json`), which is the live navigation; the legacy `docs/SUMMARY.md` no longer mirrors the tree.
