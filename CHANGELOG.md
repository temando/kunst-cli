# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

## [1.0.3][] - 2018-01-08

### Fixed

- Support plugins that have boolean values for settings.

## [1.0.2][] - 2017-11-28

### Fixed

- `remark-stringify` and `remark-parse` plugins are added _first_, before the preset to ensure better compatibility with plugins that require these to exist (eg. `remark-frontmatter`).

## [1.0.1][] - 2017-11-16

### Fixed

- Correct the exit code for when things go awry.

## [1.0.0][] - 2017-10-20

Kunst is open sourced after a year of internal use by Temando's Developer Experience team.

[Unreleased]: https://github.com/temando/kunst-cli/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/temando/kunst-cli/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/temando/kunst-cli/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/temando/kunst-cli/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/temando/kunst-cli/tree/v1.0.0
