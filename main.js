import inquirer from "inquirer";
import { select } from "@inquirer/prompts";
import loginWithApiToken from "./login-with-api-token.js";
import loginWithOauth from "./login-with-oauth.js";
import deployCounterDemoApp from "./deploy-counter-demo.js";

// login in choice => confirm login => (prompt for destination) => deploy => return URL

const loginChoice = await select({
  message: "Select a method to login to Cloudflare Workers: ",
  choices: [
    {
      name: "OAuth",
      value: 1,
      description: "Login via Oauth. You will be logging in through your browser.",
    },
    {
      name: "Account ID and API Token",
      value: 2,
      description: "Login via account ID and API token. You will need to provide your Account ID and API token.",
    },
  ],
});

switch (loginChoice) {
  case 1:
    console.log("Logging in via OAuth");
    await loginWithOauth();
    await deployCounterDemoApp();
    break;
  case 2:
    console.log("Logging in via Account ID and API token");
    await loginWithApiToken();
    await deployCounterDemoApp();
    break;
  default:
    break;
}

// TODO: Need a way to confirm valid login - wrap npx wrangler whoami pipe => on_message event handler promise
