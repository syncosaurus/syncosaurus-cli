import inquirer from "inquirer";
import fs from "fs";
import { execaCommandSync } from "execa";

const loginWithApiToken = async () => {
  const cloudFlareCredentials = await inquirer.prompt([
    {
      name: "CLOUDFLARE_ACCOUNT_ID",
      message: "What is your Cloudflare Account ID?",
    },
    {
      name: "CLOUDFLARE_API_TOKEN",
      message: "What is your CloudFlare API Token?",
    },
  ]);

  const writeStream = fs.createWriteStream(".env");
  writeStream.write(`CLOUDFLARE_ACCOUNT_ID=${cloudFlareCredentials.CLOUDFLARE_ACCOUNT_ID}\n`);
  writeStream.write(`CLOUDFLARE_API_TOKEN=${cloudFlareCredentials.CLOUDFLARE_API_TOKEN}`);

  // 'whoami' command to check for valid cloudflare login
  execaCommandSync('npm run whoami', { stdio: 'inherit' }, (err, output) => {
    if (err) {
      console.error("could not execute command: ", err);
      return;
    }

    // console.log("Output: \n", output)
  });

  // const projectName = await inquirer.prompt([
  //   {
  //     name: "HELLO_WORLD_DIR_NAME",
  //     message: "What is the name of your directory?",
  //   }
  // ])

  // // this is a placeholder for backend deployment
  // execSync(`git clone https://github.com/cloudflare/durable-objects-template.git ${projectName.HELLO_WORLD_DIR_NAME} `, { stdio: 'inherit' }, (err) => {
  //   if (err) {
  //     console.error("could not execute command: ", err);
  //     return;
  //   }
  // });

  // // Need to ensure that the name of the worker has to be unique on your account
  // // The name of the worker is located in the `wrangler.toml` file, after `name=`
  // execSync(`cd ${projectName.HELLO_WORLD_DIR_NAME} && npm install`, { stdio: 'inherit' }, (err, output) => {
  //   if (err) {
  //     console.error("could not execute command: ", err);
  //     return;
  //   }
  // });

  // // Get list of all existing workers to check for collisions, but need to correct to use global API key and users email as headers - see postman
  // // Docs: https://developers.cloudflare.com/api/operations/worker-script-list-workers
  // let response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudFlareCredentials.CLOUDFLARE_ACCOUNT_ID}/workers/scripts`, {
  //   headers: {
  //     'X-Auth-Key': `${cloudFlareCredentials.CLOUDFLARE_API_TOKEN}`,
  //     'Content-Type': 'application/json'
  //   }
  // });
  // let workersList = await response.json();

  // console.log(workersList);
}

export default loginWithApiToken;
