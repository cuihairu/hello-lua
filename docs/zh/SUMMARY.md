# 导航维护说明

站点导航的唯一权威源是 `docs/.vitepress/sidebar.json`。VitePress 配置从该文件加载侧边栏；维护目录时只编辑侧边栏，并按其中的链接维护页面。

本文件保留为 mdBook 遗留路径的说明入口，不再镜像目录，也不应手工添加页面映射。若未来恢复 mdBook 导出，应从侧边栏生成 SUMMARY，并在构建中校验生成结果；在此之前以 VitePress 侧边栏为准。
