import {Command, ux} from '@oclif/core'
import {execa} from 'execa'
import {input} from '@inquirer/prompts'

export default class Init extends Command {
  static description = 'Create a fresh React app, preconfigured with a Syncosaurus multiplayer backend.'

  public async run(): Promise<void> {
    this.log('🦖 Creating a new Syncosaurus backed React app!')
    const projectName = await input({message: 'What is the name of your project?'})

    const process = execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react'], {
      stdin: 'inherit',
    })

    ux.action.start('🦖🧙 Engaging dino wizardry to scaffold your project')

    let viteCompleted = false
    let finalOutput = ''
    process.stdout?.on('data', async (data) => {
      const str = data.toString()
      if (str.includes('is not empty.')) {
        this.error('❌ It looks like that project name already exists. Please try again with a new one.\n\n')
      }

      if (str.includes('Done')) {
        viteCompleted = true
      }

      if (viteCompleted) {
        finalOutput += str
      }
    })

    // Resolves once Vite has completed scaffolding a project
    await process

    // Log the final output from running Vite
    ux.action.stop('Finished!\n')
    this.log(finalOutput.slice(6))
  }
}
