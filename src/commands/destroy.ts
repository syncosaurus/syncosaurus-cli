import {Command, ux} from '@oclif/core'
import checkLogin from '../utils/login-check.js'
import {LoginResult} from '../types.js'
import {execa} from 'execa'
import confirm from '@inquirer/confirm'
import fs from 'node:fs'
import {parse} from 'smol-toml'

export default class Destroy extends Command {
  static description = 'Delete your most recent deployment, only if that deployment matches the current project'

  public async run(): Promise<void> {
    // Check is user is logged in and is in a Syncosaurus root directory
    const {loginStatus} = (await checkLogin()) as LoginResult

    if (!loginStatus) {
      this.error("You are not logged in. Run the command 'Syncosaurus login' to log in.")
    }

    const inSyncoRoot = fs.readdirSync(process.cwd()).includes('syncosaurus.json')

    if (!inSyncoRoot) {
      this.error("Not in a Syncosaurus root directory. Expected 'syncosaurus.json' configuration file not found.")
    }

    // Ensure that Syncosaurus is installed
    ux.action.start('Checking for Syncosaurus installation...')
    const syncoPackageExists = fs.readdirSync(`${process.cwd()}/node_modules`).includes('syncosaurus')

    if (!syncoPackageExists) {
      ux.action.stop('not found')
      ux.action.start('Installing syncosaurus as a dependency...')
      await execa('npm', ['install', 'syncosaurus'], {cwd: process.cwd()})
      ux.action.stop('done')
    } else {
      ux.action.stop('found')
    }

    // Confirm with the user that the specified deployed worker should be deleted
    const wranglerToml = fs.readFileSync('./node_modules/syncosaurus/do/wrangler.toml', 'utf-8')
    const parsedWranglerToml = parse(wranglerToml)
    const projectName = parsedWranglerToml.name.toString()

    const deleteConfirm = await confirm({
      message: `Are you sure you want to proceed with deleting your deployed worker '${projectName}'?`,
    })

    if (deleteConfirm) {
      try {
        ux.action.start(`Deleting your deployed ${projectName} worker...`)
        await execa('wrangler', ['delete', '--name', projectName])
        ux.action.stop('done')
        this.log(`🗑 Successfully deleted '${projectName}'`)
      } catch (error) {
        this.error(`Unable to delete Syncosaurus worker '${projectName}': Check that this worker is correctly deployed`)
      }
    } else {
      this.log(`You decided not to delete your deployed worker '${projectName}'.`)
    }
  }
}
