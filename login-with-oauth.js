import { execSync } from "node:child_process";

const loginWithOauth = async () => {
  execSync(`npx wrangler login`);
};

export default loginWithOauth;
