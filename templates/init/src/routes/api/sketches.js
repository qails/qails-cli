/**
 * 创建草图路由
 */

import Sketch from '../../models/sketch';
import ResourceRouter from '../../utils/resource';
import envelope from '../../utils/response-envelope';
import { prefixApi } from '../../config/app';
import logMiddlewave from '../../middlewaves/log';

export default ResourceRouter.define({
  collection: Sketch.collection(),
  name: 'sketches',
  prefix: prefixApi,
  setup(router) {
    router.read()
    .create(async (ctx, next) => {
      const { draftId, floorCode, cadPic, position } = ctx.request.body;
      let code;
      let message;
      let result;

      await Sketch.upsert({
        draft_id: draftId,
        floor_code: floorCode
      }, { cad_pic: cadPic, position }).then((sketch) => {
        code = 0;
        message = 'Success';
        result = sketch;
        ctx.state.resource = result;
      }, (error) => {
        console.log(error);
        code = 1;
        message = 'Fail';
        result = error;
      });
      await next();
      ctx.status = 201;
      ctx.body = envelope({ code, message, result });
    }, {
      afterMiddlewaves: logMiddlewave({
        type: '新增或更新草图'
      })
    })
    .destroy({
      afterMiddlewaves: logMiddlewave({
        type: '删除草图'
      })
    });
  }
});
