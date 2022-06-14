#!/usr/bin/env node

const Bitcoin = require('bitcoin-core');
const log = require('../lib/cryptoview/logger').log;

const btcConfig = {
  port: '8333',
  username: 'markizano',
  password: 'asthralios',
  wallet: 'markizano'
};

function debugPass(res, err) {
  if ( err ) {
    log.error(module.path, '\x1b[31mError\x1b[0m: ' + err);
  }
  log.info(module.toString(), '\x1b[34mBalance\x1b[0m: ' + res.toString() );
}

function debugErr(e) {
  log.error(module.path, '\x1b[1;31mException\x1b[0m: ' + e );
}

(new Bitcoin( btcConfig )).getBalance('*', 1).then(debugPass).catch(debugErr);

