const { Dust } = require('../../models');
/**
 * @swagger
 * /dusts:
 *  get:
 *    tags:
 *    - dust
 *    summary: 미세먼지 기록 리스트
 *    description: 미세먼지 기록 리스트를 반환한다.
 *    parameters:
 *    responses:
 *      200:
 *        description: 성공
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/dust'
 */

const getDustList = async ctx => {
  const dustList = await Dust.findAll();
  return ctx.send(200, dustList.map(dust => dust.toJSON()));
};

/**
 * @swagger
 * /dusts:
 *  post:
 *    tags:
 *    - dust
 *    summary: 미세먼지를 db에 입력
 *    description: 미세먼지를 db에 입력한다.
 *    parameters:
 *      - name: dust
 *        in: body
 *        required: true
 *        description: 미세먼지 정보
 *        type: object
 *        schema:
 *          $ref: '#/parameters/dust'
 *    responses:
 *      201:
 *        description: 등록 성공
 *        schema:
 *          $ref: '#/definitions/response_message'
 *      400:
 *        description: 데이터가 올바르지 않음
 *        schema:
 *          $ref: '#/definitions/response_message'
 */

const insertDust = async ctx => {
  const dustForm = ctx.request.body;
  const dust = Dust.build(dustForm);
  try {
    dust.validate();
  } catch (e) {
    return ctx.send(400, {
      message: '요청이 잘못되었습니다.',
      content: e.message
    });
  }
  await dust.save();
  return ctx.send(201, { message: 'success', content: dust.toJSON() });
};

module.exports = { getDustList, insertDust };
