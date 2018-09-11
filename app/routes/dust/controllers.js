const { URL } = require('url');
const axios = require('axios');
const _ = require('lodash');
const { Dust, sequelize } = require('../../models');
const { getNearestExactHourDate } = require('../../lib/date');
require('dotenv').config();

const DUST_INFO_URL =
  'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty';
const { DUST_API_KEY } = process.env;

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

const getChart = async ctx => {
  const page = await ctx.render('chart.ejs');
  return page;
};

const adjustToChartArray = dustList => {
  const timestampArr = [];
  dustList.forEach(elem => {
    if (timestampArr.indexOf(elem.exactHour.getTime()) < 0)
      timestampArr.push(elem.exactHour.getTime());
  });
  return timestampArr.map(timestamp => {
    const dustInHour = dustList.filter(
      elem => elem.exactHour.getTime() === timestamp
    );
    const sumOfDust = dustInHour.reduce((prev, cur) => ({
      pm10_value: prev.pm10_value + cur.pm10_value,
      pm25_value: prev.pm25_value + cur.pm25_value
    }));
    return {
      pm10_value:
        Number.parseFloat(sumOfDust.pm10_value).toFixed(20) / dustInHour.length,
      pm25_value:
        Number.parseFloat(sumOfDust.pm25_value).toFixed(20) / dustInHour.length,
      exactHour: new Date(timestamp)
    };
  });
};

/**
 * @swagger
 * /dusts/chart/data:
 *  get:
 *    tags:
 *    - dust
 *    summary: chart에 필요한 데이터를 얻는다.
 *    description: db 데이터를 얻고, open api데이터와 비교 할 수 있도록 함께 반환한다.
 *    responses:
 *      200:
 *        description: 등록 성공
 *        schema:
 *          $ref: '#/definitions/response_message'
 *      400:
 *        description: 데이터가 올바르지 않음
 *        schema:
 *          $ref: '#/definitions/response_message'
 */

const getChartData = async ctx => {
  const getDustInfoURL = new URL(DUST_INFO_URL);
  getDustInfoURL.searchParams.set('stationName', '종로구');
  getDustInfoURL.searchParams.set('dataTerm', 'month');
  getDustInfoURL.searchParams.set('pageNo', 1);
  getDustInfoURL.searchParams.set('numOfRows', 100000);
  getDustInfoURL.searchParams.set(
    'ServiceKey',
    decodeURIComponent(DUST_API_KEY)
  );
  getDustInfoURL.searchParams.set('ver', 1.3);
  getDustInfoURL.searchParams.set('_returnType', 'json');

  const dustData = await Promise.all([
    axios.get(getDustInfoURL.toString()),
    Dust.findAll({ order: [[sequelize.col('measured_date'), 'DESC']] })
  ]); // 여기서 시간들은 죄다 최신순 정렬

  const apiDustList = dustData[0].data.list.map(data => {
    const clone = _.cloneDeep(data);
    Object.keys(clone).forEach(key => {
      const value = Number.parseFloat(clone[key]);
      if (!Number.isNaN(value)) clone[key] = value;
    });
    clone.dataTime = new Date(`${data.dataTime}:00`);
    return clone;
  });

  const dbDustList = adjustToChartArray(
    dustData[1].map(data => {
      const clone = _.cloneDeep(data.toJSON());
      clone.exactHour = getNearestExactHourDate(data.toJSON().measured_date);
      return clone;
    })
  );

  const dustlist = dbDustList.map(dustInDb => {
    const dustInApi = apiDustList.find(
      data => data.dataTime.getTime() === dustInDb.exactHour.getTime()
    );
    return { api: dustInApi, db: dustInDb };
  });

  return ctx.send(200, {
    dustlist
  });
};

module.exports = { getDustList, insertDust, getChart, getChartData };
