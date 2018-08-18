const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const koaSwagger = require('koa2-swagger-ui');
const respond = require('koa-respond');
const views = require('koa-views');

const { loggerMiddleware, logger } = require('./logger')('log');
const router = require('./routes');
const errorRaiser = require('./middlewares/errorRaiser');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']
  })
);
app.use(bodyParser());
app.use(loggerMiddleware);
app.use(
  koaSwagger({
    title: 'Swagger UI',
    swaggerOptions: {
      url: '/spec'
    },
    routePrefix: '/swagger',
    hideTopbar: false
  })
);
app.use(respond());
app.use(
  views('app/views', {
    default: 'ejs'
  })
);
app.use(router.routes());
app.use(errorRaiser);

app.on('error', (err, ctx) => {
  logger.error(err);
  return ctx.send(err.status || 500, { message: err.toString() });
});

module.exports = app;
