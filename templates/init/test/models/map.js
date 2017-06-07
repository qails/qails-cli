import { random } from 'lodash';
import Map from '../../src/models/map';

describe('地图', () => {
  let id = null;
  describe('#create()', () => {
    it('新增地图无错误', (done) => {
      new Map().save({
        hotel_seq: 'SEQ_101',
        hotel_name: '测试酒店名称',
        hotel_address: '朝阳区潘家园华威里28号',
        default_floor: random(1, 10),
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
  });
  describe('#update()', () => {
    it('修改地图无错误', (done) => {
      new Map({ id })
        .save({
          hotel_seq: 'SEQ102',
          hotel_name: '北京希尔顿酒店'
        })
        .then(() => {
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
  describe('#destroy()', () => {
    it('删除地图无错误', (done) => {
      new Map({ id })
        .destroy()
        .then(() => {
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
