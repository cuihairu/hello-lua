# Error handling

Lua's error handling centers on `pcall`, `xpcall`, and `error`: first wrap the call that might fail, then categorize and track down the error. This group has two pages:

- [Error handling mechanism](/advanced/error-handling-mechanism): how to use `pcall` and `xpcall` and the difference between them, raising errors with `error`, custom error handler functions.
- [Error types and debugging](/advanced/error-types-debugging): the four kinds of errors — syntax, runtime, logic, type — plus the `debug` library and common debugging techniques.

## Wrap-up

`pcall` turns an error into a call with a return value; `xpcall` gives you one more chance to massage the information at the point of failure. Tell the error types apart, then follow the thread with `debug.traceback` — troubleshooting comes down to these few tools.

## References

- [Lua 5.4 reference manual · 2.4 Calling conventions](https://www.lua.org/manual/5.4/manual.html#2.4)
- [Lua 5.4 reference manual · 2.5 Error handling](https://www.lua.org/manual/5.4/manual.html#2.5)
- [Exception_handling](https://en.wikipedia.org/wiki/Exception_handling)
- [Stack_trace](https://en.wikipedia.org/wiki/Stack_trace)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [README](/knowledge/README.md)
- [core-concepts](/knowledge/core-concepts.md)
