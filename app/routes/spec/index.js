const Router = require ('koa-router');

const {specController} = require ('./controllers');

const router = new Router ();

router.get ('/', specController);

module.exports = router;
