const Router = require('koa-router');

const {getDustList, insertDust} = require('./controllers');

const router = new Router();

router.get('/', getDustList);
router.post('/', insertDust);

module.exports = router;
