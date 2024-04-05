import { Command, ux } from '@oclif/core'
import { execa } from 'execa'

export default class Dashboard extends Command {
  static description = 'Install the Syncosaurus dashboard.'

  public async run(): Promise<void> {
    // Final repo link: 'https://github.com/syncosaurus/analytics-dashboard.git'
    const dashboardRepoURI = 'https://github.com/syncosaurus/syncosaurus-analytics.git';
    let { stdout } = await execa('ls')

    ux.action.start('Installing Syncosaurus dashboard...')

    if (!stdout.includes('syncosaurus-analytics')) {
      // this.log('🦖 Analytics dashboard already installed!')
      // this.logEndMessage()

      await execa('git', ['clone', '-b', 'bar-charts-with-d3', dashboardRepoURI], {
        shell: true,
      })
    }

    // await execa('cd', ['../syncosaurus-analytics/analytics-backend'], { shell: true });
    stdout = (await execa('ls', { cwd: process.cwd() + '/syncosaurus-analytics/analytics-backend', shell: true })).stdout;
    console.log(stdout);
    if (!stdout.includes('node_modules')) {
      await execa('npm install', { cwd: process.cwd() + '/syncosaurus-analytics/analytics-backend', shell: true });
    }

    ux.action.stop('done! 🦖!')

    await execa('npm run start', { cwd: process.cwd() + '/syncosaurus-analytics/analytics-backend', shell: true, stdio: 'inherit' });
  }
}

// private logEndMessage() {
//   this.log(`Dashboard installed.

// Run:

// cd analytics-dashboard
// npm start\n`)
// }

