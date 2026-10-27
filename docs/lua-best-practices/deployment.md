# Deployment and Release

A Lua project goes from code to production through six stages: code quality, build and packaging, deployment, testing, release, and maintenance.

## 1. Deployment Preparation

### 1.1. Ensure code quality

Before release, finish three things: review the code, have unit tests all pass to verify functionality, and run integration tests to confirm the system's parts work together.

### 1.2. Environment configuration

Set environment variables separately for development, testing, and production environments; configuration files such as `config.lua` should target the right environment.

## 2. Build and Packaging

### 2.1. Build scripts

Hand the build to automated tools; `Makefile`, `CMake`, or a custom script all work. The built version should match what is in version control.

### 2.2. Packaging

Package the project files into archives such as `.zip` or `.tar.gz` for easy distribution. Either include external dependencies in the package or write out their dependency requirements clearly.

Scripts can be precompiled to bytecode with `luac` before packaging (`luac -o script.luac script.lua`), saving the parse step at load time and incidentally not exposing the source. Bytecode is bound to the Lua minor version, so recompile after upgrading the interpreter.

## 3. Deployment

### 3.1. Deployment strategy

Small-scale deployments can be manual: upload the archive and unpack it to the target directory. With frequent releases, automate with CI/CD tools; Jenkins, GitLab CI, and GitHub Actions all work.

### 3.2. Deployment steps

First transfer files to the server via a file transfer protocol such as SCP or FTP, unpack into the target directory, and set file and directory permissions. If the application runs on a web server or application server, double-check the service configuration.

## 4. Testing and Verification

### 4.1. Functional testing

Run functional tests in the target environment to confirm the application works as expected.

### 4.2. Performance testing

Load testing looks at performance and stability under high load; stress testing looks at behavior under extreme conditions.

## 5. Release

### 5.1. Release management

Tag the released version and write release notes and a changelog: what the new version changed, what it fixed, and what known issues remain.

### 5.2. Release channels

For internal use, publish to the internal network for internal users; for external users, release through official websites, app stores, and similar channels.

## 6. Maintenance and Support

### 6.1. Monitoring

Going live is not the finish line. Log monitoring watches for potential problems, performance monitoring watches performance metrics, and handle anomalies promptly when found.

### 6.2. User feedback

Collect user feedback and reported issues, fix them, and fold them into subsequent releases.

### 6.3. Updates and rollback

After fixing issues, release an updated version. If a new version has a serious problem, rely on the rollback mechanism to return to the previous stable state.

## Summary

Most deployment incidents come from manual operations and unstructured processes. Automate whatever can be automated in build, deployment, and testing, and prepare the rollback mechanism in advance so there is a way back when problems arise.

## References

- [Lua official documentation index](https://www.lua.org/docs.html)
- [Lua download page](https://www.lua.org/download.html)

<!-- BACKLINKS-AUTO -->
## Related pages

- [README](/knowledge/README.md)
- [core-concepts](/knowledge/core-concepts.md)
