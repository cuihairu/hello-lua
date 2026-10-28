# TODO

- [x] English side: translate the remaining Chinese pages under `docs/` to English (7 pages left, counting `docs/**` minus `docs/zh/`, `SUMMARY.md` and `docs/review/`)

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
| d88325d | `docs/lua-extensions-applications/ffi-library.md`, `docs/appendix/` (4 pages), `docs/design-and-implementation/lua55-source.md`, `docs/glossary.md` | 7 |

Total translated: 104. Remaining: 0.

Pages in this round: `docs/appendix/faq.md`, `docs/appendix/further-reading.md`, `docs/appendix/resources.md`, `docs/appendix/standard-library.md`, `docs/design-and-implementation/lua55-source.md`, `docs/glossary.md`, `docs/lua-extensions-applications/ffi-library.md`.

Scope notes: `SUMMARY.md` is build-excluded and stays as the English maintenance note (its only CJK is the literal locale label `简体中文`). `docs/review/` holds two dated audit reports, not in the sidebar, counted as excluded by the task brief. Pages are picked in sidebar order (`docs/.vitepress/sidebar.json`), which is the live navigation; the legacy `docs/SUMMARY.md` no longer mirrors the tree.
