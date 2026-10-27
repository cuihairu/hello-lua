# Error Types and Debugging

Lua errors fall into roughly four kinds: syntax errors, runtime errors, logic errors, and type errors. This page first looks at their causes and examples, then at the built-in and third-party debugging tools.

## 1. Error Types

1. Syntax errors: missing keywords, mismatched parentheses, and the like all belong to this category. These are caught at load time by `luac -p` or the interpreter, so the code never gets to run at all. For example:
     ```lua
     local x = 10
     -- The call below is missing a closing parenthesis, which causes a syntax error and fails the syntax check:
     -- print(x
     ```

2. Runtime errors: errors that only surface while the program runs, such as integer division by zero, or indexing and arithmetic operations on a `nil` value. For example:
     ```lua
     local x = 10 // 0  -- integer division by zero causes a runtime error (10 / 0 returns inf and does not raise an error)
     ```

3. Logic errors: the code runs but does not behave as expected, and is usually hard to spot directly from an error message. For example:
     ```lua
     local function is_even(n)
         return n % 2 == 1  -- the logic is backwards; checking for even should be n % 2 == 0
     end
     print(is_even(4))  -- false, but 4 is even, so the expected result should be true
     ```

4. Type errors: the type of an argument passed to a function or operator is wrong. For example:
     ```lua
     local function add(a, b)
         return a + b
     end
     print(add("Hello", 5))  -- adding a string and a number
     ```

## 2. Debugging Tools

Lua provides some built-in debugging tools and libraries to help developers trace and fix problems in their code.

1. The `debug` library: provides access to and control over the internal state of a Lua program. Two commonly used functions:

     - `debug.traceback([message[, level]])`: gets trace information for the call stack.
       ```lua
       local function foo()
           error("Something went wrong")
       end

       local function bar()
           foo()
       end

       local status, err = pcall(bar)
       if not status then
           print(debug.traceback(err))
       end
       ```
     - `debug.getinfo([thread,] function[, what])`: gets information about a function, such as its name and source location.
       ```lua
       local info = debug.getinfo(1, "S")
       print(info.source)  -- something like "@demo.lua" (a leading @ means the code comes from a script file)
       ```

2. `pcall` and `xpcall`: call a function safely and catch errors.
     ```lua
     local function riskyFunction()
         error("division by zero")
     end

     local status, result = pcall(riskyFunction)
     if not status then
         print("Caught an error: " .. result)
     end
     ```

3. `assert`: enforces a condition check and raises an error when the condition is not met.
     ```lua
     local function divide(a, b)
         assert(b ~= 0, "Division by zero")
         return a / b
     end

     print(divide(10, 0))  -- raises an error
     ```

4. `print`: the most basic debugging means — print variable values and program state.
     ```lua
     local x = 10
     print("Value of x: ", x)
     ```

5. Third-party debugging tools: LuaDebug and ZeroBrane Studio add debugging capability beyond the built-in tools.
   - ZeroBrane Studio: an integrated development environment (IDE) with fairly complete debugging features.
   - LuaDebug: offers more debugging features and a graphical interface.

## 3. Debugging Practice for Errors

1. Use assertions: add `assert` statements in your code to ensure arguments and state match what you expect.
     ```lua
     local function safeDivision(a, b)
         assert(type(a) == "number" and type(b) == "number", "Arguments must be numbers")
         assert(b ~= 0, "Division by zero")
         return a / b
     end
     ```

2. Trace errors: use `debug.traceback` to capture and record error information so you can track down the location where it happened.
     ```lua
     local function foo()
         error("Something went wrong")
     end

     local function bar()
         foo()
     end

     local status, err = pcall(bar)
     if not status then
         print(debug.traceback(err))
     end
     ```

3. Step-by-step debugging: use an IDE or debugging tool to execute code one step at a time, inspecting state and variable values at each step.

4. Logging: record logs at critical points to trace the program's execution path and state.

5. Error-handling strategy: wrap calls that might fail with `pcall` and `xpcall`, and keep exceptional situations inside your own handling logic.

Syntax errors are caught at load time; runtime errors come with a location and a cause; logic errors raise no error at all and can only be found through assertions, logging, and step-by-step debugging.

## References

- [Lua 5.4 reference manual · 2.4 Statements](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Exception_handling](https://en.wikipedia.org/wiki/Exception_handling)
- [Recursion_(computer_science)](https://en.wikipedia.org/wiki/Recursion_(computer_science))

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [error-handling](error-handling.md)
- [glossary](/glossary.md)
- [core-concepts](/knowledge/core-concepts.md)