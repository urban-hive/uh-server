const path = require ('path');
const swaggerJSDoc = require ('swagger-jsdoc');
const pkgInfo = require ('../../../package.json');

const options = {
  swaggerDefinition: {
    info: {
      title: pkgInfo.name,
      version: pkgInfo.version,
      description: pkgInfo.description,
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      token: {
        type: 'apiKey',
        name: 'token',
        description: 'Access token',
        in: 'header',
      },
    },
  },
  apis: [
    path.join (__dirname, '../**/controllers.js'),
    path.join (__dirname, './models.yaml'),
    path.join (__dirname, './tags.yaml'),
  ],
};

/**
 * @swagger
 * /spec:
 *  get:
 *    description: Swagger Spec API
 *    responses:
 *      200:
 *        description: swagger spec이 json 으로 나타난다.
 */
const specController = ctx => {
  ctx.body = swaggerJSDoc (options);
};

module.exports = {specController};
