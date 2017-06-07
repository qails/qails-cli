require('dotenv').config();
const pkg = require('./package.json');
const conf = require('./src/config/app');

const {
  DOCUMENT_ROOT,
  PM2_EXEC_INTERPRETER,
  PM2_EXEC_MODE,
  PM2_INSTANCES,
  PM2_WATCH
} = process.env;

module.exports = {
  apps: [
    {
      name: pkg.name,
      script: `${DOCUMENT_ROOT}/index.js`,
      exec_interpreter: PM2_EXEC_INTERPRETER,
      exec_mode: PM2_EXEC_MODE,
      instances: PM2_INSTANCES,
      log_file: `${conf.path.logs}/combined.outerr.log`,
      error_file: `${conf.path.logs}/err.log`,
      out_file: `${conf.path.logs}/out.log`,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm',
      watch: PM2_WATCH === 'true',
      ignore_watch: ['.git', 'node_modules', conf.path.logs, conf.path.dist]
    }
  ]
};
