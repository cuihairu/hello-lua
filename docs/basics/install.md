# Installing Lua

Installing Lua means installing an interpreter. The process differs by operating system, but none of them are complicated; the steps are listed per system below.

## 1. Installing Lua on Windows

### 1.1 Download Lua

1. Visit the [official Lua website](https://www.lua.org/download.html) to get the latest Lua source archive.
2. On Windows the prebuilt package is the better choice. You can download the Lua executables and libraries for Windows from [LuaBinaries](https://luabinaries.sourceforge.net/).

### 1.2 Install Lua

1. If you downloaded the prebuilt package, extract it to where you want Lua installed, for example `C:\Lua`.
2. Add Lua's `bin` directory (for example `C:\Lua\bin`) to the system `PATH` environment variable:
    - Right-click `This PC` or `Computer` on the desktop and choose `Properties`.
    - Click `Advanced system settings`, then `Environment Variables`.
    - Under `System variables`, find `Path` and click `Edit`.
    - Append the path of Lua's `bin` directory to the end of the `Variable value` field, keeping the entries separated by semicolons (for example `C:\Lua\bin`).

### 1.3 Verify the installation

1. Open a command prompt (cmd).
2. Type `lua -v` or `lua`. If the interpreter is installed correctly you will see the Lua version, or the Lua prompt.

## 2. Installing Lua on macOS

### 2.1 Install with Homebrew

1. If you do not have Homebrew yet, visit [brew.sh](https://brew.sh/) and follow the instructions to install it.
2. Open a terminal and install Lua with:
    ```bash
    brew install lua
    ```

### 2.2 Verify the installation

1. Once installed, type `lua -v` or `lua` in the terminal.
2. If everything went well, the Lua version or prompt appears.

## 3. Installing Lua on Linux

### 3.1 Install with the package manager

Different distributions use different package managers; the three common ones:

- Debian/Ubuntu, with `apt`:
    ```bash
    sudo apt-get update
    sudo apt-get install lua5.4
    ```

- Fedora, with `dnf`:
    ```bash
    sudo dnf install lua
    ```

- Arch Linux, with `pacman`:
    ```bash
    sudo pacman -S lua
    ```

### 3.2 Verify the installation

1. Once installed, open a terminal and type `lua -v` or `lua`.
2. If everything went well, the Lua version or prompt appears.

## 4. Installing Lua from source

When you need to build a specific version or adjust the build configuration, install from source:

### 4.1 Download the source

1. Visit the [official Lua download page](https://www.lua.org/download.html) and get the latest source archive.

### 4.2 Build and install

1. Extract the archive:
    ```bash
    tar zxpf lua-5.5.1.tar.gz
    cd lua-5.5.1
    ```

2. Build Lua:
    ```bash
    make linux
    ```

    - Replace `linux` with the name matching your target platform, for example `macosx`.

3. Install Lua (needs administrator rights):
    ```bash
    sudo make install
    ```

### 4.3 Verify the installation

1. Type `lua -v` or `lua`; if everything went well, the Lua version or prompt appears.

## Wrap-up

Of the three ways to install, the package manager is the least trouble; go from source only when you need a specific version or a special configuration. If `lua -v` prints a version number, the install is good.

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua download page](https://www.lua.org/download.html)
- [LuaRocks package manager](https://luarocks.org/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [setup](setup.md)
