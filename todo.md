# TODO

- [ ] English side: translate the remaining Chinese pages under `docs/` to English (36 pages left, counting `docs/**` minus `docs/zh/`, `SUMMARY.md` and `docs/review/`)

## Progress

| Commit | Directory | Pages |
|---|---|---|
| 0ab3c77 | skeleton + `docs/index.md`, `basics/README`, `basics/introduction`, `basics/syntax`, `basics/data-types`, `advanced/README` | 6 |
| 62494ed | `docs/basics/` | 16 |
| 086add1 | `docs/advanced/` | 24 |
| 09823fa | `docs/knowledge/` (completed), `docs/appendix/README.md`, `docs/lua-extensions-applications/README.md` | 10 |
| this commit | `docs/design-and-implementation/` (12 pages) | 12 |

Total translated: 68. Remaining: 36 (`design-and-implementation/` 10, `lua-extensions-applications/` 11, `lua-best-practices/` 10, `appendix/` 4, `glossary.md` 1).

Pages in this round: `docs/design-and-implementation/README.md`, `docs/design-and-implementation/design-principles.md`, `docs/design-and-implementation/lightweight-design.md`, `docs/design-and-implementation/vm-architecture.md`, `docs/design-and-implementation/memory-management.md`, `docs/design-and-implementation/interpreter-implementation.md`, `docs/design-and-implementation/lexical-syntax-analysis.md`, `docs/design-and-implementation/code-generation.md`, `docs/design-and-implementation/bytecode-and-vm.md`, `docs/design-and-implementation/coroutines.md`, `docs/design-and-implementation/coroutines-design.md`, `docs/design-and-implementation/coroutines-implementation.md`.

Scope notes: `SUMMARY.md` is build-excluded and stays as the English maintenance note (its only CJK is the literal locale label `简体中文`). `docs/review/` holds two dated audit reports, not in the sidebar, counted as excluded by the task brief. Pages are picked in sidebar order (`docs/.vitepress/sidebar.json`), which is the live navigation; the legacy `docs/SUMMARY.md` no longer mirrors the tree.
