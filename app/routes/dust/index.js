const Router = require('koa-router');

const {
  getDustList,
  insertDust,
  getChart,
  getChartData
} = require('./controllers');

const router = new Router();

router.get('/', getDustList);
router.post('/', insertDust);
router.get('/chart', getChart);
router.post('/chart', getChartData);

module.exports = router;
