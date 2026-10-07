# Lua的单元测试框架

下面是几个常用的 Lua 单元测试框架，外加一个不引框架的做法。

## 1. LuaUnit

LuaUnit 是轻量级的单元测试框架，类似 JUnit，支持断言、测试用例和测试套件，适合简单的测试需求。断言用标准的 `assertEquals`、`assertTrue`，能生成测试报告。安装用克隆 GitHub 仓库：

  ```bash
  git clone https://github.com/bluebird75/luaunit.git
  ```

- 示例代码：

  ```lua
  -- test_addition.lua
  local luaunit = require('luaunit')

  -- 被测试的函数
  function add(a, b)
      return a + b
  end

  -- 测试用例
  TestAddition = {}

  function TestAddition:testAddPositiveNumbers()
      luaunit.assertEquals(add(2, 3), 5)
  end

  function TestAddition:testAddNegativeNumbers()
      luaunit.assertEquals(add(-1, -1), -2)
  end

  -- 运行测试
  os.exit(luaunit.LuaUnit.run())
  ```

## 2. Busted

Busted 支持 BDD（行为驱动开发）风格的测试，断言齐全，还能打测试标签、按标签过滤，适合复杂一点的测试需求，也能生成测试报告。LuaRocks 安装：

  ```bash
  luarocks install busted
  ```

- 示例代码：

  ```lua
  -- test_addition_spec.lua
  local add = require('add') -- 假设你的 add 函数在 add.lua 文件中

  describe("Addition", function()
      it("should add positive numbers correctly", function()
          assert.equal(add(2, 3), 5)
      end)

      it("should add negative numbers correctly", function()
          assert.equal(add(-1, -1), -2)
      end)
  end)
  ```

  运行测试：

  ```bash
  busted test_addition_spec.lua
  ```

## 3. 不引入框架的最简做法

如果项目很小，不想引入第三方库，用 `assert` 加一个简单的统计循环就能写出可运行的测试。零依赖，任何 Lua 环境都能跑；用 `pcall` 统计失败用例并给出退出码。

- 示例代码：

  ```lua
  -- test_addition.lua
  local failures = 0

  -- 被测试的函数
  local function add(a, b)
      return a + b
  end

  -- 一个极简的测试器：记录失败的用例
  local function test(name, fn)
      local ok, err = pcall(fn)
      if ok then
          print("[PASS] " .. name)
      else
          failures = failures + 1
          print("[FAIL] " .. name .. " -- " .. tostring(err))
      end
  end

  -- 测试用例
  test("正数相加", function()
      assert(add(2, 3) == 5)
  end)

  test("负数相加", function()
      assert(add(-1, -1) == -2)
  end)

  -- 运行并按失败数决定退出码
  os.exit(failures)
  ```

  运行方式与普通脚本相同：

  ```bash
  lua test_addition.lua
  ```

## 4. Lunatest

Lunatest 是 xUnit 风格的 Lua 单元测试框架，额外支持随机化测试（类似 QuickCheck）。它与 lunit 兼容，测试函数用全局的 `test_*` 命名即可被发现；断言函数（`lunatest.assert_equal`、`lunatest.assert_true` 等）挂在 `lunatest` 模块上，不写入全局环境。零额外依赖，可选装 lrandom、luasocket 增强随机数与计时。从 GitHub 获取：

  ```bash
  git clone https://github.com/silentbicycle/lunatest.git
  ```

- 示例代码：

  ```lua
  -- test_addition.lua
  local lunatest = require("lunatest")

  -- 被测试的函数
  local function add(a, b)
      return a + b
  end

  -- 测试用例：全局函数，名字以 test_ 开头
  function test_add_positive_numbers()
      lunatest.assert_equal(add(2, 3), 5)
  end

  function test_add_negative_numbers()
      lunatest.assert_equal(add(-1, -1), -2)
  end

  -- 运行测试
  lunatest.run()
  ```

  运行测试：

  ```bash
  lua test_addition.lua -v
  ```

## 总结

选型看场景：多数项目用 LuaUnit 或 Busted 就够；想要 xUnit 风格或随机化测试，选 Lunatest；依赖受限或脚本很小，直接用 `assert` 加统计循环最省事。
