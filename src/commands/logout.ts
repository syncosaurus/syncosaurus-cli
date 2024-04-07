import { Command } from '@oclif/core';
import { execaCommandSync } from 'execa';
import ora from 'ora';
import checkLogin from '../utils/login-check.js';

export default class Logout extends Command {
  static description = 'Logout of Syncosaurus';
  public async run(): Promise<void> {
    interface LoginResult {
      loginStatus: boolean
      email?: string
    }

    const logoutSpinner = ora('Logging out...').start();
    const loginResult: LoginResult = (await checkLogin()) as LoginResult;

    if (loginResult.loginStatus) {
      execaCommandSync(`npx wrangler logout`);

      logoutSpinner.stopAndPersist({ text: 'Logging out...done! ✅' });
      this.log('You have successfully logged out');
    } else {
      logoutSpinner.stopAndPersist({ text: 'Logging out...failed! ❌' });
      this.log('You did not successfully log out');
    }
  }
}
