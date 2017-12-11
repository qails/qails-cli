import { writeFileSync } from 'fs';
import { resolve } from 'path';

require('dotenv').config();

const { NODE_ENV = 'local' } = process.env;
console.log(`[postinstall] NODE_ENV: ${NODE_ENV}`);

/**
 * 只在本地开发时通过postinstall来触发生成.env
 * 其他环境在部署的过程中会在build.sh生成.env
 */
if (NODE_ENV === 'local') {
  const dest = resolve('.env');
  writeFileSync(dest, 'NODE_ENV=local');
  console.log('[postinstall] Write .env file');
} else {
  console.log('[postinstall] Spik writing `.env` file');
}
