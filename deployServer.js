import { execaCommandSync } from "execa";
import { cwd, chdir } from "node:process";
import { findFile } from "./findFile.js";
import humanId from "human-id";
import { parse, stringify } from "smol-toml";
import config from "./syncosaurus.config.js";

const { client, server } = config;
// console.log(client, server);

const mutatorClientPath = findFile(client, "mutators.js");
console.log(mutatorClientPath);

execaCommandSync(`cp ${mutatorClientPath} ${server}/mutators.js`);

chdir(server);
// console.log(cwd());

execaCommandSync(`npm install`, { stdio: "inherit" }, (err, output) => {
  if (err) {
    console.error("could not execute command: ", err);
    return;
  }
});

//Code to overwrite first line of toml file so we can uniquely name the file
let workerId = humanId("-");
const wranglerTomlContents = fs.readFileSync(
  `./${projectName.HELLO_WORLD_DIR_NAME}/wrangler.toml`,
  "utf8"
);
const configObj = parse(wranglerTomlContents);
configObj.name = `appname-${workerId}`.toLowerCase(); //replace appname with our app name whenever we get there
const newToml = stringify(configObj);
fs.writeFileSync(
  `./${projectName.HELLO_WORLD_DIR_NAME}/wrangler.toml`,
  newToml
);

execaCommandSync(`npm run deploy`, { stdio: "inherit" }, (err, output) => {
  if (err) {
    console.error("could not execute command: ", err);
    return;
  }
});
