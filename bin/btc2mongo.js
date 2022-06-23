#!/usr/bin/env node

const btc2mongo = require('cryptoview/btc2mongo');
const { log } = require('cryptoview/logger');
const { debugFail } = require('cryptoview/utils');
const __name__ = 'btc2mongo.js';

function btc2mongo_complete(result, err) {
  log.verbose(__name__, `[ \x1b[32mpass\x1b[0m] ]: Actions taken:\n${JSON.stringify(result, null, 2)}`);
}

// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
  log.verbose(__name__, 'entrypoint.sh');
  log.debug(__name__, btc2mongo.main().then(btc2mongo_complete).catch(debugFail) );
}
