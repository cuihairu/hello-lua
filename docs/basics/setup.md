# 环境搭建

使用 Lua 之前，先把环境搭起来：装好解释器、配一个顺手的编辑器或 IDE，再装上包管理器 LuaRocks。安装与编辑器的细节各有专页，本页给路线，LuaRocks 部分单独展开。

## 1. 安装 Lua

按 Windows、macOS、Linux 三个平台分别装：Windows 用官方源码包或 [LuaBinaries](https://luabinaries.sourceforge.net/) 预编译包，macOS 走 Homebrew，Linux 用发行版包管理器（`apt-get`、`dnf`、`pacman`）。包管理器最省事，要指定版本或特殊配置再走源码安装。装完用 `lua -v` 验证。完整步骤见 [安装Lua](/basics/install)。

## 2. 集成开发环境（IDE）和编辑器

Lua 用任何文本编辑器都能写，配一个支持补全和调试的编辑器会省事得多。常用的有 VSCode（装 Lua Plus 或 EmmyLua 插件）、ZeroBrane Studio（专为 Lua 的 IDE，开箱即用）、IntelliJ IDEA / PyCharm（EmmyLua 插件）、Sublime Text、Notepad++。对比与安装见 [集成开发环境（IDE）推荐](/basics/ide-recommendations)。

## 3. LuaRocks：Lua 的包管理器

### 3.1 安装 LuaRocks

LuaRocks 是 Lua 的包管理器，用来给项目安装和管理第三方库。三个平台的装法略有不同：

- Windows：可以从 [LuaRocks 官网](https://luarocks.org/) 下载适用于 Windows 的安装包，或在安装 LuaBinaries 时一并安装。
- macOS 和 Linux：用 Homebrew 或包管理器安装：
    ```bash
    brew install luarocks
    ```
    或者通过源码安装（版本号以 [LuaRocks 官网](https://luarocks.org/) 当前发布为准）：
    ```bash
    wget https://luarocks.org/releases/luarocks-3.13.0.tar.gz
    tar zxpf luarocks-3.13.0.tar.gz
    cd luarocks-3.13.0
    ./configure; sudo make bootstrap
    ```

### 3.2 使用 LuaRocks 安装包

安装完成后，可以使用 LuaRocks 来安装和管理 Lua 的第三方库。例如，安装 `luasocket` 库：
```bash
luarocks install luasocket
```

## 结语

环境搭好后，先用 `lua` 进交互模式试几段代码，再用 LuaRocks 装一两个库，就可以进入 [基本语法](/basics/syntax) 的学习了。
