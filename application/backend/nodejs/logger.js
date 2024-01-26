const pino = require('pino');

module.exports = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
});
