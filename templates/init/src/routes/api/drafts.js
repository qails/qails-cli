/**
 * 创建草稿路由
 */

import Draft from '../../models/draft';
import ResourceRouter from '../../utils/resource';
import envelope from '../../utils/response-envelope';
import { snake } from '../../utils/magic-case';
import { prefixApi } from '../../config/app';
import logMiddlewave from '../../middlewaves/log';

export default ResourceRouter.define({
  collection: Draft.collection(),
  name: 'drafts',
  prefix: prefixApi,
  setup(router) {
    router
      .get('/drafts/:id/sync',
        async (ctx, next) => {
          const id = ctx.params.id;
          const withRelated = 'map.floors';
          let draft = null;
          let draftModel = null;
          await Draft.findById(id, { withRelated }).then((result) => {
            ctx.state.resource = result;
            draftModel = result;
            draft = draftModel.toJSON();
          });
          const geojson = {};
          draft.map.floors.forEach((floor) => {
            const { name, code, frame, area, facility } = floor;
            geojson[code] = { name, code, frame, area, facility };
          });
          await draftModel.save({ geojson }).then((result) => {
            const d = result.toJSON();
            delete d.map;
            ctx.body = envelope({
              code: 0,
              message: 'Success',
              result: draft
            });
          }, (error) => {
            ctx.body = envelope({
              code: 1,
              message: 'Fail',
              result: error
            });
          });

          await next();
        },
        logMiddlewave({
          type: '同步草稿'
        })
      )
      .create(async (ctx, next) => {
        const { mapId } = ctx.request.body;
        ctx.state.resource = await Draft.upsert({
          map_id: mapId
        }, snake(ctx.request.body));

        await next();

        ctx.status = 201;
        ctx.body = envelope({
          code: 0,
          message: 'Success',
          result: ctx.state.resource
        });
      }, {
        afterMiddlewaves: logMiddlewave({
          type: '新增或更新草稿'
        })
      })
      .read()
      .destroy({
        afterMiddlewaves: logMiddlewave({
          type: '删除草稿'
        })
      });
  }
});
