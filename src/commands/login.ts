import {select} from '@inquirer/prompts'
import {Command, ux} from '@oclif/core'
import {execaCommandSync} from 'execa'
import fs from 'node:fs'
import checkLogin from '../utils/login-check.js'
import {LoginResult} from '../types.js'

export default class Login extends Command {
  static description = 'Login to Synocosaurus through Oauth or API token'

  public async run(): Promise<void> {
    let loginResult: LoginResult = (await checkLogin()) as LoginResult
    let {loginStatus, email} = loginResult

    if (loginStatus) {
      this.log(`You are already logged in with the email ${email}`)
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
        ux.action.start('Logging in via OAuth...')
        execaCommandSync(`npx wrangler login`)
      } else {
        ux.action.start('Logging in via Account ID and API token...')
        const accountId = await ux.prompt('What is your Cloudflare Account ID?', {type: 'mask'})
        const apiToken = await ux.prompt('What is your CloudFlare API Token?', {type: 'mask'})
        const writeStream = fs.createWriteStream('.env')
        writeStream.write(`CLOUDFLARE_ACCOUNT_ID=${accountId}\n`)
        writeStream.write(`CLOUDFLARE_API_TOKEN=${apiToken}`)
      }

      loginResult = (await checkLogin()) as LoginResult
      loginStatus = loginResult.loginStatus

      if (!loginStatus) {
        ux.action.stop('Unable to login. Please try again.')
      } else {
        ux.action.stop('success')
        this.log(`✅ You successfully logged in with the email ${loginResult.email}!`)
      }
    }
  }
}
