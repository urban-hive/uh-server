const Router = require('koa-router');

const router = new Router();
const spec = require('./spec');
const dust = require('./dust');

router.get('/', ctx => ctx.send(200, { message: 'Hello World' }));
router.use('/spec', spec.routes());
router.use('/dusts', dust.routes());

module.exports = router;
