import { defineConfig } from 'vitepress'
import sidebarEn from './sidebar.json'
import sidebarZh from './sidebar.zh.json'

// https://vitepress.dev/reference/site-config
//
// Bilingual via VitePress official locales:
//   root  = English  (lang en-US)
//   /zh/  = 简体中文 (lang zh-CN)
// Per-locale nav, sidebar, footer and UI strings live in locales[...].themeConfig
// (the official shape — NOT themeConfig.locales, which VitePress ignores).
// English sits at the repo root, Chinese under docs/zh/.
export default defineConfig({
  lang: 'en-US',
  title: 'Hello Lua',
  description: 'Lua notes from a game developer: how I use it in projects, the traps I hit, and what I noticed reading the language implementation.',
  base: '/hello-lua/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://cuihairu.github.io',
    // vitepress 1.6.x never prepends `base` to sitemap urls, so the official
    // transformItems hook adds /hello-lua/ back on. With locales it also emits
    // hreflang alternates (item.links) built from the same baseless paths, so
    // those get prefixed too.
    transformItems: (items) => {
      const withBase = (url?: string) => (url ? `/hello-lua/${url}` : '/hello-lua/')
      return items.map((item) => ({
        ...item,
        url: withBase(item.url),
        links: item.links?.map((link) => ({ ...link, url: withBase(link.url) }))
      }))
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/hello-lua/favicon.svg' }]
  ],

  // SUMMARY.md is a maintenance note; the only navigation map is sidebar.json
  srcExclude: ['**/SUMMARY.md'],

  ignoreDeadLinks: false,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Hello Lua',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cuihairu/hello-lua' }
    ]
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',

      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Basics', link: '/basics/README' },
          { text: 'Advanced', link: '/advanced/README' },
          { text: 'Design & Implementation', link: '/design-and-implementation/README' },
          { text: 'Extensions & Applications', link: '/lua-extensions-applications/README' },
          { text: 'Best Practices', link: '/lua-best-practices/README' },
          { text: 'Appendix', link: '/appendix/README' },
          { text: 'Knowledge', link: '/knowledge/README' }
        ],

        // 7 topic tracks of the site; maintenance rules in docs/SUMMARY.md
        sidebar: sidebarEn as never,

        outline: {
          label: 'On this page',
          level: [2, 3]
        },

        footer: {
          message: 'Hello Lua',
          copyright: '© 2024-2026 cuihairu'
        },

        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear query',
                footer: { selectText: 'Select', navigateText: 'Navigate', closeText: 'Close' }
              }
            }
          }
        },

        docFooter: { prev: 'Previous', next: 'Next' },

        editLink: {
          pattern: 'https://github.com/cuihairu/hello-lua/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },

        lastUpdated: { text: 'Last updated' },

        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode'
      }
    },

    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',

      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '基础', link: '/zh/basics/README' },
          { text: '进阶', link: '/zh/advanced/README' },
          { text: '设计与实现', link: '/zh/design-and-implementation/README' },
          { text: '扩展与应用', link: '/zh/lua-extensions-applications/README' },
          { text: '最佳实践', link: '/zh/lua-best-practices/README' },
          { text: '附录', link: '/zh/appendix/README' },
          { text: '知识点', link: '/zh/knowledge/README' }
        ],

        sidebar: sidebarZh as never,

        outline: {
          label: '页面导航',
          level: [2, 3]
        },

        footer: {
          message: 'Hello Lua',
          copyright: '© 2024-2026 cuihairu'
        },

        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有找到结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        },

        docFooter: { prev: '上一篇', next: '下一篇' },

        editLink: {
          pattern: 'https://github.com/cuihairu/hello-lua/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页'
        },

        lastUpdated: { text: '最后更新' },

        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      }
    }
  },

  markdown: {
    lineNumbers: false
  }
})
