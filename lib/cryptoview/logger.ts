
export const log = require('npmlog');

/* # I reference this too often not to have it here in the file.
    levels: {
      silly: -Infinity,
      verbose: 1000,
      info: 2000,
      timing: 2500,
      http: 3000,
      notice: 3500,
      warn: 4000,
      error: 5000,
      silent: Infinity,
    },
*/

log.addLevel('debug', 500, { fg: 'cyan', bg: 'black' }, 'DEBUG');
log.addLevel('trace', 100, { fg: 'cyan', bg: 'black' }, 'TRACE');
log.level = process.env.hasOwnProperty('LOG_LEVEL')? process.env.LOG_LEVEL: 'debug';

module.exports = { log };
