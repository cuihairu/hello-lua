# Lua Unit Testing Frameworks

Below are several commonly used Lua unit testing frameworks, plus one approach that avoids frameworks altogether.

## 1. LuaUnit

LuaUnit is a lightweight unit testing framework, similar to JUnit, supporting assertions, test cases, and test suites—suited to simple testing needs. Assertions use the standard `assertEquals`, `assertTrue`, and it can generate test reports. Install by cloning the GitHub repository:

  ```bash
  git clone https://github.com/bluebird75/luaunit.git
  ```

- Example code:

  ```lua
  -- test_addition.lua
  local luaunit = require('luaunit')

  -- function under test
  function add(a, b)
      return a + b
  end

  -- test case
  TestAddition = {}

  function TestAddition:testAddPositiveNumbers()
      luaunit.assertEquals(add(2, 3), 5)
  end

  function TestAddition:testAddNegativeNumbers()
      luaunit.assertEquals(add(-1, -1), -2)
  end

  -- run the tests
  os.exit(luaunit.LuaUnit.run())
  ```

## 2. Busted

Busted supports BDD (behavior-driven development) style testing, with a full set of assertions, plus test tags and filtering by tag—suited to somewhat more complex needs, and it can generate test reports too. Install with LuaRocks:

  ```bash
  luarocks install busted
  ```

- Example code:

  ```lua
  -- test_addition_spec.lua
  local add = require('add') -- assumes your add function lives in add.lua

  describe("Addition", function()
      it("should add positive numbers correctly", function()
          assert.equal(add(2, 3), 5)
      end)

      it("should add negative numbers correctly", function()
          assert.equal(add(-1, -1), -2)
      end)
  end)
  ```

  Run the tests:

  ```bash
  busted test_addition_spec.lua
  ```

## 3. Framework-Free Minimal Approach

If the project is small and you don't want to pull in a third-party library, `assert` plus a simple counting loop makes a runnable test. Zero dependencies, runs in any Lua environment; use `pcall` to count failing cases and produce an exit code.

- Example code:

  ```lua
  -- test_addition.lua
  local failures = 0

  -- function under test
  local function add(a, b)
      return a + b
  end

  -- a minimal tester: records failing cases
  local function test(name, fn)
      local ok, err = pcall(fn)
      if ok then
          print("[PASS] " .. name)
      else
          failures = failures + 1
          print("[FAIL] " .. name .. " -- " .. tostring(err))
      end
  end

  -- test cases
  test("add positive numbers", function()
      assert(add(2, 3) == 5)
  end)

  test("add negative numbers", function()
      assert(add(-1, -1) == -2)
  end)

  -- run and pick the exit code from the failure count
  os.exit(failures)
  ```

  Run it like any normal script:

  ```bash
  lua test_addition.lua
  ```

## 4. Lunatest

Lunatest is an xUnit-style Lua unit testing framework with extra support for randomized testing (similar to QuickCheck). It is compatible with lunit; test functions are named with the global `test_*` prefix to be discovered. Assertion functions (`lunatest.assert_equal`, `lunatest.assert_true`, and so on) hang off the `lunatest` module, not written into the global environment. Zero extra dependencies; optionally install lrandom and luasocket for better randomization and timing. Get it from GitHub:

  ```bash
  git clone https://github.com/silentbicycle/lunatest.git
  ```

- Example code:

  ```lua
  -- test_addition.lua
  local lunatest = require("lunatest")

  -- function under test
  local function add(a, b)
      return a + b
  end

  -- test cases: global functions, names starting with test_
  function test_add_positive_numbers()
      lunatest.assert_equal(add(2, 3), 5)
  end

  function test_add_negative_numbers()
      lunatest.assert_equal(add(-1, -1), -2)
  end

  -- run the tests
  lunatest.run()
  ```

  Run the tests:

  ```bash
  lua test_addition.lua -v
  ```

## Summary

Choose by scenario: for most projects LuaUnit or Busted is enough; for xUnit style or randomized testing pick Lunatest; with tight dependency limits or tiny scripts, `assert` plus a counting loop is the simplest.

## References

- [Lua 5.4 official manual](https://www.lua.org/manual/5.4/manual.html#6.3)
- [lua-users wiki](http://lua-users.org/wiki/)

<!-- BACKLINKS-AUTO -->
## Related pages

- [testing-debugging](testing-debugging.md)
