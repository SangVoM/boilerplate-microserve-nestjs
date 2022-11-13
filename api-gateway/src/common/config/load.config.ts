import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { isObject } from '@nestjs/common/utils/shared.utils';

const ENV_YAML = 'application.yml';
const CHARSET = 'utf8';

const load = () => {
  const configLoad = yaml.load(
    readFileSync(join(process.cwd(), ENV_YAML), CHARSET),
  );
  if (isObject(configLoad)) {
    return configLoad;
  }
  throw "Can't load application.yml";
};
export default load;
