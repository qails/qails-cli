import { join } from 'path';
import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import qs from 'koa-qs';
import morgan from 'koa-morgan';
import FileStreamRotator from 'file-stream-rotator';
import mkdirp from 'mkdirp';
import { path } from './config/app';
import appendRoutes from './utils/setup-routes';

const cwd = process.cwd();
const { PORT, JSON_PRETTY, NODE_ENV } = process.env;

// 创建日志目录
const logDir = join(cwd, path.logs);
mkdirp.sync(logDir);

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: `${logDir}/access__%DATE%.log`,
  frequency: 'daily',
  verbose: false
});

const app = new Koa();
qs(app);
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser());
app.use(json({ pretty: JSON_PRETTY === 'true' }));
appendRoutes(app, join(__dirname, 'routes'));

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`✅ koa listening on port ${PORT}`);
  console.log(`NODE_ENV=${NODE_ENV}`);
});
