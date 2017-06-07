/**
 * 创建地图路由
 */

import Map from '../../models/map';
import Floor from '../../models/floor';
import Draft from '../../models/draft';
import ResourceRouter from '../../utils/resource';
import logMiddlewave from '../../middlewaves/log';
import { prefixApi } from '../../config/app';

// const draftRouter = ResourceRouter.define({
//   // 假设在role model中已经设定了role和user的关联关系
//   collection: (ctx) => ctx.state.map.draft(),
//   name: 'drafts',
//   setup(router) {
//     router
//       .use('/', async (ctx, next) => {
//         console.log('----matches----');
//         ctx.state.map = await Map.findById(
//           ctx.params.mapId,
//           { require: true }
//         );
//         await next();
//         ctx.body = ctx.state.map;
//       });
//       // .crud();
//   }
// });

export default ResourceRouter.define({
  collection: Map.collection(),
  name: 'maps',
  prefix: prefixApi,
  setup(router) {
    router
      .create({
        afterMiddlewaves: logMiddlewave({
          type: '新建地图'
        })
      })
      .read()
      .update({
        afterMiddlewaves: [
          logMiddlewave({
            type: '更新地图'
          }),
          async (ctx, next) => {
            const { id, status } = ctx.state.resource.attributes;
            if (status === '1') {
              // 更新草稿的状态
              let draft = null;
              await Draft.findOne({ map_id: id }).then(async (result) => {
                draft = result;
                await result.save({ status: 4 }, { patch: true });
              });

              // 草稿的geojson
              const draftGeojson = draft.toJSON().geojson;
              // 更新floor表
              // 1. 删除已有数据
              await Floor.findAll({ map_id: id }).then((floors) => {
                floors.forEach(async (floor) => {
                  await floor.destroy();
                });
              });
              // 2. 在floor表中插入新数据
              Object.keys(draftGeojson).forEach(async (key) => {
                const { name, code, frame, area, facility } = draftGeojson[key];
                await new Floor({
                  map_id: id,
                  name,
                  code,
                  frame,
                  area,
                  facility
                }).save();
              });
            }
            await next();
          }
        ]
      })
      .destroy({
        afterMiddlewaves: logMiddlewave({
          type: '删除地图'
        })
      });
      // .get('/maps/:id/drafts', (ctx, next) => {
      //   console.log('=== nest ===');
      //   ctx.body = 'ok';
      // });
      // .get('/maps/:mapId/drafts', draftRouter.routes());
  }
});
