const puppeteer = require('puppeteer-extra')
const pluginStealth = require('puppeteer-extra-plugin-stealth')
fs = require('fs');
const solve = require('./lib.js')

async function run () {
  puppeteer.use(pluginStealth())

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-web-security', '--disable-features=site-per-process'],
    slowMo:15
  })

  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)
  await page.goto('https://portal.ifood.com.br/login', { waitUntil: 'networkidle0' });

  await page.type('#email', "TROCAR PELO EMAIL");
  await page.type('#password', "TROCAR PELA SENHA");
  page.click('button[type=submit]');
  await sleep(15)
  await solve(page)

  const localStorage = await page.evaluate(() =>  Object.assign({}, window.localStorage));
  fs.writeFile('token.txt', localStorage.oauth_sso_token, function (err) {
    if (err) return console.log(err);
    console.log(localStorage.oauth_sso_token)
  });

}

console.log('`ctrl + c` to exit')
process.on('SIGINT', () => {
  console.log('bye!')
  process.exit()
})

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

run()
