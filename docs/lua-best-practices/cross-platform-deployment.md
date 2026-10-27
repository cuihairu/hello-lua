# Cross-Platform Deployment of Lua Applications

Deploying a Lua application to Windows, Linux, macOS, iOS, and Android means handling three things: platform differences, build and packaging, and testing on each platform.

## 1. Understand the Target Platforms

### 1.1. Supported operating systems

First pin down the operating systems to support (such as Windows, Linux, macOS, iOS, Android), then learn each one's features and limitations to decide where to adjust and optimize.

### 1.2. Build tools and environment

Pick build tools per platform; CMake, Autoconf, and Meson are all common. Install each platform's development environment and dependencies.

## 2. Use Cross-Platform Tools

### 2.1. Lua's cross-platform support

Lua itself is cross-platform, but the interpreter and extension libraries must actually run on the target platforms. Check each library and module used for platform support; find compatible replacements where none exist.

### 2.2. Cross-platform development frameworks

Game-like applications can build on existing frameworks: Love2D supports Windows, macOS, Linux, and more; Corona SDK targets mobile devices (iOS and Android).

## 3. Platform-Specific Adjustments

### 3.1. File paths and separators

Don't hardcode path separators. Use `package.config` to get the current platform's path separator, then build file paths.

### 3.2. System calls and dependencies

Avoid platform-specific system calls. Lua scripts have no conditional compilation, so platform checks can only happen at run time (for example, checking the first character of `package.config` to distinguish path separators; under LuaJIT use `jit.os`). Where compile-time platform distinction is truly needed, it lives in the C code compiled with Lua (`#if` conditional compilation) or in the build scripts.

Configure each platform's dependencies so the necessary libraries and modules are all found.

## 4. Build and Packaging

### 4.1. Build scripts

One build script per platform, automated by CMake, Makefile, or similar tools; handle each platform's compile options and dependency relationships in the scripts.

### 4.2. Packaging

Produce packages according to the target platform: `.zip`, `.tar.gz`, `.dmg`, `.exe` as needed. For platforms requiring an installer, build a separate installer to keep installation simple.

## 5. Testing

### 5.1. Test on different platforms

Test functionality and performance on every target platform; where no real device is available, use a virtual machine or container to simulate it.

### 5.2. Automated testing

Hook into CI/CD tools (Jenkins, GitLab CI, etc.) for cross-platform automated testing, running the full test suite on every build and release.

## 6. Release and Maintenance

### 6.1. Release channels

Put download links and installation instructions on the website; submit to app stores (Mac App Store, Google Play, Microsoft Store) per each store's publishing guidelines.

### 6.2. User support

Write complete user documentation: installation guide, FAQ, troubleshooting steps. Then open support channels (forums, mailing lists, online chat) to catch issues users hit on each platform.

### 6.3. Updates and fixes

Release updates based on user feedback and test results, fixing known issues and adding features. Long-term maintained versions must keep up with new operating systems.

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Type_system](https://en.wikipedia.org/wiki/Type_system)
- [Lua download page](https://www.lua.org/download.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [pitfalls](/knowledge/pitfalls.md)
