import {Command, ux} from '@oclif/core'
import {execa} from 'execa'
import {input} from '@inquirer/prompts'
import {generateWranglerToml, generateSyncoJson} from '../utils/configs.js'

export default class Init extends Command {
  static description = 'Create a fresh React app, preconfigured with a Syncosaurus multiplayer backend.'

  public async run(): Promise<void> {
    const cwd = process.cwd()

    // Query for project name
    this.log('🦖 Creating a new Syncosaurus backed React app!')
    const projectName = await input({message: 'What is the name of your project?'})
    const projectDir = process.cwd() + '/' + projectName

    // Create the vite project
    ux.action.start('🧙 Engaging dino wizardry to scaffold your project')
    let viteCompleted = false
    let finalOutput = ''
    const createVite = execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react'], {
      stdin: 'inherit',
    })
    createVite.stdout?.on('data', async (data) => {
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
    await createVite
    ux.action.stop('Finished!')

    // Install syncosaurus as a dependency
    ux.action.start('🦖 Integrating Syncosaurus')
    await execa('npm', ['install', 'syncosaurus'], {
      cwd: projectDir,
    })

    // Create the syncosaurus config file
    await execa(`echo '${generateSyncoJson(projectName)}' > 'syncosaurus.json'`, [], {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit',
    })

    // Log the final output from running Vite
    ux.action.stop('Finished!\n')
    this.log(finalOutput.slice(6))
  }
}

/*
  Steps to do:

  scaffold a vite project DONE
  add syncosaurus as a dependency in the projects package.json DONE
  Create a syncosaurus.json file
  Create a wrangler.toml

*/
