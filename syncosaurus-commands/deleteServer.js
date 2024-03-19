import { execaCommandSync } from "execa";
import { cwd, chdir } from "node:process";
import config from "../syncosaurus.config.js";

const { server } = config;
chdir(server);

execaCommandSync(`npm run delete`, { stdio: "inherit" }, (err, output) => {
  if (err) {
    console.error("could not execute command: ", err);
    return;
  }
});
