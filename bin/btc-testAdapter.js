#!/usr/bin/node --experimental-repl-await

const { log } = require('cryptoview/logger');
const { getConfig } = require('cryptoview/config');
const { BitcoinAdapter } = require('cryptoview/adapter/btc');
const __name__ = 'btc-testAdapter.js';

log.debug(__filename);

getConfig().then((config) => {
    let adapter = new BitcoinAdapter(config.blockchains.bitcoin);
    adapter.getDecodedRawTransaction('89bbc9d8ab7ff2d9bde8ffa43040fc9898fd84d098f6283bd4f58a2b63e2a70e').then((txn) => {
        log.debug(__name__, require('util').inspect( txn, {showHidden: false, depth: null, colors: true} ) );
    }).catch((reason) => {
        log.warn(__name__, 'Failed to decode raw txn');
        log.error(__name__, reason);
    });
    //adapter.getTransactionsByAddress();
}).catch((err) => {
    log.warn(__name__, 'Failed to parse config...')
    log.error(__name__, err);
});
