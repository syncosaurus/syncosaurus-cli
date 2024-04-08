import { Command, ux } from '@oclif/core';
import { execa, ExecaChildProcess } from 'execa';
import { generateWranglerToml } from '../utils/configs.js';
import chalk from 'chalk';
import fs from 'node:fs';

interface ConfigParams {
  projectName: string
  useStorage: boolean
  msgFrequency: number
  autosaveInterval: number
}

export class MyCommand extends Command {
  static description = 'Start a local Syncosaurus development environment';

  async run(): Promise<void> {
    // Verify the command is run from the root directory
    const inSyncoRoot = fs.readdirSync(process.cwd()).includes('syncosaurus.json');

    if (inSyncoRoot) {
      // Ensure that Syncosaurus is installed
      ux.action.start('Checking for Syncosaurus installation...');
      const syncoPackageExists = fs.readdirSync(`${process.cwd()}/node_modules`).includes('syncosaurus');
      if (!syncoPackageExists) {
        ux.action.stop('not found');
        ux.action.start('Installing syncosaurus as a dependency...');
        await execa('npm', ['install', 'syncosaurus'], { cwd: process.cwd() });
        ux.action.stop('done');
      } else {
        ux.action.stop('found');
      }

      ux.action.start('Initializing local dev environment...');

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

      const wranglerChildProcess: ExecaChildProcess<string> | null = execa('wrangler', ['dev', './node_modules/syncosaurus/do/index.mjs'], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['inherit', 'pipe', 'pipe'],
        encoding: 'utf8',
        detached: true,
      });

      const urlSnippet = 'http://localhost';

      wranglerChildProcess.stdout!.on('data', (data) => {
        const str = data.toString();
        const boxSnippet = '╭───────────';
        const keyWranglerPhrase = '[wrangler:inf] Ready on http://localhost:';
        let urlMsg;

        if (str.includes(keyWranglerPhrase) && !urlMsg) {
          urlMsg = true;
          ux.action.stop('done!\n');
          this.log(chalk.green('-'.repeat(50)));
          const url = str.substring(str.indexOf(urlSnippet), str.indexOf(boxSnippet));
          this.log(`🦖 Your local Syncosaurus worker is ready at ${chalk.yellowBright.underline(url)}`);
          this.log("  NOTE: Press 'b' to open in browser. Press 'x' to gracefully exist");
          return;
        }
      });

      wranglerChildProcess.stderr!.on('data', (data) => {});

      await wranglerChildProcess;
    } else {
      this.error("Not in a Syncosaurus root directory. Expected 'syncosaurus.json' configuration file not found.")
    }
  }
}
