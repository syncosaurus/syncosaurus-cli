import {Command} from '@oclif/core'
import {execaCommandSync} from 'execa'
import ora from 'ora'
import checkLogin from '../utils/login-check.js'
import {LoginResult} from '../types.js'

export default class Logout extends Command {
  static description = 'Logout of Syncosaurus'

  public async run(): Promise<void> {
    const logoutSpinner = ora('Logging out...').start()
    const loginResult: LoginResult = (await checkLogin()) as LoginResult

    if (loginResult.loginStatus) {
      execaCommandSync(`npx wrangler logout`)

      logoutSpinner.stopAndPersist({text: '✅ Logging out...done\n'})
      this.log('You have successfully logged out')
    } else {
      logoutSpinner.stopAndPersist({text: '❌ Logging out...failed!\n'})
      this.log('You are already logged out!')
    }
  }
}
