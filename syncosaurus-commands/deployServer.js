import { $, execaCommandSync } from "execa";
import { cwd, chdir } from "node:process";
import fs from "node:fs";
import { findFile } from "../findFile.js";
import { humanId } from "human-id";
import { parse, stringify } from "smol-toml";
import config from "../syncosaurus.config.js";

const { client, server } = config;
const cmdOutput = [];
console.log(client, server);

const mutatorClientPath = findFile(client, "mutators.js");
console.log(mutatorClientPath);

execaCommandSync(`cp ${mutatorClientPath} ${server}/mutators.js`);

chdir(server);
console.log('Installing dependencies...\n');

execaCommandSync(`npm install`, (err, output) => {
  if (err) {
    console.error("could not execute command: ", err);
    return;
  }
});

//Code to overwrite first line of toml file so we can uniquely name the file
let workerId = humanId("-");
const wranglerTomlContents = fs.readFileSync(`./wrangler.toml`, "utf8");
const configObj = parse(wranglerTomlContents);
configObj.name = `${workerId}-syncosaurus`.toLowerCase(); //replace appname with our app name whenever we get there
const newToml = stringify(configObj);

fs.writeFileSync(`./wrangler.toml`, newToml);

const child = $({
  shell: true,
  cwd: process.cwd(),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
  encoding: "utf-8",
  detached: true,
})`npm run deploy`;

child.stdout.on("data", (data) => {
  cmdOutput.push(data.toString());
});

const result = await new Promise((resolve, reject) => {
  child.on("close", (_code) => {
    console.log('Deploying...');
    const deployedSnippet = "https://";
    const result = cmdOutput.find((line) => line.includes(deployedSnippet));

    if (result) {
      const url = result.trim();

      resolve({
        url,
      });
    } else {
      reject("Deployment failed");
    }
  });
});

console.log(`\nDeployed! Running at ${result.url}!`);
