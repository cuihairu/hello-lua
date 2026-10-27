# Lua's Design Philosophy and Features

Lua's design revolves around a few concrete trade-offs: small, embeddable, extensible. This section looks at those trade-offs first, then lists the language features that grew out of them.

## 1. Design philosophy

### 1.1 Lightweight and embeddable

Lua was conceived as an embedded scripting language, so being lightweight comes before every other goal: the compiler and runtime typically occupy well under 1 MB, which is enough to drop straight into a game engine, an embedded system, or a mobile app.

### 1.2 Simplicity and flexibility

Lua aims for a clean language structure and syntax, getting things done with as little code as possible. The core syntax is simple and deliberately avoids heavyweight language features. Simplicity pays off twice: it is quick to learn, and the cost of interpreting is low.

At the same time, Lua's flexibility comes from its dynamic type system and a deliberately minimal standard library. Developers can extend Lua however they need, and can even build their own object and module systems on top of it. That is what lets Lua be tailored closely to very different kinds of projects.

### 1.3 Extensibility

High extensibility is one of the core ideas behind Lua's design. Lua offers a simple C API, so you can call Lua code from C, or call C functions from Lua. That two-way interaction means Lua integrates seamlessly with existing C/C++ projects, and it lets you write the performance-critical parts in C while keeping the rest in Lua.

### 1.4 Developer first

Lua's design tries to keep the mental load on the developer low: the syntax and the features deliberately stay away from "traps" and complexity, so you do not have to guard against the language itself. Successive releases also hold a strong line on backwards compatibility.

## 2. Main features

### 2.1 Dynamic typing

Lua is dynamically typed: a variable's type is decided at runtime rather than fixed at compile time. You can create and reshape data structures at runtime without declaring a type first.

### 2.2 Automatic memory management

Lua includes automatic memory management, implemented mainly through garbage collection. Lua's collector uses incremental and generational algorithms, so it reclaims memory that is no longer needed and keeps the risk of leaks low. Developers do not manage memory by hand, which removes a whole class of errors.

### 2.3 Powerful tables

The table is Lua's only composite data structure, and it can be used both as an array and as a dictionary. Lua tables support flexible key-value storage and can serve as arrays, dictionaries, sets, objects and more. Through metatables and metamethods they can also implement operator overloading and inheritance, which makes the table the central building block of Lua programming.

### 2.4 Coroutines

Lua ships with native coroutine support, so concurrency is straightforward to write. Unlike threads, coroutines are user-level units of concurrency: lightweight and cheap. They can suspend and resume at any point in a function, which gives you a non-blocking code structure — a good fit for asynchronous I/O and complex control flow.

### 2.5 Highly embeddable

Lua puts integration with the host application first by design. The C API is simple, so a host app can embed the Lua interpreter and talk to it in both directions. Combined with the small footprint, it also runs in resource-constrained places such as embedded systems and mobile devices.

### 2.6 Cross-platform support

Lua is written entirely in ANSI C and is highly portable. Any platform with a C compiler can run it — Windows, macOS, Linux, iOS and Android all included. Cross-platform applications use it for exactly that reason.

### 2.7 Simple and easy to learn

Lua's syntax is very simple, similar in feel to other scripting languages such as Python and JavaScript, so it is easy to pick up. For someone with programming experience, Lua usually takes a few days to learn. The clean syntax and consistent design also make the code easier to read and maintain.

## Wrap-up

A runtime under 1 MB, one composite structure, native coroutines and a C API — put those together and it explains why Lua has been embedded in so many host programs.

## References

- [Lua_(programming_language)](https://en.wikipedia.org/wiki/Lua_(programming_language))
- [Prototype-based_programming](https://en.wikipedia.org/wiki/Prototype-based_programming)
- [PIL · First Steps](https://www.lua.org/pil/1.html)

## Related pages

- [introduction](introduction.md)
- [history-and-development](history-and-development.md)
