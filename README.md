# Syncosaurus CLI

The Syncosaurus CLI to create and manage Syncosaurus backed React applications.

[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Syncosaurus CLI](#syncosaurus-cli)
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
syncosaurus-cli/0.0.2 darwin-arm64 node-v21.1.0
$ syncosaurus --help [COMMAND]
USAGE
  $ syncosaurus COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`syncosaurus dev`](#syncosaurus-dev)
* [`syncosaurus hello PERSON`](#syncosaurus-hello-person)
* [`syncosaurus hello world`](#syncosaurus-hello-world)
* [`syncosaurus help [COMMAND]`](#syncosaurus-help-command)
* [`syncosaurus init`](#syncosaurus-init)
* [`syncosaurus login`](#syncosaurus-login)
* [`syncosaurus logout`](#syncosaurus-logout)
* [`syncosaurus whoami`](#syncosaurus-whoami)

## `syncosaurus dev`

Start concurrent Vite and Wrangler dev servers

```
USAGE
  $ syncosaurus dev

DESCRIPTION
  Start concurrent Vite and Wrangler dev servers
```

_See code: [src/commands/dev.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.0.2/src/commands/dev.ts)_

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

_See code: [src/commands/hello/index.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.0.2/src/commands/hello/index.ts)_

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

_See code: [src/commands/hello/world.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.0.2/src/commands/hello/world.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.20/src/commands/help.ts)_

## `syncosaurus init`

Create a fresh React app, preconfigured with a Syncosaurus multiplayer backend.

```
USAGE
  $ syncosaurus init

DESCRIPTION
  Create a fresh React app, preconfigured with a Syncosaurus multiplayer backend.
```

_See code: [src/commands/init.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.0.2/src/commands/init.ts)_

## `syncosaurus login`

Login Synocosaurus through Oauth or API token

```
USAGE
  $ syncosaurus login

DESCRIPTION
  Login Synocosaurus through Oauth or API token
```

_See code: [src/commands/login.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.0.2/src/commands/login.ts)_

## `syncosaurus logout`

Login Synocosaurus through Oauth or API token

```
USAGE
  $ syncosaurus logout

DESCRIPTION
  Login Synocosaurus through Oauth or API token
```

_See code: [src/commands/logout.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.0.2/src/commands/logout.ts)_

## `syncosaurus whoami`

Check your current login status

```
USAGE
  $ syncosaurus whoami

DESCRIPTION
  Check your current login status
```

_See code: [src/commands/whoami.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.0.2/src/commands/whoami.ts)_
<!-- commandsstop -->
