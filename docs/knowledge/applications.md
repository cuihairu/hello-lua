# 应用场景

站内 [Lua的应用场景](/basics/applications) 按九个领域列了用法，[Lua的扩展与应用](/lua-extensions-applications/README) 补充了嵌入式与 C 互操作。这里合并成条目，每条给实际项目名或用法，再回链原页。

## 游戏开发

- 游戏脚本：Unity3D、Cocos2d-x、CryEngine 等引擎支持 Lua 作脚本，控制游戏逻辑、事件处理、AI 行为；逻辑可边跑边改，不必重编整个游戏。
- 游戏扩展与插件：玩家用 Lua 写自定义内容，角色行为、关卡设计、游戏规则都能由玩家扩展。
- 有名字的案例：《World of Warcraft》《Angry Birds》《Dark Souls》用 Lua 写脚本。

来源：[Lua的应用场景](/basics/applications)、[Lua的历史和发展](/basics/history-and-development)。

## 嵌入式系统

- 资源受限设备：Lua 内存与运行时开销小，承担设备控制、配置管理、界面处理。
- 家电与消费电子：智能电视、机顶盒、路由器内嵌 Lua 作脚本引擎，可控制功能、灵活扩展。这几项站内未给出具体产品名。
- 交叉编译：Lua 的 Makefile 没有 `CROSS` 变量，用 `CC` 指定工具链即可，例如 `make generic CC=arm-none-eabi-gcc`。

来源：[Lua的应用场景](/basics/applications)、[嵌入式开发](/lua-extensions-applications/embedded-development)。

## Web 开发

- OpenResty 结合 Nginx 处理并发请求与动态内容生成，HTTP 处理、数据库交互、业务逻辑都在 Lua 里完成。
- API 网关：请求路由、负载均衡、安全检查用 Lua 脚本实现。
- 异步 I/O：OpenResty/ngx_lua 把网络 I/O 做成「非阻塞 + 协程挂起」，请求发出后协程让出，数据到达再恢复，使用者视角仍是顺序代码。

来源：[Lua的应用场景](/basics/applications)、[协程与线程的比较](/advanced/coroutines-vs-threads)。

## 配置管理

- 动态配置文件：Lua 配置可含逻辑运算与条件判断，比 JSON、YAML 这类静态配置灵活；Neovim 用 Lua 管理配置。
- 软件定义网络（SDN）：用 Lua 动态配置网络设备的行为和策略，运行时调整。

来源：[Lua的应用场景](/basics/applications)。

## 数据分析

- 嵌入式数据处理：在 IoT 设备里处理传感器数据、做边缘计算。
- 数据清洗与转换：借表的处理能力写转换脚本，处理结构化或半结构化数据。

来源：[Lua的应用场景](/basics/applications)。

## 测试与自动化

- 自动化测试：UI 测试、API 测试脚本。
- CI/CD：用 Lua 写构建、部署、发布的脚本，执行代码质量检查与测试。

来源：[Lua的应用场景](/basics/applications)。

## 人工智能

- Torch：深度学习早期的主力框架以 Lua 为接口，后来被 PyTorch 等取代。这是历史用法，不是当前主流方向。
- 嵌入式 AI 推理：硬件资源有限时，用 Lua 做基本的机器学习算法或模型推理。

来源：[Lua的应用场景](/basics/applications)。

## C 扩展与嵌入

- 在 C 程序里嵌入 Lua：`luaL_newstate` 创建状态、`luaL_openlibs` 打开标准库、`luaL_dofile` 执行脚本。
- 写 C 扩展：`luaopen_mylib` 入口创建模块表并返回，Lua 侧 `require("mylib")` 加载。
- LuaJIT FFI：不写 C 扩展，直接用 `ffi.cdef` 声明、`ffi.load` 加载后调用 C 函数。
- 性能关键的部分用 C 实现，非关键部分用 Lua。

来源：[Lua的扩展与应用](/lua-extensions-applications/README)、[编写Lua C扩展](/lua-extensions-applications/writing-c-extensions)、[使用 LuaJIT 的 FFI 库](/lua-extensions-applications/ffi-library)。
