import { Command } from '@oclif/core';
import confirm from '@inquirer/confirm'
import { execa } from 'execa';
import { input } from '@inquirer/prompts';
import path from 'node:path';
import { generateSyncoJson, generateWranglerToml } from '../utils/configs.js';
import ora from 'ora';

export default class Init extends Command {
  static description = 'Create a new React app, preconfigured with a Syncosaurus multiplayer backend'

  public async run(): Promise<void> {
    this.log('🦖 Creating a new Syncosaurus backed React app!');

    let projectName = await input({ message: 'What is the name of your project?' });
    let { stdout: lsStdout } = await execa('ls');

    while (lsStdout.includes(projectName)) {
      this.log(`❌ A directory with the name of '${projectName}' already exists. Try again with a different name.\n`);
      projectName = await input({ message: 'What is the name of your project?' });
      lsStdout = (await execa('ls')).stdout;
    }

    const cliChoiceAnswer = await confirm({ message: 'Do you want to install the Syncosaurus CLI tool?' });

    const syncoIntegration = ora('🦖 ↔️ 🦖 Setting up inter-syncosaurus communication channels...').start();

    await this.createViteProject(projectName);
    await this.integrateSyncosaurus(projectName);
    await this.copyTemplate(projectName);

    syncoIntegration.stopAndPersist({
      text: "🦖 ↔️ 🦖 Setting up inter-syncosaurus communication channels...everybody's talking now!"
    });

    // install Syncosaurus CLI application only if user confirms AND it is not installed yet
    const { stdout: syncoCliStdout } = await execa('npm', ['list', '-g'], { cwd: `${process.cwd()}/${projectName}` });

    if (!syncoCliStdout.includes('syncosaurus-cli') && cliChoiceAnswer) {
        const cliInstall = ora('🤖 Installing Syncosaurus CLI tool...').start();

        await execa('npm', ['install', '-g', 'syncosaurus-cli'], {
          cwd: `${process.cwd()}/${projectName}`
        });

        cliInstall.stopAndPersist({ text: "🤖 Installing Syncosaurus CLI tool...complete!" });
    }

    this.log(`
    All done! Now run:

      cd ${projectName}
      npx syncosaurus dev\n`);
  }

  private async createViteProject(projectName: string) {
    const viteProjectCreation = ora('🧙 Engaging dino wizardry to scaffold your project...').start();

    await execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react'], {
      stdin: 'inherit',
    });

    viteProjectCreation.stopAndPersist({
      text: `🧙 Engaging dino wizardry to scaffold your project...done!`,
    });
  }

  private async integrateSyncosaurus(projectName: string) {
    const projectDir = process.cwd() + '/' + projectName;

    // Create the syncosaurus config file
    await execa(`echo '${generateSyncoJson(projectName)}' > 'syncosaurus.json'`, {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit',
    });

    // copy vite template and install syncosaurus + necessary dependencies
    await this.copyTemplate(projectName);
    await execa('npm', ['ci'], {
      cwd: projectDir,
    });

    await execa('npm', ['install', 'syncosaurus'], {
      cwd: projectDir,
    });

    // Create new project's wrangler.toml file
    await execa(`echo '${generateWranglerToml(projectName)}' > 'wrangler.toml'`, {
      cwd: projectDir + '/node_modules/syncosaurus/do',
      shell: true,
      stdio: 'inherit',
    });
  }

  private async copyTemplate(projectName: string) {
    const projectDir = process.cwd() + '/' + projectName;
    const dirName = path.dirname(new URL(import.meta.url).pathname)
    const templateDir = path.join(dirName, '../templates/vite-template/*')

    await execa('cp', ['-r', templateDir, projectDir], { shell: true })
  }
}
