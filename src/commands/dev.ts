import { Command } from '@oclif/core';
import { execa, ExecaChildProcess } from 'execa';
import ora from 'ora';
import { generateWranglerToml } from '../utils/configs.js';
import fs from 'node:fs';

interface ConfigParams {
  projectName: string
  useStorage: boolean
  msgFrequency: number
  autosaveInterval: number
}

export class MyCommand extends Command {
  static description = 'Start a local Syncosaurus development environment'

  async run(): Promise<void> {
    // Verify the command is run from the root directory
    const inSyncoRoot = fs.readdirSync(process.cwd()).includes('syncosaurus.json');

    if (inSyncoRoot) {
      // Ensure that Syncosaurus is installed
      const verifySyncoInstall = ora('Checking for Syncosaurus installation...').start();
      const { stdout: syncoStdout } = await execa('npm', ['list', 'syncosaurus'], { cwd: process.cwd() });
      if (syncoStdout.includes('(empty)')) {
        verifySyncoInstall.stopAndPersist({ text: 'Checking for Syncosaurus installation...not found' })
        const syncoInstall = ora('Installing syncosaurus as a dependency...');
        await execa('npm', ['install', 'syncosaurus'], { cwd: process.cwd() });
        syncoInstall.stopAndPersist({ text: 'Installing syncosaurus as a dependency...done' });
      }

      verifySyncoInstall.stopAndPersist({ text: 'Checking for Syncosaurus installation...found' });

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

      const viteChildProcess: ExecaChildProcess<string> | null = execa(`vite`, {
        shell: true,
        cwd: process.cwd(),
        env: process.env,
        stdio: ['inherit', 'pipe', 'pipe'],
        encoding: 'utf8',
        detached: true,
      });

      const wranglerChildProcess: ExecaChildProcess<string> | null = execa('wrangler', ['dev', './node_modules/syncosaurus/do/index.mjs'], {
        shell: true,
        cwd: process.cwd(),
        env: process.env,
        stdio: ['inherit', 'pipe', 'pipe'],
        encoding: 'utf8',
        detached: true,
      });

      const urlSnippet = 'http://localhost';
      this.log('  Spinning up local development environment...');
      let wranglerUrl: string;

      wranglerChildProcess.stdout!.on('data', (data) => {
        const str = data.toString();
        const boxSnippet = '╭───────────';

        if (str.includes(urlSnippet)) {
          const url = str.substring(str.indexOf(urlSnippet), str.indexOf(boxSnippet, str.indexOf(urlSnippet)));
          wranglerUrl = `Syncosaurus local worker ready at: ${url}`.trim();
        }
      });

      viteChildProcess.stdout!.on('data', (data) => {
        const str = data.toString();

        if (str.includes(urlSnippet)) {
          const url = str.substring(str.indexOf(urlSnippet));

          this.log(`\n
            🦖 ${wranglerUrl.trim()}\n
            🚀 Frontend local server ready at: ${url}\n
          `);

          wranglerChildProcess.kill('SIGKILL');
          viteChildProcess.kill('SIGKILL');
        }
      });

      await Promise.all([wranglerChildProcess, viteChildProcess]);
      process.exit(1);
    } else {
      this.error("Not in a Syncosaurus root directory. Expected 'syncosaurus.json' configuration file not found.")
    }
  }
}
