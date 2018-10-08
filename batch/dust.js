const {CronJob} = require('cron');
const db = require('../app/models');

const getRandom = (min, max) => Math.random() * (max - min) + min

exports.job = new CronJob({
  cronTime: '*/5 * * * * ',
  onTick: async () => {
    await db.Dust.create({
      pm10_value: getRandom(1, 100),
      pm25_value: getRandom(1, 100),
      measured_date: new Date()
    })
  },
  start: false,
  timeZone: 'Asia/Seoul',
});