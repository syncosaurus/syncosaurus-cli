import { Command, ux } from '@oclif/core'
import { execa } from 'execa'
import { input } from '@inquirer/prompts'
import chalk from 'chalk';
import { generateSyncoJson, generateWranglerToml } from '../utils/configs.js'
import fs from 'node:fs';

export default class Setup extends Command {
  static description = 'Add syncosaurus to an existing React application'

  public async run(): Promise<void> {
    const inSyncoRoot = fs.readdirSync(process.cwd()).includes('syncosaurus.json');

    ux.action.start('Checking for existing Syncosaurus installation...');

    if (inSyncoRoot) {
      ux.action.stop('found');
      this.log('🦖 Syncosaurus is already installed!');
      return;
    } else {
      ux.action.stop('...not found');
      ux.action.start('Adding Syncosaurus as a dependency...');
      await execa('npm', ['install', 'syncosaurus', '--save']);
      ux.action.stop('done!');
    }

    const projectDir = process.cwd();
    const projectName = await input({ message: 'What is the name of your project?' });

    await execa(`echo '${generateWranglerToml(projectName)}' > 'wrangler.toml'`, {
      cwd: projectDir + '/node_modules/syncosaurus/do',
      shell: true,
      stdio: 'inherit',
    });

    await execa(`echo '${generateSyncoJson(projectName)}' > 'syncosaurus.json'`, {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit',
    });

    const mutatorsInSrcDir = fs.readdirSync(`${process.cwd()}/src`).includes('mutators.js');

    this.log(`🦖 Finished! See ${chalk.yellowBright('https://github.com/synocsaurus/syncosaurus')} for more info.`);
    if (!mutatorsInSrcDir) {
      this.log('Make sure to define your mutators in /src/mutators.js');
    }
  }
}
