require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');

const TEST_PORT = process.env.TEST_PORT || 3000;
const app = require('../app');

describe('GET /', () => {
  let server = null;
  before(done => {
    server = app.listen(TEST_PORT, () => {
      done();
    });
  });
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
  after(done => {
    server.close(() => {
      done();
    });
  });
});
