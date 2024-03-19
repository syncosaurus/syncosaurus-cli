# Syncosaurus CLI tools

## Completed CLI commands

## In-Progress CLI commands

- `synocosaurus login`
  - currently testing via `node ./syncosaurus-login/index.js`
  - User can login via OAuth or via API token and Account ID
  - Retry functionality if login fails
  - Initial check performed if user is already logged in

- `syncosaurus whoami`
  - currently testing via `node ./syncosaurus-login/src/login-check.js`
  - Check is performed with the key phrase `User is logged in`

- `syncosaurus deploy`
  - `node ./syncosaurus-commands/deployServer.js` as current worker deployment CLI command
  - Currently naively finds and copies `mutator.js` file from frontend to server directory.
  - Overwrites `wrangler.toml` with `smol-toml` parser to change deployed worker name
  - Currently only deploys 1 Durable Object

- `syncosaurus destory`
  - `node deleteServer.js` as current worker deletion CLI command

## Future Commands

- `syncosaurus init`
- `syncosaurus logout`
- `syncosaurus rollback`
- `syncosaurus deployments`
- `syncosaurus help`

## Future Functionality

- CLI command flag and args functionality

## Future README.md instructions

- Specify shape and requirements for a syncosaurus application