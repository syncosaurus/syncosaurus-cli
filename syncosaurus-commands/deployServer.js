import { $, execaCommandSync } from "execa";
import { cwd, chdir } from "node:process";
import fs from "node:fs";
import { findFile } from "../utils/findFile.js";
import { humanId } from "human-id";
import { parse, stringify } from "smol-toml";
import ora from "ora";
import config from "../syncosaurus.config.js";

const { client, server } = config;
const cmdOutput = [];

const mutatorClientPath = findFile(client, "mutators.js");

execaCommandSync(`cp ${mutatorClientPath} ${server}/mutators.js`);

chdir(server);
const deploymentSpinner = ora("Deploying...").start();

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

deploymentSpinner.stopAndPersist({
  symbol: "✅",
  text: `Deployed! \nRunning at ${result.url}!`,
});
