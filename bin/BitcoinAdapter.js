#!/usr/bin/node

const util = require('util');
const path = require('path');
const { log } = require('cryptoview/logger');
const { getConfig } = require('cryptoview/config');
const { Bitcoin } = require('cryptoview/adapter/btc');
const __name__ = 'BitcoinAdapter.js';
const METHOD = path.basename(process.argv[1], '.js');

const debugMe = (obj) => {
    console.log(util.inspect( obj, {showHidden: false, depth: null, colors: true} ) );
}

getConfig().then( (config) => {
    const args = process.argv.slice(2);
    if ( typeof Bitcoin.Adapter.prototype[METHOD] !== 'function' ) {
        log.error(`BitcoinAdapter.${METHOD}() is not a function! Abort.`)
        process.exit(8);
    }
    log.debug(__name__, `Calling: Bitcoin.Adapter.${METHOD}(${args.join(", ")});`);
    let adapter = new Bitcoin.Adapter(config.blockchains.bitcoin);
    const btcMethod = Bitcoin.Adapter.prototype[METHOD];
    if ( btcMethod instanceof Promise ) {
        btcMethod.call(adapter, ...args).then( (result) => {
            log.debug(__name__, debugMe( result ) );
        }).catch( (reason) => {
            log.warn(__name__, `BitcoinAdapter.${METHOD} failed: ${reason}`);
            log.error(__name__, reason.stack);
        });
    } else if ( btcMethod instanceof Function ) {
        ( async () => {
            for await ( const txid of btcMethod.call(adapter, ...args) ) {
                log.warn(__name__, `YIELD transaction! ${txid}`);
            }
        } )();
    }
}).catch((err) => {
    log.warn(__name__, 'getConfig().catch():')
    log.error(__name__, err);
});
