import {Command} from '@oclif/core'
import {execa} from 'execa'
import {generateWranglerToml} from '../utils/configs.js'
import fs from 'fs'

interface ConfigParams {
  projectName: string
  useStorage: boolean
  msgFrequency: number
  autosaveInterval: number
}

export class MyCommand extends Command {
  static description = 'Start a local Syncosaurus development environment'

  async run(): Promise<void> {
    const {stdout} = await execa('ls')

    // Verify the command is run from the root directory
    if (stdout.includes('syncosaurus.json')) {
      const configParams = JSON.parse(fs.readFileSync('syncosaurus.json', 'utf-8'))
      const {projectName, useStorage, msgFrequency, autosaveInterval} = configParams as ConfigParams
      await execa('rm', ['-f', './node_modules/syncosaurus/do/wrangler.toml'], {shell: true})

      await execa(
        `echo '${generateWranglerToml(projectName, useStorage, msgFrequency, autosaveInterval)}' > 'wrangler.toml'`,
        {
          shell: true,
          cwd: process.cwd() + '/node_modules/syncosaurus/do',
          stdio: 'inherit',
        },
      )

      await execa('cp', ['./src/mutators.js', './node_modules/syncosaurus/do'], {shell: true})
      await execa('cp', ['./src/authHandler.js', './node_modules/syncosaurus/do'], {shell: true})
      await execa('cp', ['./syncosaurus.json', './node_modules/syncosaurus/do'], {shell: true})
      const viteProcess = execa('vite', {stdio: 'inherit'})
      const wranglerProcess = execa('wrangler', ['dev', './node_modules/syncosaurus/do/index.mjs'], {stdio: 'inherit'})
      await Promise.all([viteProcess, wranglerProcess])
    } else {
      this.log("🦖 Error! It looks like you aren't in a Syncosaurus project root directory.")
    }
  }
}
