# Navigation maintenance notes

The VitePress config loads the sidebars from two files, one per locale:

- `docs/.vitepress/sidebar.json` — English, drives the root site (English lives at the repo root)
- `docs/.vitepress/sidebar.zh.json` — Chinese, drives `/zh/`, so every link carries the `/zh/` prefix

Locales are wired in `docs/.vitepress/config.mts` via the official VitePress `locales` map:

```
root = English  (lang: en-US)
zh   = 简体中文 (lang: zh-CN, link: /zh/)
```

Each locale keeps its own `themeConfig` under `locales[...].themeConfig`. Note this is the supported shape — `themeConfig.locales` is not read by VitePress, so per-locale nav/sidebar/footer put there render as if they did not exist.

This file is the legacy mdBook path. It is excluded from the build via `srcExclude` and no longer mirrors the directory tree. When maintaining pages, edit the sidebar for the matching locale and keep the page behind its link in step. If an mdBook export is ever restored, regenerate SUMMARY from the sidebars and validate the output in CI.
