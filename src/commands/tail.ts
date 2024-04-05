import { Command } from '@oclif/core'
import fs from 'fs'
import { execa } from 'execa'

export default class Tail extends Command {
  static description = 'Setup a tail log to a deployed Syncosaurus server.'

  public async run(): Promise<void> {
    const { stdout } = await execa('ls')

    if (!stdout.includes('syncosaurus.json')) {
      this.log('Syncosaurus config file not found. Please try again in a Syncosaurus project.')
      return
    }

    let tailProcess
    try {
      const jsonData = fs.readFileSync(process.cwd() + '/syncosaurus.json', 'utf8')
      const { projectName } = JSON.parse(jsonData)

      tailProcess = execa('wrangler', ['tail', projectName], { shell: true, stdin: 'inherit', stdout: 'pipe' })
    } catch (e) {
      this.log('There was an error.', e)
    }

    await tailProcess
  }
}
