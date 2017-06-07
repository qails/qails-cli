import Log from '../../src/models/log';

describe('日志', () => {
  describe('#create()', () => {
    it('新增日志无错误', (done) => {
      new Log().save({
        operator: 'aa',
        type: '新建地图'
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });
});
