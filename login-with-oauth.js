import { execaSync } from "execa";

const loginWithOauth = async () => {
  execaSync(`npx wrangler login`);
};

export default loginWithOauth;
