import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as readline from 'readline';
import { HashService } from '../src/common/encryption/hash.service';

async function confirmOverride(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const promiseAnswer = () =>
    new Promise<boolean>((resolve, reject) => {
      try {
        rl.question(
          'The token already exists. Do you want to overwrite it? (Y/n): ',
          (answer) => {
            answer === 'Y' ? resolve(true) : resolve(false);
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  return await promiseAnswer();
}

const pathFile = join(process.cwd(), 'application.yml');

function writeToke(config, token, plainText) {
  config['auth']['iotToken'] = token;
  config['auth']['iotPlainText'] = plainText;
  const yamlStr = yaml.safeDump(config);
  fs.writeFileSync(pathFile, yamlStr, 'utf8');
}

(async () => {
  try {
    const fileContents = fs.readFileSync(pathFile, 'utf8');
    const data = yaml.safeLoad(fileContents);
    const hashService = new HashService();
    const strRandom = Math.random().toString(36).substring(7);
    const token = hashService.make(strRandom);
    if (data['auth']['iotToken']) {
      if (await confirmOverride()) {
        writeToke(data, token, strRandom);
      } else process.exit();
    } else {
      writeToke(data, token, strRandom);
    }
    console.log(token);
    process.exit();
  } catch (e) {
    throw e;
    throw "Can't load application.yml";
  }
})();
