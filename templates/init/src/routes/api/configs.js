/**
 * 创建配置路由
 */

import { groupBy, camelCase } from 'lodash';
import Config from '../../models/config';
import ResourceRouter from '../../utils/resource';
import envelope from '../../utils/response-envelope';
import { prefixApi } from '../../config/app';

function abc(a) {
  return camelCase(a.group);
}

function format(data) {
  const groups = groupBy(data, abc);
  Object.keys(groups).forEach((item) => {
    const newOption = {};
    groups[item].forEach((option) => {
      newOption[option.key] = option.text;
    });
    groups[item] = newOption;
  });
  return groups;
}


export default ResourceRouter.define({
  collection: Config.collection(),
  name: 'configs',
  prefix: prefixApi,
  setup(router) {
    router.get('/configs', async (ctx, next) => {
      let configs;
      await Config.findAll().then((result) => {
        configs = result;
      });

      await next();

      ctx.body = envelope({
        code: 0,
        message: 'Success',
        result: format(configs.toJSON())
      });
    });
  }
});
