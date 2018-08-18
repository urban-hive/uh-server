const Router = require('koa-router');

const router = new Router();
const spec = require('./spec');

router.get('/', ctx => ctx.send(200, { message: 'Hello World' }));
router.use('/spec', spec.routes());

module.exports = router;
