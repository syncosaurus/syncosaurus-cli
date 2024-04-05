import { Command } from '@oclif/core'
import { execa, ExecaChildProcess } from 'execa'
import ora from 'ora';
import checkLogin from "../utils/login-check.js";

export default class Dashboard extends Command {
  static description = 'Install and run the Syncosaurus analytics dashboard';

  public async run(): Promise<void> {
    interface LoginResult {
      loginStatus: boolean
      email?: string
    }

    const loginResult: LoginResult = (await checkLogin()) as LoginResult;
    const { loginStatus } = loginResult;

    if (!loginStatus) {
      this.log("You are not currently logged in. Log in with the command 'syncosaurus login'");
      return;
    }

    // Final repo link: 'https://github.com/syncosaurus/analytics-dashboard.git'
    const dashboardRepoURI = 'https://github.com/syncosaurus/syncosaurus-analytics.git';
    const installCheck = ora('Checking for Syncosaurus dashboard...').start();

    try {
      const { stdout } = await execa('ls');

      if (!stdout.includes('syncosaurus-analytics')) {
        installCheck.stopAndPersist({
          text: `No Syncosaurus dashboard installation found`,
        });
        const cloneAndInstall = ora('Installing Syncosaurus dashboard...').start();
        await execa('git', ['clone', '-b', 'bar-charts-with-d3', dashboardRepoURI]);

        await execa('npm', ['install'], {
          cwd: `${process.cwd()}/syncosaurus-analytics/analytics-backend`,
        });
        cloneAndInstall.stopAndPersist({
          symbol: '✅',
          text: `Syncosaurus dashboard successfully installed`,
        });
      } else {
        installCheck.stopAndPersist({
          symbol: '✅',
          text: `Syncosaurus dashboard installation found`,
        });
      }

      const keyPhrase = 'Analytics ready at';

      const child: ExecaChildProcess<string> | null = execa(`npm start`, {
        shell: true,
        cwd: `${process.cwd()}/syncosaurus-analytics/analytics-backend`,
        env: process.env,
        stdio: ['inherit', 'pipe', 'pipe'],
        encoding: 'utf8',
        detached: true,
      });

      child.stdout!.on('data', (data) => {
        if (data.toString().includes(keyPhrase)) {
          console.log(data.toString());
        }
      });

      child.stderr!.on('data', (data) => {
        // console.error(data.toString());
      });

      child!.on("close", (_code) => {
        console.log('child process closed');
      });

      // Current bug: This child process will regularly hang
      await child;
      process.exit(1);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  }
}
