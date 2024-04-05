import {Command, ux} from '@oclif/core'
import {execa} from 'execa'
import {input} from '@inquirer/prompts'
import path from 'path'
import {generateSyncoJson, generateWranglerToml} from '../utils/configs.js'

export default class Init extends Command {
  static description = 'Initialize a new React app, preconfigured with a Syncosaurus multiplayer backend.'

  public async run(): Promise<void> {
    this.log('🦖 Creating a new Syncosaurus backed React app!')
    const projectName = await input({message: 'What is the name of your project?'})

    const viteOutput = await this.createViteProject(projectName)
    await this.integrateSyncosaurus(projectName)
    await this.copyTemplate(projectName)

    this.log(`
    Done! Now run:

      cd ${projectName}
      npx syncosaurus dev\n\n`)
  }

  private async createViteProject(projectName: string) {
    ux.action.start('🧙 Engaging dino wizardry to scaffold your project')
    let viteCompleted = false
    let finalOutput = ''
    const createVite = execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react'], {
      stdin: 'inherit',
    })
    createVite.stdout?.on('data', async (data) => {
      const str = data.toString()
      if (str.includes('is not empty.')) {
        this.error('❌ It looks like that project already exists. Please try again with a new name.\n\n')
      }

      if (str.includes('Done')) {
        viteCompleted = true
      }

      if (viteCompleted) {
        finalOutput += str
      }
    })

    await createVite
    ux.action.stop('finished!')
    return finalOutput
  }

  private async integrateSyncosaurus(projectName: string) {
    const projectDir = process.cwd() + '/' + projectName

    ux.action.start('🦖↔️🦖 Setting up inter-syncosaurus communication channels')
    await execa('npm', ['install', 'syncosaurus'], {
      cwd: projectDir,
    })

    // Create the syncosaurus config file
    await execa(`echo '${generateSyncoJson(projectName)}' > 'syncosaurus.json'`, {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit',
    })
    await execa(`echo '${generateWranglerToml(projectName)}' > 'wrangler.toml'`, {
      cwd: projectDir + '/node_modules/syncosaurus/do',
      shell: true,
      stdio: 'inherit',
    })

    ux.action.stop("everybody's talking now!")
  }

  private async copyTemplate(projectName: string) {
    const projectDir = process.cwd() + '/' + projectName + '/src'
    const dirName = path.dirname(new URL(import.meta.url).pathname)
    const templateDir = path.join(dirName, '../templates/vite-demo/src/*')
    this.log(templateDir)

    await execa('cp', ['-r', templateDir, projectDir], {shell: true})
  }
}
