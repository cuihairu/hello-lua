# Using the Lua Interpreter

The Lua interpreter is a command-line tool: it runs scripts, tests code snippets, and lets you try things out interactively one line at a time.

## 1. Starting the interpreter

Type `lua` in a terminal or command prompt to start the interpreter. If the installation succeeded you will see the Lua prompt `>`, meaning it is ready to take commands.

```sh
$ lua
Lua 5.4.8  Copyright (C) 1994-2025 Lua.org, PUC-Rio
>
```

## 2. Interactive programming

The prompt accepts code typed directly; press Enter to run it:

```text
> print("Hello, Lua!")
Hello, Lua!
```

The interactive environment can run real Lua code, such as defining variables or functions:

```text
> x = 10
> y = 20
> print(x + y)
30
> function greet(name)
>>     return "Hello, " .. name
>> end
> print(greet("World"))
Hello, World!
```

## 3. Running a Lua script

The interpreter can also run script files. Here is the content of `script.lua`:

```lua
-- script.lua
print("This is a Lua script.")
for i = 1, 5 do
    print("Number: " .. i)
end
```

Run the script from the terminal:

```sh
$ lua script.lua
This is a Lua script.
Number: 1
Number: 2
Number: 3
Number: 4
Number: 5
```

## 4. Using command-line options

The interpreter supports several command-line options. The common ones:

- `-e`: execute Lua code directly. For example:
    ```sh
    $ lua -e 'print("Hello from command line!")'
    Hello from command line!
    ```

- `-l`: load a Lua script file. For example:
    ```sh
    $ lua -l script
    ```

  This loads `script.lua` and runs the code in it.

- `-v`: show Lua version information. For example:
    ```sh
    $ lua -v
    Lua 5.4.8  Copyright (C) 1994-2025 Lua.org, PUC-Rio
    ```

## 5. Debugging scripts and error handling

When you run a Lua script and the code has an error, the interpreter prints the error message and where the problem is. Given this `script.lua`:

```lua
-- script.lua
local t = {}
print(t.x + 1)
```

Running it produces this error:

```sh
$ lua script.lua
lua: script.lua:3: attempt to perform arithmetic on a nil value (field 'x')
stack traceback:
	script.lua:3: in main chunk
	[C]: in ?
```

You can debug and fix the code based on that message.

## 6. Exiting the interpreter

To exit, type `os.exit()`, or press `Ctrl+D` (on Unix) or `Ctrl+Z` (on Windows).

```text
> os.exit()
```

Pressing `Ctrl+D` at the prompt also exits the interpreter.

## Wrap-up

Use the interactive mode to test snippets, `lua script.lua` to run a program, and on an error read the location pointed at by the first line of the message. Everyday Lua writing mostly stays inside those three steps.

## References

- [Interpreter_(computing)](https://en.wikipedia.org/wiki/Interpreter_(computing))
- [Virtual_machine](https://en.wikipedia.org/wiki/Virtual_machine)
- [Lua official documentation index](https://www.lua.org/docs.html)

## Related pages

- [interpreter-implementation](/design-and-implementation/interpreter-implementation.md)
