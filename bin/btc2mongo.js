#!/usr/bin/env node

const utils = require('../lib/cryptoview/utils');
const btc2mongo = require('../lib/cryptoview/btc2mongo');

// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
    btc2mongo.main()
      .then(utils.debugPass)
      .catch(utils.debugFail)
      .finally(btc2mongo.tidyUp);
}
  
