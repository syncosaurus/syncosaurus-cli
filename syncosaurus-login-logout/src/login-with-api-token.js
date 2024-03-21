import inquirer from "inquirer";
import fs from "fs";

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
  writeStream.write(
    `CLOUDFLARE_ACCOUNT_ID=${cloudFlareCredentials.CLOUDFLARE_ACCOUNT_ID}\n`
  );
  writeStream.write(
    `CLOUDFLARE_API_TOKEN=${cloudFlareCredentials.CLOUDFLARE_API_TOKEN}`
  );
};

export default loginWithApiToken;
