import { execaCommandSync } from "execa";

const loginWithOauth = async () => {
  execaCommandSync(`npm run login`);
};

export default loginWithOauth;
