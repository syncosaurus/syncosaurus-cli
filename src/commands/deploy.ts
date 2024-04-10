import {Command, ux} from '@oclif/core'
import {execa} from 'execa'
import chalk from 'chalk'
import {generateWranglerToml} from '../utils/configs.js'
import fs from 'node:fs'
import {ConfigParams} from '../types.js'

export default class Deploy extends Command {
  static description = 'Deploy your Syncosaurus application'

  public async run(): Promise<void> {
    // Verify the command is run from the root directory
    const inSyncoRoot = fs.readdirSync(process.cwd()).includes('syncosaurus.json')

    if (inSyncoRoot) {
      // Ensure that Syncosaurus is installed
      ux.action.start('Checking for Syncosaurus installation...')
      const syncoPackageExists = fs.readdirSync(`${process.cwd()}/node_modules`).includes('syncosaurus')
      if (!syncoPackageExists) {
        ux.action.stop('not found')
        ux.action.start('Installing syncosaurus as a dependency...')
        await execa('npm', ['install', 'syncosaurus'], {cwd: process.cwd()})
        ux.action.stop('done')
      } else {
        ux.action.stop('found')
      }

      ux.action.start('Deploying your Syncosaurus worker...')

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

      // Copy client mutators, syncosaurus config file, and optional auth handler to worker directory
      const mutatorsInSrcDir = fs.readdirSync(`${process.cwd()}/src`).includes('mutators.js')
      const authHandlerInSrcDir = fs.readdirSync(`${process.cwd()}/src`).includes('authHandler.js')
      if (!mutatorsInSrcDir) {
        this.error(`Required 'mutators.js' file not found in directory '${process.cwd()}/src'`)
      }

      await execa('cp', [`${process.cwd()}/src/mutators.js`, `${process.cwd()}/node_modules/syncosaurus/do`], {
        shell: true,
      })
      await execa('cp', [`${process.cwd()}/syncosaurus.json`, `${process.cwd()}/node_modules/syncosaurus/do`], {
        shell: true,
      })

      if (authHandlerInSrcDir) {
        await execa('cp', [`${process.cwd()}/src/authHandler.js`, `${process.cwd()}/node_modules/syncosaurus/do`], {
          shell: true,
        })
      }

      const deploy = execa('wrangler', ['deploy', './node_modules/syncosaurus/do/index.mjs'], {stdin: 'inherit'})

      deploy.stdout?.on('data', async (data) => {
        const str = data.toString()
        let urlMsg

        if (str.includes('https') && !urlMsg) {
          urlMsg = true
          ux.action.stop('done!')
          this.log(chalk.green('-'.repeat(50)))
          const url = str.match(/http.+dev/)
          this.log(`🦖 Your deployed Syncosaurus worker is ready at ${chalk.yellowBright.underline(url)}`)
          return
        }
      })

      await deploy
    } else {
      this.error("Not in a Syncosaurus root directory. Expected 'syncosaurus.json' configuration file not found.")
    }
  }
}
