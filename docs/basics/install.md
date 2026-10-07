# 安装Lua

安装 Lua 就是装一个解释器。过程因操作系统而异，但都不复杂，下面按系统给出步骤。

## 1. 在 Windows 上安装 Lua

### 1.1 下载 Lua

1. 访问 [Lua 官方网站](https://www.lua.org/download.html) 以下载最新版本的 Lua 源码压缩包。
2. 对于 Windows 用户，建议使用预编译的安装包。可以从 [LuaBinaries](https://luabinaries.sourceforge.net/) 下载适用于 Windows 的 Lua 可执行文件和相关库。

### 1.2 安装 Lua

1. 如果下载的是预编译的安装包，解压文件到你希望安装的位置，例如 `C:\Lua`。
2. 将 Lua 的 `bin` 目录（例如 `C:\Lua\bin`）添加到系统的 `PATH` 环境变量中：
    - 右键点击桌面上的 `此电脑` 或 `计算机`，选择 `属性`。
    - 点击 `高级系统设置`，然后点击 `环境变量`。
    - 在 `系统变量` 区域找到 `Path`，点击 `编辑`。
    - 在 `变量值` 的末尾添加 Lua 的 `bin` 目录路径，确保路径之间用分号分隔（例如 `C:\Lua\bin`）。

### 1.3 验证安装

1. 打开命令提示符（cmd）。
2. 输入 `lua -v` 或 `lua`，如果 Lua 解释器正确安装，你会看到 Lua 的版本信息或 Lua 提示符。

## 2. 在 macOS 上安装 Lua

### 2.1 使用 Homebrew 安装

1. 如果尚未安装 Homebrew，请先访问 [Homebrew 官网](https://brew.sh/) 并按照说明进行安装。
2. 打开终端并输入以下命令安装 Lua：
    ```bash
    brew install lua
    ```

### 2.2 验证安装

1. 安装完成后，在终端输入 `lua -v` 或 `lua`。
2. 如果 Lua 解释器正确安装，你将看到 Lua 的版本信息或 Lua 提示符。

## 3. 在 Linux 上安装 Lua

### 3.1 使用包管理器安装

不同的 Linux 发行版使用不同的包管理器，常见的三种：

- Debian/Ubuntu，用 `apt`：
    ```bash
    sudo apt-get update
    sudo apt-get install lua5.4
    ```

- Fedora，用 `dnf`：
    ```bash
    sudo dnf install lua
    ```

- Arch Linux，用 `pacman`：
    ```bash
    sudo pacman -S lua
    ```

### 3.2 验证安装

1. 安装完成后，打开终端并输入 `lua -v` 或 `lua`。
2. 如果 Lua 解释器正确安装，你将看到 Lua 的版本信息或 Lua 提示符。

## 4. 从源码安装 Lua

如果你需要编译 Lua 的最新版本或者在某些操作系统上使用特定的配置，可以选择从源码安装：

### 4.1 下载源码

1. 访问 [Lua 官方下载页面](https://www.lua.org/download.html) 下载最新的 Lua 源码压缩包。

### 4.2 编译与安装

1. 解压下载的压缩包：
    ```bash
    tar zxpf lua-5.5.1.tar.gz
    cd lua-5.5.1
    ```

2. 编译 Lua：
    ```bash
    make linux
    ```

    - 你可以根据需要替换 `linux` 为其他平台的目标，例如 `macosx`。

3. 安装 Lua（需要管理员权限）：
    ```bash
    sudo make install
    ```

### 4.3 验证安装

1. 输入 `lua -v` 或 `lua`，如果 Lua 解释器正确安装，你将看到 Lua 的版本信息或 Lua 提示符。

## 结语

三种装法里，包管理器最省事；要指定版本或特殊配置，再走源码安装。`lua -v` 能打出版本号就说明装好了。
