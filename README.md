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
syncosaurus-cli/0.2.0 linux-x64 node-v21.7.1
$ syncosaurus --help [COMMAND]
USAGE
  $ syncosaurus COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`syncosaurus dashboard`](#syncosaurus-dashboard)
* [`syncosaurus deploy`](#syncosaurus-deploy)
* [`syncosaurus dev`](#syncosaurus-dev)
* [`syncosaurus help [COMMAND]`](#syncosaurus-help-command)
* [`syncosaurus init`](#syncosaurus-init)
* [`syncosaurus login`](#syncosaurus-login)
* [`syncosaurus logout`](#syncosaurus-logout)
* [`syncosaurus setup`](#syncosaurus-setup)
* [`syncosaurus tail`](#syncosaurus-tail)
* [`syncosaurus whoami`](#syncosaurus-whoami)

## `syncosaurus dashboard`

Install and run the Syncosaurus analytics dashboard

```
USAGE
  $ syncosaurus dashboard

DESCRIPTION
  Install and run the Syncosaurus analytics dashboard
```

_See code: [src/commands/dashboard.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/dashboard.ts)_

## `syncosaurus deploy`

Deploy your syncosaurus project to the edge

```
USAGE
  $ syncosaurus deploy

DESCRIPTION
  Deploy your syncosaurus project to the edge
```

_See code: [src/commands/deploy.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/deploy.ts)_

## `syncosaurus dev`

Start concurrent Vite and Wrangler dev servers

```
USAGE
  $ syncosaurus dev

DESCRIPTION
  Start concurrent Vite and Wrangler dev servers
```

_See code: [src/commands/dev.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/dev.ts)_

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

_See code: [src/commands/init.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/init.ts)_

## `syncosaurus login`

Login Synocosaurus through Oauth or API token

```
USAGE
  $ syncosaurus login

DESCRIPTION
  Login Synocosaurus through Oauth or API token
```

_See code: [src/commands/login.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/login.ts)_

## `syncosaurus logout`

Login Synocosaurus through Oauth or API token

```
USAGE
  $ syncosaurus logout

DESCRIPTION
  Login Synocosaurus through Oauth or API token
```

_See code: [src/commands/logout.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/logout.ts)_

## `syncosaurus setup`

Add syncosaurus to an existing React application.

```
USAGE
  $ syncosaurus setup

DESCRIPTION
  Add syncosaurus to an existing React application.
```

_See code: [src/commands/setup.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/setup.ts)_

## `syncosaurus tail`

Setup a tail log to a deployed Syncosaurus server.

```
USAGE
  $ syncosaurus tail

DESCRIPTION
  Setup a tail log to a deployed Syncosaurus server.
```

_See code: [src/commands/tail.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/tail.ts)_

## `syncosaurus whoami`

Check your current login status

```
USAGE
  $ syncosaurus whoami

DESCRIPTION
  Check your current login status
```

_See code: [src/commands/whoami.ts](https://github.com/syncosaurus/syncosaurus-cli/blob/v0.2.0/src/commands/whoami.ts)_
<!-- commandsstop -->
