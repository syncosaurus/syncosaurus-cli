import { Command, Flags, ux } from '@oclif/core';
import { execa, ExecaChildProcess } from 'execa';
import { generateWranglerToml } from '../utils/configs.js';
import readline from 'node:readline';
import chalk from 'chalk';
import fs from 'node:fs';
import { ConfigParams } from "../types.js";
export class Dev extends Command {
  static description = 'Start a local Syncosaurus development environment';

  static flags = {
    backendOnly: Flags.boolean({ char: 'b' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Dev);

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

      // Execute child process to extract local wrangler dev server URL
      const wranglerChildProcess: ExecaChildProcess<string> | null = execa('wrangler', ['dev', './node_modules/syncosaurus/do/index.mjs'], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['inherit', 'pipe', 'pipe'],
        encoding: 'utf8',
        detached: true,
      });

      // Regex to detect local server URLs, urlMsg to prevent concurrent data overrides
      const urlRegex = /http:\/\/\S+\d+/g;
      let urlMsg = false;

      const wranglerUrl: string | undefined = await new Promise((resolve, reject) => {
        wranglerChildProcess.stdout!.on('data', async (data) => {
          const str = data.toString();
          const keyWranglerPhrase = '[wrangler:inf] Ready on http://localhost:';

          if (str.includes(keyWranglerPhrase) && !urlMsg) {
            urlMsg = true;

            const urlMatches: string[] = [...str.matchAll(urlRegex)].map(match => match.at(0));

            if (urlMatches && urlMatches.length) {
              resolve(urlMatches.at(-1));
            }
          }
        });
      });

      // if -backend / -b flag is used, only spin up the Syncosaurus dev server
      if (flags.backendOnly) {
        ux.action.stop('done!\n');
        this.log(chalk.green('-'.repeat(50)));
        this.log(`🦖 Your local Syncosaurus dev server is ready at ${chalk.yellowBright.underline(wranglerUrl)}`);
        this.log(`Press 'x' to gracefully shut down the server`);
        this.pressXtoExit(wranglerChildProcess);
        return;
      }

      urlMsg = false;

      // Execute child process to extract local vite UI dev server URL
      const viteChildProcess: ExecaChildProcess<string> | null = execa('npx', ['vite'], {
        cwd: process.cwd(),
        env: {
          VITE_DO_URL: process.env.VITE_DO_URL || wranglerUrl,
        },
        stdio: ['inherit', 'pipe', 'pipe'],
        encoding: 'utf8',
        detached: true,
      });

      const viteUrl: string | undefined = await new Promise((resolve, _reject) => {
        viteChildProcess.stdout!.on('data', async (data) => {
          const str = data.toString();
          const keyVitePhrase = 'Local:';

          if (str.includes(keyVitePhrase) && !urlMsg) {
            urlMsg = true;
            const urlMatches: string[] = [...str.matchAll(urlRegex)].map(match => match.at(0));

            if (urlMatches && urlMatches.length) {
              resolve(urlMatches.at(-1));
            }
          }
        });
      });

      ux.action.stop('done!\n');
      this.log(chalk.green('-'.repeat(50)));
      this.log(`🦖 Your local Syncosaurus dev server is ready at ${chalk.yellowBright.underline(wranglerUrl)}`);
      this.log(`🚀 Your local Vite UI server is ready at ${chalk.green.underline(viteUrl)}\n`);
      this.log(`Press 'x' to gracefully shut down both servers`);

      this.pressXtoExit(wranglerChildProcess, viteChildProcess);

    } else {
      this.error("Not in a Syncosaurus root directory. Expected 'syncosaurus.json' configuration file not found.")
    }
  }

  // If 'x' or 'X' is pressed, gracefully shut down the servers
  private pressXtoExit(wranglerChildProcess: ExecaChildProcess<string> | null, viteChildProcess?: ExecaChildProcess<string> | null): void {
    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (_chunk, key) => {
      if (key && key.name.toLowerCase() === 'x') {
        if (wranglerChildProcess && wranglerChildProcess!.pid) {
          process.kill(-wranglerChildProcess!.pid);
        }

        if (viteChildProcess && viteChildProcess!.pid) {
          process.kill(-viteChildProcess!.pid);
        }

        process.exit();
      }
    });
  }
}
