require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');

const TEST_PORT = process.env.TEST_PORT || 3000;
const app = require('../app');
const db = require('../app/models');

describe('Koa Application Test', () => {
  let server = null;
  let dustData = null;

  before(done => {
    db.sequelize.sync().then(() => {
      server = app.listen(TEST_PORT, () => {
        db.Dust.bulkCreate([
          {
            pm10_value: 1,
            pm25_value: 5,
            measured_date: new Date('2018-09-01 00:00:00')
          },
          {
            pm10_value: 2,
            pm25_value: 4,
            measured_date: new Date('2018-09-01 00:00:00')
          },
          {
            pm10_value: 3,
            pm25_value: 3,
            measured_date: new Date('2018-09-01 00:00:00')
          },
          {
            pm10_value: 4,
            pm25_value: 2,
            measured_date: new Date('2018-09-01 00:00:00')
          },
          {
            pm10_value: 5,
            pm25_value: 1,
            measured_date: new Date('2018-09-01 00:00:00')
          }
        ]).then(list => {
          dustData = list;
          done();
        });
      });
    });
  });

  describe('GET /', () => {
    it('should respond with text message "Hello World"', done => {
      request(server)
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal('Hello World');
          return done();
        });
    });
  });

  describe('GET /dusts/chart/data', () => {
    it('get dust data', done => {
      request(server)
        .get('/dusts/chart/data')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.dustlist[0].db.pm10_value).to.equal(3);
          return done();
        });
    });
  });
  after(done => {
    db.Dust.destroy({
      where: { id: { $in: dustData.map(dust => dust.id) } }
    }).then(() => {
      server.close(() => {
        done();
      });
    });
  });
});
