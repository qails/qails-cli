import Floor from '../../src/models/floor';

describe('楼层', () => {
  describe('#create()', () => {
    it('新增楼层无错误', (done) => {
      new Floor({
        map_id: '10',
        name: 'F1',
        code: 'F1'
      })
      .save()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });
});
