import {Command, ux} from '@oclif/core'
import {execa} from 'execa'

export default class Dashboard extends Command {
  static description = 'Install the Syncosaurus dashboard.'

  public async run(): Promise<void> {
    const {stdout} = await execa('ls')

    if (stdout.includes('analytics-dashboard')) {
      this.log('🦖 Analytics dashboard already installed!')
      this.logEndMessage()
      return
    }

    ux.action.start('🦖 Cloning the analytics dashboard repo')
    await execa('git', ['clone', 'https://github.com/syncosaurus/analytics-dashboard.git'], {
      shell: true,
    })

    await execa('npm install', {cwd: process.cwd() + '/analytics-dashboard', shell: true})
    ux.action.stop('done!')
    this.logEndMessage()
  }

  private logEndMessage() {
    this.log(`Dashboard installed.
    
  Run:

  cd analytics-dashboard
  npm start\n`)
  }
}
