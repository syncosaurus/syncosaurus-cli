import {Command, ux} from '@oclif/core'
import {execa} from 'execa'
import chalk from 'chalk'
import {generateWranglerToml} from '../utils/configs.js'
import fs from 'fs'

interface ConfigParams {
  projectName: string
  useStorage: boolean
  msgFrequency: number
  autosaveInterval: number
}

export default class Deploy extends Command {
  static description = 'Deploy your syncosaurus project to the edge'

  public async run(): Promise<void> {
    const {stdout} = await execa('ls')

    // Verify the command is run from the root directory
    if (stdout.includes('syncosaurus.json')) {
      // Refresh wrangler.toml
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

      // Copy mutators/authhandlers/config file
      await execa('cp', ['./src/mutators.js', './node_modules/syncosaurus/do'], {shell: true})
      await execa('cp', ['./src/authHandler.js', './node_modules/syncosaurus/do'], {shell: true})
      await execa('cp', ['./syncosaurus.json', './node_modules/syncosaurus/do'], {shell: true})
      const deploy = execa('wrangler', ['deploy', './node_modules/syncosaurus/do/index.mjs'], {stdin: 'inherit'})

      ux.action.start('Evolving your Syncosaurus server')
      deploy.stdout?.on('data', async (data) => {
        let str = data.toString()

        if (str.includes('⛅️')) {
          str = str.replace('⛅️', '🦖')
          str = str.replace(/wrangler.+\)/, 'syncosaurus 0.4.2')
          str = str.replace(/-+/, chalk.green('-'.repeat(50)))
          this.log(str)
        } else if (str.includes('https')) {
          ux.action.stop('done!\n')
          const url = str.match(/http.+dev/)
          this.log(`✅ Success! Your Syncosaurus server is available at\n  ${chalk.yellowBright(url)}`)
        }
      })

      await deploy
    } else {
      this.log("🦖 Error! It looks like you aren't in a Syncosaurus project root directory.")
    }
  }
}
