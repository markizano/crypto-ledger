#!/usr/bin/env node

const utils = require('cryptoview/utils');
const btc2mongo = require('cryptoview/btc2mongo');
const { log } = require('cryptoview/logger');
const __name__ = 'btc2mongo.js';

// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
  log.verbose(__name__, 'entrypoint.sh');
    btc2mongo.main()
      .then(utils.debugPass)
      .catch((err) => {
        log.error(__name__, `[ \x1b[1;31mException\x1b[0m ]: Top-Level Error: ${err}\n${err.stack}`)
      })
      .finally(btc2mongo.tidyUp);
}
  
