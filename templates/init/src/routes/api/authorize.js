/**
 * 用户鉴权模块
 * 只针对 /api 开头的URL地址鉴权
 */
import Router from 'koa-router';
import minimatch from 'minimatch';
import { prefixApi } from '../../config/app';

const router = new Router();
router.prefix(prefixApi).all('*', async (ctx, next) => {
  const { SERVER_WHITE_LIST } = process.env;
  const { ip } = ctx;
  console.log('----ctx.ip---', ip);

  const found = SERVER_WHITE_LIST.split(',').some(item => minimatch(ip.replace('::ffff:', ''), item));

  if (found) {
    await next();
  } else {
    ctx.status = 403;
  }
});

export default router;
