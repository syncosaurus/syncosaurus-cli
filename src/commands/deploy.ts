import { Command, ux } from '@oclif/core';
import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import { generateWranglerToml } from '../utils/configs.js';
import fs from 'node:fs';

interface ConfigParams {
  projectName: string
  useStorage: boolean
  msgFrequency: number
  autosaveInterval: number
}

export default class Deploy extends Command {
  static description = 'Deploy your Syncosaurus application';

  public async run(): Promise<void> {
    // Verify the command is run from the root directory
    const inSyncoRoot = fs.readdirSync(process.cwd()).includes('syncosaurus.json');

    if (inSyncoRoot) {
      // Ensure that Syncosaurus is installed
      const verifySyncoInstall = ora('Checking for Syncosaurus installation...').start();
      const syncoPackageExists = fs.readdirSync(`${process.cwd()}/node_modules`).includes('syncosaurus');
      if (!syncoPackageExists) {
        verifySyncoInstall.stopAndPersist({ text: 'Checking for Syncosaurus installation...not found' })
        const syncoInstall = ora('Installing syncosaurus as a dependency...');
        await execa('npm', ['install', 'syncosaurus'], { cwd: process.cwd() });
        syncoInstall.stopAndPersist({ text: 'Installing syncosaurus as a dependency...done' });
      }

      verifySyncoInstall.stopAndPersist({ text: 'Checking for Syncosaurus installation...found' });

      // Refresh wrangler.toml
      const configParams = JSON.parse(fs.readFileSync('syncosaurus.json', 'utf-8'))
      const { projectName, useStorage, msgFrequency, autosaveInterval } = configParams as ConfigParams
      await execa('rm', ['-f', './node_modules/syncosaurus/do/wrangler.toml'], { shell: true })

      await execa(
        `echo '${generateWranglerToml(projectName, useStorage, msgFrequency, autosaveInterval)}' > 'wrangler.toml'`,
        {
          shell: true,
          cwd: process.cwd() + '/node_modules/syncosaurus/do',
          stdio: 'inherit',
        },
      )

      // Copy client mutators, syncosaurus config file, and optional auth handler to worker directory
      const mutatorsInSrcDir = fs.readdirSync(`${process.cwd()}/src`).includes('mutators.js');
      const authHandlerInSrcDir = fs.readdirSync(`${process.cwd()}/src`).includes('authHandler.js');
      if (!mutatorsInSrcDir) {
        this.error(`Required 'mutators.js' file not found in directory '${process.cwd()}/src'`);
      }

      await execa('cp', [`${process.cwd()}/src/mutators.js`, `${process.cwd()}/node_modules/syncosaurus/do`], { shell: true });
      await execa('cp', [`${process.cwd()}/syncosaurus.json`, `${process.cwd()}/node_modules/syncosaurus/do`], { shell: true });

      if (authHandlerInSrcDir) {
        await execa('cp', [`${process.cwd()}/src/authHandler.js`, `${process.cwd()}/node_modules/syncosaurus/do`], { shell: true });
      }

      const deploy = execa('wrangler', ['deploy', './node_modules/syncosaurus/do/index.mjs'], { stdin: 'inherit' });

      ux.action.start('Evolving your Syncosaurus server...');
      deploy.stdout?.on('data', async (data) => {
        let str = data.toString();
        let successMsg;
        let urlMsg;

        if (str.includes('⛅️') && !successMsg) {
          str = str.replace('⛅️', '🦖');
          str = str.replace(/wrangler.+\)/, 'syncosaurus 0.4.2');
          str = str.replace(/-+/, chalk.green('-'.repeat(50)));
          this.log(str);
          successMsg = true;
        } else if (str.includes('https') && !urlMsg) {
          ux.action.stop('Evolving your Syncosaurus server...done!');
          const url = str.match(/http.+dev/);
          this.log(`✅ Success! Your Syncosaurus server is available at\n  ${chalk.yellowBright(url)}`);
          urlMsg = true;
        }
      })

      await deploy;
    } else {
      this.log("🦖 Error! It looks like you aren't in a Syncosaurus project root directory.");
    }
  }
}
