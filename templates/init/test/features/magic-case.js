import { random } from 'lodash';
import assert from 'assert';
import Map from '../../src/models/map';

describe('Magic case', () => {
  describe('Camel case', () => {
    let id = null;
    it('新增记录无错误', (done) => {
      new Map().save({
        hotelSeq: 'SEQ_102',
        hotelName: '测试酒店名称',
        hotelAddress: 'xxx',
        defaultFloor: random(1, 10),
        status: random(0, 1),
        latlng: random(1, 10),
        owner: 100
      })
      .then((result) => {
        id = result.id;
        done();
      })
      .catch((err) => {
        console.log(err);
      });
    });
    it('修改记录无错误', (done) => {
      new Map({ id })
        .save({
          hotelName: '北京希尔顿酒店'
        })
        .then(() => {
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
  describe('Snake case', () => {
    const id = 20;
    it('#toJSON()', async () => {
      const map = await Map.where('id', id).fetch();
      const json = map.toJSON();
      assert.equal(true, 'hotelName' in json);
      assert.equal(false, 'hotel_name' in json);
    });
  });
});
