import { select } from "@inquirer/prompts";
import loginWithApiToken from "./src/login-with-api-token.js";
import loginWithOauth from "./src/login-with-oauth.js";
import checkLogin from "./src/login-check.js";

const loginUser = async () => {
  let loginResult = await checkLogin();
  let loginStatus = loginResult.loginStatus;
  const initialSuccessAddendum = loginStatus ? ' are already ' : ' ';

  while (!loginStatus) {
    const loginChoice = await select({
      message: "\nSelect a method to log in to Cloudflare Workers: ",
      choices: [
        {
          name: "OAuth",
          value: 1,
          description: "Log in via Oauth. You will be logging in through your browser.",
        },
        {
          name: "Account ID and API Token",
          value: 2,
          description: "Log in via account ID and API token. You will need to provide your Account ID and API token.",
        },
      ],
    });

    if (loginChoice === 1) {
      console.log("Logging in via OAuth\n");
      await loginWithOauth();
    } else {
      console.log("Logging in via Account ID and API token");
      await loginWithApiToken();
    }

    loginResult = await checkLogin();
    loginStatus = loginResult.loginStatus;

    if (!loginStatus) {
      console.log('You did not successfully log in. Please try again.\n');
    }
  }

  console.log(`\nYou${initialSuccessAddendum}successfully logged in with the email ${loginResult.email}!`);
}

loginUser();
