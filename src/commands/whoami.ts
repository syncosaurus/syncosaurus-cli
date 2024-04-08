import { Command } from '@oclif/core';
import checkLogin from '../utils/login-check.js';
import { LoginResult } from '../types.js';

export default class Whoami extends Command {
  static description = 'Check your current Syncosaurus login status';

  public async run(): Promise<void> {
    const { email, loginStatus } = (await checkLogin()) as LoginResult;
    if (loginStatus) {
      this.log(`✅ You are logged in with the email ${email}`);
    } else {
      this.log(`❌ You are not logged in`);
    }
  }
}
