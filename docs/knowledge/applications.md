# Application Scenarios

This index combines domain, embedded, and C interop cases from [Lua applications](/basics/applications) and [Lua extensions and applications](/lua-extensions-applications/README). Each item includes a project or usage clue and links back to the source page.

## Game development

- Game scripting: Unity3D, Cocos2d-x, CryEngine, and other engines support Lua as a scripting language for game logic, event handling, and AI behavior. Logic can change while the game runs without recompiling the whole game.
- Game extensions and plugins: players use Lua to create custom content, including character behavior, level design, and game rules.
- Named examples: World of Warcraft, Angry Birds, and Dark Souls use Lua scripts.

Sources: [Lua applications](/basics/applications), [Lua history and development](/basics/history-and-development).

## Embedded systems

- Resource-constrained devices: Lua has low memory and runtime overhead, making it useful for device control, configuration management, and interface handling.
- Home appliances and consumer electronics: smart TVs, set-top boxes, and routers embed Lua as a scripting engine for controllable features and flexible extension. This site does not name specific products for these items.
- Cross-compilation: Lua’s Makefile does not have a `CROSS` variable. Use `CC` to specify the toolchain, for example `make generic CC=arm-none-eabi-gcc`.

Sources: [Lua applications](/basics/applications), [Embedded development](/lua-extensions-applications/embedded-development).

## Web development

- OpenResty with Nginx handles concurrent requests and dynamic content generation; HTTP processing, database interaction, and business logic can all run in Lua.
- API gateways: request routing, load balancing, and security checks can be implemented with Lua scripts.
- Asynchronous I/O: OpenResty/ngx_lua models network I/O as nonblocking operations plus coroutine suspension. A coroutine yields after sending a request and resumes when data arrives, so the user-facing code still reads sequentially.

Sources: [Lua applications](/basics/applications), [Coroutines versus threads](/advanced/coroutines-vs-threads).

## Configuration management

- Dynamic configuration files: Lua configuration can include logic and conditionals, making it more flexible than static JSON or YAML configuration. Neovim manages configuration with Lua.
- Software-defined networking (SDN): use Lua to configure device behavior and policies dynamically at run time.

Sources: [Lua applications](/basics/applications).

## Data analysis

- Embedded data processing: process sensor data and perform edge computing on IoT devices.
- Data cleaning and transformation: use tables to write transformation scripts for structured or semi-structured data.

Sources: [Lua applications](/basics/applications).

## Testing and automation

- Automated testing: UI tests and API test scripts.
- CI/CD: use Lua for build, deployment, and release scripts, and for code quality checks and tests.

Sources: [Lua applications](/basics/applications).

## Artificial intelligence

- Torch: an early deep learning framework used Lua as its interface. It was later superseded by tools such as PyTorch. This is a historical use, not the current mainstream direction.
- Embedded AI inference: on hardware with limited resources, use Lua for basic machine learning algorithms or model inference.

Sources: [Lua applications](/basics/applications).

## C extensions and embedding

- Embed Lua in a C program: `luaL_newstate` creates the state, `luaL_openlibs` opens the standard library, and `luaL_dofile` runs a script.
- Write C extensions: the `luaopen_mylib` entry point creates and returns the module table; Lua loads it with `require("mylib")`.
- LuaJIT FFI: avoid writing a C extension by declaring C functions with `ffi.cdef`, loading them with `ffi.load`, then calling them.
- Implement performance-critical parts in C and noncritical parts in Lua.

Sources: [Lua extensions and applications](/lua-extensions-applications/README), [Writing Lua C extensions](/lua-extensions-applications/writing-c-extensions), [LuaJIT FFI library](/lua-extensions-applications/ffi-library).

## Related angle

This is a cross-cutting index with project examples and sources. Background for each area is recorded in [Lua applications](/basics/applications).

## References

- [Lua_(programming_language)](https://en.wikipedia.org/wiki/Lua_(programming_language))
- [lua-users wiki](http://lua-users.org/wiki/)
