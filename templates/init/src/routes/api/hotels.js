import { format } from 'util';
import Router from 'koa-router';
import axios from 'axios';
import Map from '../../models/map';
import envelope from '../../utils/response-envelope';
import { prefixApi } from '../../config/app';

const router = new Router();
router.prefix(prefixApi).get('/hotels/:hotelSeq', async (ctx) => {
  const { HOTEL_DETAIL_API } = process.env;
  const { hotelSeq } = ctx.params;

  let code = 0;
  let message = 'Success';
  let result = {};

  await Map.findOne({ hotel_seq: hotelSeq }).then((map) => {
    result = {
      seq: hotelSeq,
      name: map.get('hotel_name'),
      address: map.get('hotel_address'),
      latlng: map.get('latlng'),
      hasMap: true
    };
  }, async (error) => {
    if (error.message === 'EmptyResponse') {
      const url = format(HOTEL_DETAIL_API, hotelSeq);
      await axios.get(url).then((response) => {
        const responseData = response.data;
        if (responseData && responseData.data && responseData.errcode === 0) {
          const { info: { name, add, gpoint } } = responseData.data;
          result = {
            seq: hotelSeq,
            name,
            address: add,
            latlng: gpoint,
            hasMap: false
          };
        } else {
          code = 404;
          message = 'Not found';
        }
      });
    } else {
      console.log(error);
      code = 500;
      message = 'Internal server error';
      result = error;
    }
  });

  ctx.body = envelope({ code, message, result });
});

export default router;
