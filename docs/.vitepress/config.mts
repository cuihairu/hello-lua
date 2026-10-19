import { defineConfig } from 'vitepress'
import sidebar from './sidebar.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'Hello Lua',
  description: 'Lua 知识手册——基础语法、进阶编程、设计与实现、扩展应用与最佳实践',
  base: '/hello-lua/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://cuihairu.github.io',
    // vitepress 1.6.x 生成 sitemap 不拼 base，用官方 transformItems 钩子补上 /hello-lua/
    transformItems: (items) =>
      items.map((item) => ({
        ...item,
        url: item.url ? `/hello-lua/${item.url}` : '/hello-lua/'
      }))
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/hello-lua/favicon.svg' }]
  ],

  // SUMMARY.md 是维护说明页；唯一导航映射由 sidebar.json 提供
  srcExclude: ['**/SUMMARY.md'],

  ignoreDeadLinks: false,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Hello Lua',

    nav: [
      { text: '首页', link: '/' },
      { text: '基础', link: '/basics/README' },
      { text: '进阶', link: '/advanced/README' },
      { text: '设计与实现', link: '/design-and-implementation/README' },
      { text: '扩展与应用', link: '/lua-extensions-applications/README' },
      { text: '最佳实践', link: '/lua-best-practices/README' },
      { text: '附录', link: '/appendix/README' },
      { text: '知识点', link: '/knowledge/README' }
    ],

    // 7 个主题轴的站点导航；维护规则见 docs/SUMMARY.md
    sidebar: sidebar as never,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cuihairu/hello-lua' }
    ],

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

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    editLink: {
      pattern: 'https://github.com/cuihairu/hello-lua/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  markdown: {
    lineNumbers: false
  }
})
