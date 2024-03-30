import {Command, ux} from '@oclif/core'
import {execa} from 'execa'
import {input} from '@inquirer/prompts'
import {generateSyncoJson, generateWranglerToml} from '../utils/configs.js'

export default class Setup extends Command {
  static description = 'Add syncosaurus to an existing React application.'

  public async run(): Promise<void> {
    const {stdout} = await execa('ls')

    if (stdout.includes('syncosaurus.json')) {
      this.log('🦖 Syncosaurus already installed!')
      return
    }

    try {
      await execa('ls', ['./node_modules/syncosaurus'])
    } catch {
      ux.action.start('🦖 Adding Syncosaurus as a dependency')
      await execa('npm', ['install', 'syncosaurus', '--save'])
      ux.action.stop('done!')
    }

    const projectDir = process.cwd()
    const projectName = await input({message: '🦖 What is the name of your project?'})

    await execa(`echo '${generateWranglerToml(projectName)}' > 'wrangler.toml'`, {
      shell: true,
      cwd: projectDir + '/node_modules/syncosaurus/do',
      stdio: 'inherit',
    })

    await execa(`echo '${generateSyncoJson(projectName)}' > 'syncosaurus.json'`, {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit',
    })

    let noMutators = false
    try {
      await execa('echo mutators.js', {shell: true, cwd: projectDir + '/src'})
    } catch {
      noMutators = true
    }

    this.log('Finished! See https://github.com/synocsaurus/syncosaurus for more info.')
    if (noMutators) {
      this.log('Make sure to define your mutators.js and place it in /src')
    }
  }
}
