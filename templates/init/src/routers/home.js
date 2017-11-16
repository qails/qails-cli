import Router from 'koa-router';

const router = new Router();
router.get('/', async (ctx) => {
  ctx.render('home', {
    name: 'world'
  });
});

export default router;
