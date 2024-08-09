# 环境搭建

在开始学习和使用 Lua 之前，首先需要在你的开发环境中安装和配置 Lua 解释器。无论你是在 Windows、macOS 还是 Linux 平台上开发，都可以通过简单的步骤来完成 Lua 的环境搭建。本节将详细介绍如何在不同操作系统上安装 Lua，并介绍一些常用的 Lua 开发工具和集成开发环境（IDE）。

## 1. 安装 Lua

### 1.1 在 Windows 上安装 Lua

1. 下载 Lua 官方提供的 Windows 版本：
    - 访问 Lua 的官方网站 [lua.org](https://www.lua.org/)，下载最新版本的 Lua 源码压缩包。
    - 如果不想自行编译源码，可以从第三方网站下载预编译的 Lua 安装包，例如 [LuaBinaries](https://luabinaries.sourceforge.net/) 提供了各种版本的 Windows 可执行文件。

2. 解压并配置环境变量：
    - 将下载的压缩包解压到你希望安装的位置。
    - 打开系统的环境变量设置，将 Lua 的 `bin` 目录添加到 `PATH` 环境变量中。

3. 验证安装：
    - 打开命令提示符（cmd），输入 `lua -v` 或 `lua`，如果出现 Lua 解释器的版本信息或 Lua 提示符，说明安装成功。

### 1.2 在 macOS 上安装 Lua

1. 使用 Homebrew 安装：
    - macOS 用户可以使用 Homebrew 进行安装。首先确保你已经安装了 Homebrew，然后在终端中输入以下命令：
      ```bash
      brew install lua
      ```

2. 验证安装：
    - 安装完成后，可以在终端输入 `lua -v` 或 `lua`，如果出现 Lua 解释器的版本信息或 Lua 提示符，说明安装成功。

### 1.3 在 Linux 上安装 Lua

1. 使用包管理器安装：
    - 大多数 Linux 发行版的包管理器都包含 Lua，使用以下命令可以安装 Lua：
      - 在 Debian/Ubuntu 系统上：
        ```bash
        sudo apt-get install lua5.3
        ```
      - 在 Fedora 系统上：
        ```bash
        sudo dnf install lua
        ```
      - 在 Arch Linux 系统上：
        ```bash
        sudo pacman -S lua
        ```

2. 验证安装：
    - 安装完成后，可以在终端输入 `lua -v` 或 `lua`，如果出现 Lua 解释器的版本信息或 Lua 提示符，说明安装成功。

## 2. 集成开发环境（IDE）和编辑器

虽然 Lua 的开发可以在任何文本编辑器中完成，但使用合适的集成开发环境（IDE）或代码编辑器可以大大提升开发效率。以下是一些常用的支持 Lua 开发的 IDE 和编辑器：

### 2.1 Visual Studio Code

- **插件支持**：Visual Studio Code（VSCode）是一个流行的代码编辑器，支持多种编程语言。通过安装插件（如 Lua Plus 或 EmmyLua），你可以获得语法高亮、自动补全、代码格式化和调试支持。
- **安装插件**：
    1. 打开 VSCode，在扩展（Extensions）中搜索 `Lua` 或 `EmmyLua` 并安装。
    2. 安装完成后，重新启动 VSCode，插件就会自动激活。

### 2.2 IntelliJ IDEA / PyCharm

- **插件支持**：IntelliJ IDEA 和 PyCharm 等 JetBrains 系列的 IDE 也支持 Lua 开发。你可以通过安装 `EmmyLua` 插件来启用 Lua 的开发支持。
- **安装插件**：
    1. 打开 IDE，进入 `File > Settings > Plugins`。
    2. 搜索 `EmmyLua`，点击安装，安装完成后重启 IDE。

### 2.3 Sublime Text

- **轻量编辑器**：Sublime Text 是一款轻量级但功能强大的编辑器，支持多语言开发。通过安装 Lua 插件，你可以获得语法高亮和基础的代码补全功能。
- **安装插件**：
    1. 打开 Sublime Text，进入 `Package Control > Install Package`。
    2. 搜索并安装 `Lua` 或 `LuaDev` 插件。

### 2.4 ZeroBrane Studio

- **专用 Lua IDE**：ZeroBrane Studio 是一款专为 Lua 开发设计的 IDE，内置了 Lua 的调试、语法高亮和自动补全功能。它是轻量级且开箱即用的解决方案，非常适合初学者使用。
- **安装**：
    1. 访问 [ZeroBrane Studio](https://studio.zerobrane.com/) 官方网站，下载并安装适合你操作系统的版本。

## 3. LuaRocks：Lua 的包管理器

### 3.1 安装 LuaRocks

LuaRocks 是 Lua 的包管理器，可以轻松地为你的 Lua 项目安装和管理第三方库。在 Windows、macOS 和 Linux 上安装 LuaRocks 的方式略有不同：

- **Windows**：可以从 [LuaRocks 官网](https://luarocks.org/) 下载适用于 Windows 的安装包，或在安装 LuaBinaries 时一并安装。
- **macOS** 和 **Linux**：可以使用 Homebrew 或包管理器安装：
    ```bash
    brew install luarocks
    ```
    或者通过源码安装：
    ```bash
    wget https://luarocks.org/releases/luarocks-x.x.x.tar.gz
    tar zxpf luarocks-x.x.x.tar.gz
    cd luarocks-x.x.x
    ./configure; sudo make bootstrap
    ```

### 3.2 使用 LuaRocks 安装包

安装完成后，可以使用 LuaRocks 来安装和管理 Lua 的第三方库。例如，安装 `luasocket` 库：
```bash
luarocks install luasocket
