import { Command, ux } from '@oclif/core';
import { execa } from 'execa';
import { input } from '@inquirer/prompts';
import path from 'node:path';
import { generateSyncoJson, generateWranglerToml } from '../utils/configs.js';

export default class Init extends Command {
  static description = 'Create a new React app, preconfigured with a Syncosaurus multiplayer backend'

  public async run(): Promise<void> {
    this.log('🦖 Creating a new Syncosaurus backed React app!');

    let projectName = await input({ message: 'What is the name of your project?' });
    let { stdout:lsStdout } = await execa('ls');

    while (lsStdout.includes(projectName)) {
      this.log(`❌ A directory with the name of '${projectName}' already exists. Try again with a different name.\n`);
      projectName = await input({ message: 'What is the name of your project?' });
      lsStdout = (await execa('ls')).stdout;
    }

    await this.createViteProject(projectName);
    await this.integrateSyncosaurus(projectName);
    await this.copyTemplate(projectName);

    this.log(`
    Done! Now run:

      cd ${projectName}
      npm install
      npx syncosaurus dev\n`);
  }

  private async createViteProject(projectName: string) {
    ux.action.start('🧙 Engaging dino wizardry to scaffold your project');

    const createVite = execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react'], {
      stdin: 'inherit',
    });

    await createVite;
    ux.action.stop('finished!');
  }

  private async integrateSyncosaurus(projectName: string) {
    const projectDir = process.cwd() + '/' + projectName;

    ux.action.start('🦖 ↔️ 🦖 Setting up inter-syncosaurus communication channels');
    await execa('npm', ['install', 'syncosaurus'], {
      cwd: projectDir,
    });

    // Create the syncosaurus config file
    await execa(`echo '${generateSyncoJson(projectName)}' > 'syncosaurus.json'`, {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit',
    });

    // Create new project's wrangler.toml file
    await execa(`echo '${generateWranglerToml(projectName)}' > 'wrangler.toml'`, {
      cwd: projectDir + '/node_modules/syncosaurus/do',
      shell: true,
      stdio: 'inherit',
    });

    ux.action.stop("everybody's talking now!")
  }

  private async copyTemplate(projectName: string) {
    const projectDir = process.cwd() + '/' + projectName + '/src'
    const dirName = path.dirname(new URL(import.meta.url).pathname)
    const templateDir = path.join(dirName, '../templates/vite-demo/src/*')

    await execa('cp', ['-r', templateDir, projectDir], { shell: true })
  }
}
