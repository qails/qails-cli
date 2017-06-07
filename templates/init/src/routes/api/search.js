import Router from 'koa-router';
import Map from '../../models/map';
import envelope from '../../utils/response-envelope';
import { prefixApi } from '../../config/app';

const router = new Router();
router.prefix(prefixApi).get('/search/maps', async (ctx) => {
  const {
    hotelName,
    draftStatus,
    status,
    id,
    owner
  } = ctx.query;

  // 获取分页参数
  const pageParams = {};
  ['page', 'pageSize', 'offset', 'limit'].forEach((key) => {
    if (key in ctx.query) {
      pageParams[key] = parseInt(ctx.query[key], 10);
    }
  });

  let result = [];
  await Map
    .query((qb) => {
      if (draftStatus) {
        qb.innerJoin('drafts', 'maps.id', 'drafts.map_id');
        qb.where('drafts.status', '=', draftStatus);
      }
      if (id) {
        qb.where('id', id);
      }
      if (owner) {
        qb.where('owner', owner);
      }
      if (status) {
        qb.where('status', status);
      }
      if (hotelName) {
        qb.whereRaw('(hotel_name like ? or hotel_seq like ?)', [
          `%${hotelName}%`,
          `%${hotelName}%`
        ]);
      }
      qb.orderBy('id', 'desc');
    })
    // eslint-disable-next-line
    [Object.keys(pageParams).length > 0 ? 'fetchPage' : 'fetchAll']({
      withRelated: ['draft'],
      ...pageParams
    })
    .then((data) => {
      result = {
        pagination: data.pagination,
        list: data.toJSON()
      };
    });

  ctx.body = envelope({
    code: 0,
    message: 'success',
    result
  });
});

export default router;
