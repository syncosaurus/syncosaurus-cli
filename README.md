oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g syncosaurus-cli
$ syncosaurus COMMAND
running command...
$ syncosaurus (--version)
syncosaurus-cli/0.4.25 darwin-arm64 node-v21.1.0
$ syncosaurus --help [COMMAND]
USAGE
  $ syncosaurus COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`syncosaurus hello PERSON`](#syncosaurus-hello-person)
* [`syncosaurus hello world`](#syncosaurus-hello-world)
* [`syncosaurus help [COMMAND]`](#syncosaurus-help-command)
* [`syncosaurus plugins`](#syncosaurus-plugins)
* [`syncosaurus plugins:install PLUGIN...`](#syncosaurus-pluginsinstall-plugin)
* [`syncosaurus plugins:inspect PLUGIN...`](#syncosaurus-pluginsinspect-plugin)
* [`syncosaurus plugins:install PLUGIN...`](#syncosaurus-pluginsinstall-plugin-1)
* [`syncosaurus plugins:link PLUGIN`](#syncosaurus-pluginslink-plugin)
* [`syncosaurus plugins:uninstall PLUGIN...`](#syncosaurus-pluginsuninstall-plugin)
* [`syncosaurus plugins reset`](#syncosaurus-plugins-reset)
* [`syncosaurus plugins:uninstall PLUGIN...`](#syncosaurus-pluginsuninstall-plugin-1)
* [`syncosaurus plugins:uninstall PLUGIN...`](#syncosaurus-pluginsuninstall-plugin-2)
* [`syncosaurus plugins update`](#syncosaurus-plugins-update)

## `syncosaurus hello PERSON`

Say hello

```
USAGE
  $ syncosaurus hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.4.25/src/commands/hello/index.ts)_

## `syncosaurus hello world`

Say hello world

```
USAGE
  $ syncosaurus hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ syncosaurus hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.4.25/src/commands/hello/world.ts)_

## `syncosaurus help [COMMAND]`

Display help for syncosaurus.

```
USAGE
  $ syncosaurus help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for syncosaurus.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.18/src/commands/help.ts)_

## `syncosaurus plugins`

List installed plugins.

```
USAGE
  $ syncosaurus plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ syncosaurus plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.8/src/commands/plugins/index.ts)_

## `syncosaurus plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ syncosaurus plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ syncosaurus plugins add

EXAMPLES
  $ syncosaurus plugins add myplugin 

  $ syncosaurus plugins add https://github.com/someuser/someplugin

  $ syncosaurus plugins add someuser/someplugin
```

## `syncosaurus plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ syncosaurus plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ syncosaurus plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.8/src/commands/plugins/inspect.ts)_

## `syncosaurus plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ syncosaurus plugins install PLUGIN...

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ syncosaurus plugins add

EXAMPLES
  $ syncosaurus plugins install myplugin 

  $ syncosaurus plugins install https://github.com/someuser/someplugin

  $ syncosaurus plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.8/src/commands/plugins/install.ts)_

## `syncosaurus plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ syncosaurus plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ syncosaurus plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.8/src/commands/plugins/link.ts)_

## `syncosaurus plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ syncosaurus plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ syncosaurus plugins unlink
  $ syncosaurus plugins remove

EXAMPLES
  $ syncosaurus plugins remove myplugin
```

## `syncosaurus plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ syncosaurus plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.8/src/commands/plugins/reset.ts)_

## `syncosaurus plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ syncosaurus plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ syncosaurus plugins unlink
  $ syncosaurus plugins remove

EXAMPLES
  $ syncosaurus plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.8/src/commands/plugins/uninstall.ts)_

## `syncosaurus plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ syncosaurus plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ syncosaurus plugins unlink
  $ syncosaurus plugins remove

EXAMPLES
  $ syncosaurus plugins unlink myplugin
```

## `syncosaurus plugins update`

Update installed plugins.

```
USAGE
  $ syncosaurus plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.8/src/commands/plugins/update.ts)_
<!-- commandsstop -->
