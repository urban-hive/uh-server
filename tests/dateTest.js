const { getNearestExactHourDate } = require('../app/lib/date');
const { expect } = require('chai');

describe('Get nearest Exact Hour Date', () => {
  it('should be between last exact hour and next exact hour', done => {
    const now = new Date();
    const result = getNearestExactHourDate(now);
    expect(result.getTime()).to.be.within(
      new Date().setHours(now.getHours(), 0, 0, 0),
      new Date().setHours(now.getHours() + 1, 0, 0, 0)
    );
    done();
  });
  it('should meet specified condition', done => {
    expect(getNearestExactHourDate('2018-08-08 12:29:59').getTime()).is.equal(
      new Date('2018-08-08 12:00:00').getTime()
    );
    expect(getNearestExactHourDate('2018-08-08 12:30:01').getTime()).is.equal(
      new Date('2018-08-08 13:00:00').getTime()
    );
    done();
  });
  it('should throw TypeError', done => {
    expect(getNearestExactHourDate, undefined, null).throw(TypeError);
    done();
  });
});
