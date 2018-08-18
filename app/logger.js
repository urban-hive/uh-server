const winston = require('winston');
const { logger } = require('koa2-winston');
require('date-utils');
const fs = require('fs');
const RotateFile = require('winston-daily-rotate-file');

const timestampFormat = () => new Date().toLocaleTimeString();

module.exports = logDir => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const transports = [
    new winston.transports.Console({
      timestamp: timestampFormat,
      colorize: true,
      level: 'info'
    }),
    new RotateFile({
      level: 'info',
      filename: `${logDir}/%DATE%.log`,
      timestamp: timestampFormat,
      datePattern: 'YYYY-MM-DD'
    })
  ];
  const winstonLogger = new winston.Logger({ transports });
  return {
    loggerMiddleware: logger({ logger: winstonLogger }),
    logger: winstonLogger
  };
};
