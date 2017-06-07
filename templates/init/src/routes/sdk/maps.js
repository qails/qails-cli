import Router from 'koa-router';
import envelope from '../../utils/response-envelope';
import { increment, timing } from '../../utils/watcher';
import { prefixSdk } from '../../config/app';
import Map from '../../models/map';
import Floor from '../../models/floor';

const router = new Router();
router.prefix(prefixSdk).get('/maps/:seq', async (ctx) => {
  const timer = new Date();

  let code = 0;
  let message = 'Success';
  let result = {};

  await Map.findOne({
    hotel_seq: ctx.params.seq,
    status: 1
  }).then(async (map) => {
    const mapId = map.id;
    result = map.mask([
      'id',
      'latlng',
      'hotelSeq',
      'hotelName',
      'hotelAddress',
      'defaultFloor',
      'maxZoom',
      'minZoom'
    ].join(','));

    // 查询关联楼层信息，因为不是通过mapId查的，所以不能使用withRelated来获得楼层关联数据
    await Floor.findAll({ map_id: mapId }).then((floors) => {
      // eslint-disable-next-line
      result.floors = floors.map((item) => {
        return {
          id: item.id,
          name: item.get('name'),
          code: item.get('code')
        };
      });
    });
  }, (error) => {
    if (error.message === 'EmptyResponse') {
      code = 404;
      message = 'Not found';
      increment('maps.detail.404');
    } else {
      console.log(error);
      code = 500;
      message = 'Internal server error';
      result = error;
      increment('maps.detail.5xx');
    }
  });
  ctx.status = 200;
  ctx.body = envelope({ code, message, result });
  increment('maps.detail.success');
  timing('maps.detail.time', timer);
});

export default router;
