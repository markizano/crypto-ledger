#!/usr/bin/node

const path = require('path');
const { log } = require('cryptoview/logger');
const { getConfig } = require('cryptoview/config');
const { Bitcoin } = require('cryptoview/adapter/btc');
const __name__ = 'BitcoinAdapter.js';
const METHOD = path.basename(process.argv[1], '.js');

getConfig().then( (config) => {
    const args = process.argv.slice(2);
    if ( typeof Bitcoin.Adapter.prototype[METHOD] !== 'function' ) {
        log.error(`BitcoinAdapter.${METHOD}() is not a function! Abort.`)
        process.exit(8);
    }
    log.debug(__name__, `Calling: Bitcoin.Adapter.${METHOD}(${args.join(", ")});`);
    let adapter = new Bitcoin.Adapter(config.blockchains.bitcoin);
    const btcMethod = Bitcoin.Adapter.prototype[METHOD];
    btcMethod.call(adapter, ...args).then( (result) => {
        //log.debug(__name__, `Arguments to .then() response: ${arguments.length}`);
        //log.debug(__name__, result);
        log.debug(__name__, require('util').inspect( result, {showHidden: false, depth: null, colors: true} ) );
    }).catch( (reason) => {
        log.warn(__name__, `BitcoinAdapter.${METHOD} failed: ${reason}`);
        log.error(__name__, reason.stack);
    });
}).catch((err) => {
    log.warn(__name__, 'Failed to parse config...')
    log.error(__name__, err);
});
