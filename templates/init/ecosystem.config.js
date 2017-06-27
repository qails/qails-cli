require('dotenv').config();
const pkg = require('./package.json');

const {
  DOCUMENT_ROOT,
  LOG_ROOT,
  PM2_EXEC_INTERPRETER,
  PM2_EXEC_MODE,
  PM2_INSTANCES,
  PM2_WATCH
} = process.env;

if (!DOCUMENT_ROOT) {
  console.log(`Not find .env at ${__dirname}`);
  process.exit(1);
}

module.exports = {
  apps: [
    {
      name: pkg.name,
      script: `${DOCUMENT_ROOT}/index.js`,
      exec_interpreter: PM2_EXEC_INTERPRETER,
      exec_mode: PM2_EXEC_MODE,
      instances: PM2_INSTANCES,
      log_file: `${LOG_ROOT}/combined.outerr.log`,
      error_file: `${LOG_ROOT}/err.log`,
      out_file: `${LOG_ROOT}/out.log`,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm',
      watch: PM2_WATCH === 'true',
      ignore_watch: ['.git', 'node_modules', LOG_ROOT]
    }
  ]
};
