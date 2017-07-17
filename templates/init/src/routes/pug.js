import Router from 'koa-router';

const router = new Router();
router.get('/pug', async (ctx) => {
  ctx.render('pug', {
    name: 'world'
  });
});

export default router;
