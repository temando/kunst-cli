# Kunst CLI

[![NPM](https://img.shields.io/npm/v/kunst-cli.svg)](https://npmjs.org/packages/kunst-cli/)
[![Travis CI](https://img.shields.io/travis/temando/kunst-cli.svg)](https://travis-ci.org/temando/kunst-cli)
[![MIT License](https://img.shields.io/github/license/temando/kunst-cli.svg)](https://en.wikipedia.org/wiki/MIT_License)

> It was in Strasbourg in 1440 that Johannes Gutenberg is said to have perfected and unveiled the secret of printing based on his research, mysteriously entitled Aventur und Kunst (enterprise and art).

Kunst CLI (the new printing press) is a Markdown transformer which is able to process a directory of files, apply relevant transformations or checks to Markdown files, and then save them in a destination directory.

It uses [remark](http://remark.js.org/) internally, and [remark plugins](https://github.com/wooorm/remark/blob/master/doc/plugins.md) can be specified using a `kunst.config.json` or `kunst.config.js` file.

## Installation

Install Kunst CLI globally for ease of use with the following command:

```sh
npm install -g kunst-cli
```

## Using Kunst CLI

The Kunst CLI exposes a single command, `kunst` that has several options:

- `--source` A directory of source Markdown to transform. Defaults to the current directory.
- `--target` The directory where the transform source will be added. Defaults to `/target`.
- `--config` Allows [remark](https://github.com/unifiedjs/unified#preset) to be configured at runtime. Accepts a path to a JSON file. When omitted, Kunst looks for the config file `kunst.config.json` on the same directory that it runs from. See [config file](#config-file).
- `--clean` If provided, the `target` directory will be emptied before transforming.
- `--watch` If provided, `kunst` will watch for changes in the `--source` path and transform files from `--source` path to `--target` path.

### Config file

Kunst config files describe a [remark preset](https://github.com/unifiedjs/unified#preset), as `js` or `json`. If the config file is a `json` file, Kunst will dynamically load all the specified remark plugins and construct a preset.

> **All remark plugins specified in the config file must be added as NPM dependencies in your project.**

Example of `kunst.config.json`:

```json
{
  "plugins": [
    "remark-comment-config",
    "remark-graphviz",
    "remark-openapi",
    [
      "remark-gitlab-artifact",
      {
        "apiBase": "https://gitlab.com",
        "gitlabApiToken": "${GITLAB_API_TOKEN}"
      }
    ]
  ]
}
```

> In the above example, Kunst can replace environment variables in the config file, e.g. `GITLAB_API_TOKEN`, and with the actual value if the environment variable exists, before executing remark transformations.

Example of `kunst.config.js`:

```js
const commentConfig = require('remark-comment-config');
const graphviz = require('remark-graphviz');
const openapi = require('remark-openapi');
const gitlab = require('remark-gitlab-artifact');

module.exports = {
  plugins: [
    commentConfig,
    graphviz,
    openapi,
    [
      gitlab,
      {
        apiBase: 'https://gitlab.com',
        gitlabApiToken: process.env.GITLAB_API_TOKEN,
      }
    ],
  ],
};
```

### Examples

The following will process the directory `test/fixtures/full` and output the result to `test/fixtures/runtime`:

```sh
$ kunst --source test/fixtures/full --target test/fixtures/runtime --config kunst.config.js
info:    Kunst transformation complete. durationMs=2932
info:    /Users/brendanabbott/Sites/kunst-cli/test/fixtures/full/index.md
      63:1-94:4  info  dot code block replaced with graph    remark-graphviz
  101:19-101:62  info  dot link replaced with link to graph  remark-graphviz

/Users/brendanabbott/Sites/kunst-cli/test/fixtures/full/nested/index.md
       5:1-5:47  info  dot link replaced with link to graph  remark-graphviz
```

`--watch`  allows you to re-run transforms as you make changes to files in the `--source` directory. You can stop watching by terminating the command.

```sh
$ kunst --source test/fixtures/full --target test/fixtures/runtime --config kunst.config.js --watch
info:    watching test/fixtures/full for any changes to .md files…
info:    detected change in test/fixtures/full/nested/index.md…
info:    Kunst transformation complete. durationMs=1714
info:    test/fixtures/full/nested/index.md
  5:1-5:47  info  dot link replaced with link to graph  remark-graphviz
```

## Credit

Kunst is a rather small veneer over the excellent [remark](http://remark.js.org/) ecosystem. Full credit to [@wooorm](https://github.com/wooorm) and everyone who has contributed to make that ecosystem brilliant.

## Why?

At Temando developers write documentation alongside the source code and store it in the same project. We've developed our own Markdown _flavour_ to help developers use files in project in documentation. For example, dependency files are parsed to add a "Dependencies" list into `README.md` files.

To facilitate this, we often reuse existing Markdown functionality, notably the [Link `title`](https://daringfireball.net/projects/markdown/syntax#link), to act as a hook for remark plugins. This progressive enhancement allows the Markdown to be readable in other contexts (eg. Gitlab UI) before it's published to our internal site. It also means we can offload the responsibility of transforming Markdown to HTML to other [tools](http://www.mkdocs.org/).

Where it has made sense to do so, our `remark` plugins are available on Github/NPM:

- [`remark-graphviz`](https://github.com/temando/remark-graphviz) — Replace `dot` graphs with rendered SVGs
- [`remark-gitlab-artifact`](https://github.com/temando/remark-gitlab-artifact) — Download artifacts from GitLab projects to live alongside your Markdown
- [`remark-openapi`](https://github.com/temando/remark-openapi) — Convert links to local or remote OpenAPI definition to tables with summaries of all paths

## Maintainers

Kunst is an open source project from [Temando](http://temando.com/)'s Developer Experience team. Temando connects carriers with retailers and retailers to people. The Temando Platform combines shipping experiences, multi-carrier connectivity and lightning fast fulfillment in one solution. If this sounds like fun, [work with us](http://temando.com/en/about/careers)!
