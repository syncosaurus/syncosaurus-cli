// login via Oauth and puppeteer
// 03_10_24 => Getting into Captcha Evasion strategies, this is likely not the way
import { spawn } from "node:child_process";
import puppeteer from "puppeteer-extra";
import inquirer from "inquirer";
import fs from "fs";
import { executablePath } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const CF_WORKERS_AUTH_PATH = "https://dash.cloudflare.com/oauth2";
let cfLoginUrl;

const child = spawn("npx wrangler login --browser false", {
  shell: true,
  cwd: process.cwd(),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
  encoding: "utf-8",
  detached: true,
});

await new Promise((resolve, reject) => {
  child.stdout.on("data", (data) => {
    const str = data.toString();

    if (str.includes(CF_WORKERS_AUTH_PATH)) {
      cfLoginUrl = str.slice(str.indexOf(CF_WORKERS_AUTH_PATH)).trim();
      resolve();
    }
  });
});

spawn('open', [cfLoginUrl]);

// terminate child process
// process.kill(-child.pid, "SIGKILL");

// Await User login Input
const cloudFlareCredentials = await inquirer.prompt([
  {
    name: "CLOUDFLARE_EMAIL",
    message: "What is your Cloudflare Account Email?",
  },
  {
    name: "CLOUDFLARE_PASSWORD",
    message: "What is your CloudFlare Account Password?",
  },
]);

// Write CF email and password to '.env'
const writeStream = fs.createWriteStream(".env");
writeStream.write(`CLOUDFLARE_EMAIL=${cloudFlareCredentials.CLOUDFLARE_EMAIL}\n`);
writeStream.write(`CLOUDFLARE_PASSWORD=${cloudFlareCredentials.CLOUDFLARE_PASSWORD}`);

// Execute browser Oauth login flow with puppeteer
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: executablePath(), targetFilter: (target) => !!target.url });
  const page = await browser.newPage();
  await page.goto(cfLoginUrl);
  await page.waitForSelector('#email', { visible: true, timeout: 0 });
  await page.type('#email', cloudFlareCredentials.CLOUDFLARE_EMAIL);
  await page.type('#password', cloudFlareCredentials.CLOUDFLARE_PASSWORD);
  await page.click('button[type="submit"]');

  await page.screenshot({ path: "./screenshot.jpg" });

  const allowButtonSelector = 'button[data-testid="oauth-consent-form-allow-button"]';

  await page.waitForSelector(allowButtonSelector, { visible: true, timeout: 0 });
  await page.screenshot({ path: "./screenshot2.jpg" });
  await page.click(allowButtonSelector);
  await page.screenshot({ path: "./screenshot3.jpg" });

  await new Promise((resolve, reject) => {
    child.stdout.on("close", (data) => {
      console.log(data);
      process.kill(-child.pid, "SIGKILL");
      resolve();
    });
  });

  await browser.close();
})();
