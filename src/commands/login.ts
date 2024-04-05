import { select } from '@inquirer/prompts'
import { Command, ux } from '@oclif/core'
import { execaCommandSync } from 'execa'
import ora from 'ora'
import fs from 'node:fs'
import checkLogin from '../utils/login-check.js'

export default class Login extends Command {
  static description = 'Login to Synocosaurus through Oauth or API token'

  public async run(): Promise<void> {
    interface LoginResult {
      loginStatus: boolean
      email?: string
    }

    let loginResult: LoginResult = (await checkLogin()) as LoginResult
    let { loginStatus, email } = loginResult
    let loginSpinner

    if (loginStatus) {
      this.log(`You are already logged in with the email ${email}`);
    }

    while (!loginStatus) {
      const loginChoice = await select({
        message: '\nSelect a method to log in to Cloudflare Workers: ',
        choices: [
          {
            name: 'OAuth',
            value: 1,
            description: 'Log in via Oauth. You will be logging in through your browser.',
          },
          {
            name: 'Account ID and API Token',
            value: 2,
            description: 'Log in via account ID and API token. You will need to provide your Account ID and API token.',
          },
        ],
      })

      if (loginChoice === 1) {
        loginSpinner = ora('Logging in via OAuth\n').start()
        execaCommandSync(`npx wrangler login`)
      } else {
        loginSpinner = ora('Logging in via Account ID and API token').start()
        const accountId = await ux.prompt('What is your Cloudflare Account ID?', { type: 'mask' })
        const apiToken = await ux.prompt('What is your CloudFlare API Token?', { type: 'mask' })
        const writeStream = fs.createWriteStream('.env')
        writeStream.write(`CLOUDFLARE_ACCOUNT_ID=${accountId}\n`)
        writeStream.write(`CLOUDFLARE_API_TOKEN=${apiToken}`)
      }

      loginResult = (await checkLogin()) as LoginResult
      loginStatus = loginResult.loginStatus

      if (!loginStatus) {
        loginSpinner.fail('You did not successfully log in. Please try again.\n')
      } else {
        loginSpinner.stopAndPersist({
          symbol: '✅',
          text: `You successfully logged in with the email ${loginResult.email}!`,
        })
      }
    }
  }
}
