import { resolve } from 'path';
import {
  Qails,
  accessLogMiddleware,
  bodyParserMiddleware,
  prettyJsonMiddleware,
  serveMiddleware,
  pug
} from 'qails';

const { PORT, LOG_ROOT, NODE_ENV } = process.env;
const app = new Qails([
  accessLogMiddleware({
    root: resolve(LOG_ROOT)
  }),
  bodyParserMiddleware(/* options here */),
  prettyJsonMiddleware({
    pretty: NODE_ENV === 'local'
  }),
  serveMiddleware()
]);
pug(app, { viewPath: './templates/pages' });

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`✅ qails listening on port ${PORT}`);
});
