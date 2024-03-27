/* eslint-disable perfectionist/sort-interfaces */
import { Command } from '@oclif/core'
import { execaCommandSync } from 'execa';
import ora from 'ora';

import checkLogin from '../utils/login-check.js';

export default class Logout extends Command {
  static description = 'Login Synocosaurus through Oauth or API token';
  public async run(): Promise<void> {
    interface LoginResult {
      loginStatus: boolean,
      email?: string,
    };

    const logoutSpinner = ora("Logging out").start();
    const loginResult: LoginResult = await checkLogin() as LoginResult;

    if (loginResult.loginStatus) {
      execaCommandSync(`npm run logout`);

      logoutSpinner.stopAndPersist({
        symbol: "✅",
        text: `You successfully logged out.`,
      });
    } else {
      logoutSpinner.stopAndPersist({
        symbol: "✅",
        text: `You are already logged out!`,
      });
    }
  }
}
