
export const log = require('npmlog');
log.addLevel('debug', 500, { fg: 'cyan', bg: 'black' }, 'DEBUG');
log.level = process.env.hasOwnProperty('LOG_LEVEL')? process.env.LOG_LEVEL: 'debug';

module.exports = { log };
