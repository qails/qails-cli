/**
 * 创建楼层路由
 */

import Floor from '../../models/floor';
import ResourceRouter from '../../utils/resource';
import { prefixApi } from '../../config/app';

export default ResourceRouter.define({
  collection: Floor.collection(),
  name: 'floors',
  prefix: prefixApi
});
