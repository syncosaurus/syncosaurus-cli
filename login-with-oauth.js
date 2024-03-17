import { execaCommandSync } from "execa";

const loginWithOauth = async () => {
  execaCommandSync(`npx wrangler login`);
};

export default loginWithOauth;
