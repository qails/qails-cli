import Router from 'koa-router';
import envelope from '../../utils/response-envelope';
import { increment, timing } from '../../utils/watcher';
import { prefixSdk } from '../../config/app';
import Floor from '../../models/floor';

const router = new Router();
router.prefix(prefixSdk).get('/floors/:id', async (ctx) => {
  const id = ctx.params.id;
  const timer = new Date();
  let code = 0;
  let message = 'Success';
  let result = {};

  await Floor.findById(id).then((floor) => {
    result = floor.mask([
      'id',
      'name',
      'code',
      'frame',
      'area',
      'facility',
      'mapId'
    ].join(','));
  }, (error) => {
    if (error.message === 'EmptyResponse') {
      code = 404;
      message = 'Not found';
      increment('floors.detail.404');
    } else {
      console.log(error);
      code = 500;
      message = 'Internal server error';
      result = error;
      increment('floors.detail.5xx');
    }
  });
  ctx.status = 200;
  ctx.body = envelope({ code, message, result });
  increment('floors.detail.success');
  timing('floors.detail.time', timer);
});

export default router;
