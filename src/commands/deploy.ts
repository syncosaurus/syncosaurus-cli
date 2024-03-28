import {Command} from '@oclif/core'
import {execa} from 'execa'

export default class Deploy extends Command {
  static description = 'Deploy your syncosaurus project to the edge'

  public async run(): Promise<void> {
    const {stdout} = await execa('ls')

    // Verify the command is run from the root directory
    if (stdout.includes('syncosaurus.json')) {
      await execa('cp', ['./src/mutators.js', './node_modules/syncosaurus/do'], {shell: true})
      await execa('cp', ['./src/authHandler.js', './node_modules/syncosaurus/do'], {shell: true})
      await execa('wrangler', ['deploy', './node_modules/syncosaurus/do/index.mjs'], {stdio: 'inherit'})
    } else {
      this.log("🦖 Error! It looks like you aren't in a Syncosaurus project root directory.")
    }
  }
}
