# Syncosaurus CLI

The Syncosaurus CLI application is used to conveniently create, configure, manage, and deploy Syncosaurus applications. Built in Typescript with the [oclif](https://oclif.io/) framework.

## Requirements

- Node v18+
- Active Cloudflare account with access to Durable Objects
<br></br>

## Installation

- It is recommended to utilize the Syncosaurus CLI with `npx` commands, without having to install the application locally.
- If you still wish to install the Syncosaurus CLI locally, run `npm install -g syncosaurus-cli`.
  - If you are electing to run the Syncosaurus CLI locally, simply remove the `npx` at the beginning of the commands below.
<br></br>

## Setup and Development Commands

### `npx syncosaurus init`

- Create a new React application, pre-configured with a Syncosaurus multiplayer backend. Note that this command will create a `syncosaurus.json` configuration file in your root directory.

  ```bash
  npx syncosaurus init
  ```

### `npx syncosaurus setup`

- Add Syncosaurus to an existing React-based application. Note that this command will also create a `syncosaurus.json` configuration file in your root directory.

  ```bash
  npx syncosaurus setup
  ```

### `npx syncosaurus dev`

- Start a local Syncosaurus development environment. Run without any flags to start up both a local Syncosaurus server and a local Vite UI server. Run with the `-b`/`-backendOnly` flag to start up only a local Syncosaurus server.
  - The local Syncosaurus server will use the designated port, as specified by a `PORT` value in your local `.env` file. If no such value exists, it will default to port 8787.

  ```bash
  npx syncosaurus dev [-b]
  ```
<br></br>

## Deployment Commands

### `npx syncosaurus deploy`

- Deploy your Syncosaurus application. You must be logged in to use this command.

  ```bash
  npx syncosaurus deploy
  ```

### `npx syncosaurus destroy`

- Delete your most recent deployment, only if that deployment matches the current project. You must be logged in to use this command.

  ```bash
  npx syncosaurus destroy
  ```

### `npx syncosaurus tail`

- Setup a tail log stream for a deployed Syncosaurus worker.

  ```bash
  npx syncosaurus tail
  ```
<br></br>

## Authentication Commands

### `npx syncosaurus login`

- Login to Synocosaurus through OAuth or API token.

  ```bash
  npx syncosaurus login
  ```

### `npx syncosaurus logout`

- Logout of Syncosaurus.

  ```bash
  npx syncosaurus logout
  ```

### `npx syncosaurus whoami`

- Check your current Syncosaurus login status.

  ```bash
  npx syncosaurus whoami
  ```