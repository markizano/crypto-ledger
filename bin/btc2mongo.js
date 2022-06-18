#!/usr/bin/env node

const utils = require('../lib/cryptoview/utils');
const btc2mongo = require('../lib/cryptoview/btc2mongo');
const { log } = require('../lib/cryptoview/logger');
const __name__ = 'btc2mongo.js';

// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
    btc2mongo.main()
      .then(utils.debugPass)
      .catch((err) => {
        log.error(__name__, `[ \x1b[1;31mException\x1b[0m ]: Top-Level Error: ${err}\n${err.stack}`)
      })
      .finally(btc2mongo.tidyUp);
}
  
