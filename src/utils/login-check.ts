import { $ } from 'execa'

const checkLogin = async () => {
  const cmdOutput: string[] = [];

  const child = $({
    cwd: process.cwd(),
    detached: true,
    encoding: 'utf8',
    env: process.env,
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
  })`npm run whoami`;

  child.stdout!.on('data', (data) => {
    cmdOutput.push(data.toString())
  });

  return new Promise((resolve, _reject) => {
    child.on('close', (_code) => {
      const loginSnippet = 'You are logged in';
      const result = cmdOutput.find((line) => line.includes(loginSnippet));

      if (result) {
        const email = result.slice(result.indexOf('email') + 5 - result.length - 2).trim();

        resolve({
          email,
          loginStatus: true,
        });
      } else {
        resolve({
          loginStatus: false,
        });
      }
    });
  });
}

export default checkLogin;
