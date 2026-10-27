# Error handling mechanisms

Lua's runtime errors are caught by `pcall` and `xpcall`. These two functions turn "something went wrong" from a program crash into a call with return values. This page covers how they are used and how they differ.

## 1. `pcall` (Protected Call)

`pcall` is used to call a function that might raise an error safely. Any error that occurs while the function runs is caught, and the program keeps going.

Usage:

  ```lua
  local status, result = pcall(function()
      -- code that may raise an error
      error("division by zero")
  end)
  
  if status then
      print("Function executed successfully")
  else
      print("Error: " .. result)
  end
  ```

Arguments: the first is the function to execute; the remaining arguments are passed to it unchanged.

There are two return values: `status` is `true` when execution succeeds and `false` when an error occurred; `result` is the function's return value on success and the error message on failure.

## 2. `xpcall` (Extended Protected Call)

`xpcall` is an extended version of `pcall` that takes one extra argument: a custom error handler, which is called first when an error occurs.

Usage:

  ```lua
  local function errorHandler(err)
      return "Caught an error: " .. err
  end

  local status, result = xpcall(function()
      -- code that may raise an error
      error("division by zero", 0)  -- a second argument of 0 means do not prepend the error location
  end, errorHandler)
  
  print(result)  -- output "Caught an error: division by zero"
  ```

Arguments: the first is the function to execute, the second is the error handler.

The return values are the same two, with the difference being `result`: on failure it is the information processed by the error handler.

## 3. The error-handling flow

The basic error-handling flow: first wrap a potentially failing call in `pcall` or `xpcall`, then check the returned `status` to see whether it succeeded, and on failure retrieve the error message through `result` or a custom error handler.

## 4. Error messages

Lua error messages typically include the error type and a description. You can raise an error deliberately with the `error` function:

  ```lua
  error("An unexpected error occurred")
  ```

It takes an error message string, raises the error and stops execution of the current function, propagating the message up the call stack.

## 5. Custom error handling

The error handler is where the post-processing happens: log it, reformat the message, then return the final information for the caller to see.

  ```lua
  local function customErrorHandler(err)
      -- record an error log
      print("Custom error log: " .. err)
      -- return a custom error message
      return "Custom Error: " .. err
  end

  local status, result = xpcall(function()
      -- code that may raise an error
      error("division by zero", 0)
  end, customErrorHandler)
  
  print(result)  -- output "Custom Error: division by zero"
  ```

## 6. Debugging tools

`debug.traceback` returns tracing information for the current call stack, which lets you pinpoint the exact call chain when an error occurs:

  ```lua
  local function riskyFunction()
      error("An error occurred")
  end

  local status, result = pcall(riskyFunction)
  if not status then
      print(debug.traceback(result))
  end
  ```

## Summary

The division of labor between the two functions is clear: `pcall` only reports the error, while `xpcall` gives you one extra chance to process the information at the error site. The basics of Lua exception handling are these two functions, plus `error` for raising errors yourself.

## References

- [Lua 5.4 reference manual · 2.4 Basic Functions](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Exception_handling](https://en.wikipedia.org/wiki/Exception_handling)
- [Continuation](https://en.wikipedia.org/wiki/Continuation)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](README.md)
- [error-handling](error-handling.md)
- [core-concepts](/knowledge/core-concepts.md)
- [pitfalls](/knowledge/pitfalls.md)
