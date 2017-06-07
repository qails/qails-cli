/**
 * 创建日志路由
 */

import Log from '../../models/log';
import ResourceRouter from '../../utils/resource';
import { prefixApi } from '../../config/app';

export default ResourceRouter.define({
  collection: Log.collection(),
  name: 'logs',
  prefix: prefixApi,
  setup(router) {
    router.read().create();
  }
});
