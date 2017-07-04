import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

require('dotenv').config();

const { NODE_ENV = 'local' } = process.env;
console.log(`[postinstall] NODE_ENV: ${NODE_ENV}`);

// 只在本地开发时通过postinstall来触发dotenv的复制
// 其他环境在部署的过程中会在build.sh中复制dotenv
if (NODE_ENV === 'local') {
  const dest = resolve('.env');
  const src = resolve(process.cwd(), `src/profiles/.env.${NODE_ENV}`);

  console.log(`[postinstall] Copy dotenv file: ${src} ---> ${dest}`);
  writeFileSync(dest, readFileSync(src));
} else {
  console.log('[postinstall] Ignore dotenv copy');
}
