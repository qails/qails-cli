import { resolve } from 'path';
import {
  Qails,
  accessLogMiddleware,
  bodyParserMiddleware,
  prettyJsonMiddleware,
  pug,
  requireAllRouters
} from 'qails';

const { PORT, LOG_ROOT, NODE_ENV } = process.env;
const app = new Qails([
  accessLogMiddleware({
    root: resolve(LOG_ROOT)
  }),
  bodyParserMiddleware(/* options here */),
  prettyJsonMiddleware({
    pretty: NODE_ENV === 'local'
  })
]);
pug(app, { viewPath: './templates/pages' });
requireAllRouters(app);

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`✅ qails listening on port ${PORT}`);
});
