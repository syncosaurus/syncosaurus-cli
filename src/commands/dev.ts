import {Command} from '@oclif/core'
import {execa} from 'execa'

export class MyCommand extends Command {
  static description = 'description of this example command'

  async run(): Promise<void> {
    const {stdout} = await execa('ls')

    if (stdout.includes('syncosaurus.json')) {
      const viteProcess = execa('vite', {stdio: 'inherit'})
      const wranglerProcess = execa('wrangler', ['dev'], {stdio: 'inherit'})
      Promise.all([viteProcess, wranglerProcess])
    } else {
      this.log("🦖 Error! It looks like you aren't in a Syncosaurus project.")
    }
  }
}
