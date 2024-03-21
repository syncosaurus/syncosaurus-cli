import checkLogin from "./src/login-check.js";
import { execaCommandSync } from "execa";
import ora from "ora";

const logoutUser = async () => {
  const logoutSpinner = ora("Logging out").start();
  const loginResult = await checkLogin();

  if (loginResult.loginStatus) {
    execaCommandSync(`npm run logout`, (err, output) => {
      if (err) {
        console.error("could not execute command: ", err);
        return;
      }
    });

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
};

logoutUser();
