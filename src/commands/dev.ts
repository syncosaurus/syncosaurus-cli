import {Command} from '@oclif/core'
import {execa} from 'execa'
import fs from 'fs'

export class MyCommand extends Command {
  static description = 'Start concurrent Vite and Wrangler dev servers'

  async run(): Promise<void> {
    const {stdout} = await execa('ls')

    const configParams = JSON.parse(fs.readFileSync('syncosaurus.json', 'utf-8'))

    // Verify the command is run from the root directory
    if (stdout.includes('syncosaurus.json')) {
      await execa('cp', ['./src/mutators.js', './node_modules/syncosaurus/do'], {shell: true})
      await execa('cp', ['./src/authHandler.js', './node_modules/syncosaurus/do'], {shell: true})
      const viteProcess = execa('vite', {stdio: 'inherit'})
      const wranglerProcess = execa('wrangler', ['dev', './node_modules/syncosaurus/do/index.mjs'], {stdio: 'inherit'})
      await Promise.all([viteProcess, wranglerProcess])
    } else {
      this.log("🦖 Error! It looks like you aren't in a Syncosaurus project root directory.")
    }
  }
}
