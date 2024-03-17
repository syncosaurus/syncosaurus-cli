import { $ } from "execa";

const checkLogin = async () => {
  const cmdOutput = [];

  const child = $({
    shell: true,
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
    encoding: "utf-8",
    detached: true,
  })`npm run whoami`;

  child.stdout.on("data", (data) => {
    cmdOutput.push(data.toString());
  });

  return await new Promise((resolve, reject) => {
    child.on("close", (_code) => {
      const loginSnippet = "You are logged in with an API Token";
      let result = cmdOutput.find((line) => line.includes(loginSnippet));

      if (result) {
        const email = result
          .slice(result.indexOf("email") + 5, result.length - 2)
          .trim();

        resolve({
          loginStatus: true,
          email,
        });
      } else {
        resolve({
          loginStatus: false,
        });
      }
    });
  });
};

export default checkLogin;
