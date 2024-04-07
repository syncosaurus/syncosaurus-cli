import { Command } from '@oclif/core';
import fs from 'node:fs';
import { execa } from 'execa';
import checkLogin from '../utils/login-check.js';

export default class Tail extends Command {
  static description = 'Setup a tail log stream for a deployed Syncosaurus worker';

  public async run(): Promise<void> {
    interface LoginResult {
      loginStatus: boolean
      email?: string
    }

    const { loginStatus } = (await checkLogin()) as LoginResult;

    if (!loginStatus) {
      this.log(`❌ You are not logged in. Run the command 'Syncosaurus login' to log in.`);
      return;
    }

    const { stdout } = await execa('ls');

    if (!stdout.includes('syncosaurus.json')) {
      this.log("Syncosaurus configuration file 'syncosaurus.json' not found.");
      this.log("Check that you are currently in the root directory of your Syncosaurus project, with a valid 'syncosaurus.json' file")
      return;
    }

    const jsonData = fs.readFileSync(process.cwd() + '/syncosaurus.json', 'utf8');
    const { projectName } = JSON.parse(jsonData);
    const tailProcess = execa('wrangler', ['tail', projectName], { shell: true, stdin: 'inherit', stdout: 'pipe' });

    try {
      await tailProcess;
    } catch (error) {
      if (error instanceof Error) {
        this.log(`❌ Unable to initialize livestream log session for your project '${projectName}'`);
        this.log(`Make sure your worker '${projectName}' is deployed, and its settings are configured correctly.`);
      }
    }
  }
}
