import { Command } from '@oclif/core';
import { execa } from 'execa';
import ora from 'ora';
import { generateWranglerToml } from '../utils/configs.js';
import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from "node:url";

interface ConfigParams {
  projectName: string
  useStorage: boolean
  msgFrequency: number
  autosaveInterval: number
}

export class MyCommand extends Command {
  static description = 'Start a local Syncosaurus development environment'

  async run(): Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const inSyncoRoot = fs.readdirSync(__dirname).includes('syncosaurus.json');

    // Ensure that Syncosaurus is installed
    const verifySyncoInstall = ora('Checking for Syncosaurus installation...').start();
    const { stdout: syncoStdout } = await execa('npm', ['list', 'syncosaurus'], { cwd: process.cwd() });
    if (syncoStdout.includes('(empty)')) {
      verifySyncoInstall.stopAndPersist({ text: 'Checking for Syncosaurus installation...not found'})
      const syncoInstall = ora('Installing syncosaurus as a dependency...');
      await execa('npm', ['install', 'syncosaurus'], { cwd: process.cwd() });
      syncoInstall.stopAndPersist({ text: 'Installing syncosaurus as a dependency...done'});
    }

    // Verify the command is run from the root directory
    if (inSyncoRoot) {
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
      const mutatorsInSrcDir = fs.readdirSync(`${__dirname}/src`).includes('mutators.js');
      const authHandlerInSrcDir = fs.readdirSync(`${__dirname}/src`).includes('authHandler.js');
      if (!mutatorsInSrcDir) {
        this.error(`❌ Error: required 'mutators.js' file not found in directory '${__dirname}/src'`);
      }

      await execa('cp', ['./src/mutators.js', './node_modules/syncosaurus/do'], { shell: true });
      await execa('cp', ['./syncosaurus.json', './node_modules/syncosaurus/do'], { shell: true });

      if (authHandlerInSrcDir) {
        await execa('cp', ['./src/authHandler.js', './node_modules/syncosaurus/do'], { shell: true });
      }

      const viteProcess = execa('vite', { stdio: 'inherit' })
      const wranglerProcess = execa('wrangler', ['dev', './node_modules/syncosaurus/do/index.mjs'], { stdio: 'inherit' })
      await Promise.all([viteProcess, wranglerProcess])
    } else {
      this.error("❌ Error: Not in a Syncosaurus root directory. Expected 'syncosaurus.json' configuration file not found.")
    }
  }
}
