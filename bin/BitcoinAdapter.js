#!/usr/bin/node

const util = require('util');
const path = require('path');
const { log } = require('cryptoview/logger');
const { getConfig } = require('cryptoview/config');
const { Bitcoin } = require('cryptoview/adapter/btc');
const GeneratorFunction = function*(){}.constructor;
const __name__ = 'BitcoinAdapter.js';
const METHOD = path.basename(process.argv[1], '.js');

const debugMe = (obj) => {
    console.log(util.inspect( obj, {showHidden: false, depth: null, colors: true} ) );
}

const invoke = (config, args=[]) => {
    if ( typeof Bitcoin.Adapter.prototype[METHOD] !== 'function' ) {
        log.error(`BitcoinAdapter.${METHOD}() is not a function! Abort.`)
        process.exit(8);
    }
    log.debug(__name__, `Calling: Bitcoin.Adapter.${METHOD}(${args.join(", ")});`);
    let adapter = new Bitcoin.Adapter(config.blockchains.bitcoin);
    const btcMethod = Bitcoin.Adapter.prototype[METHOD];
    return btcMethod.call(adapter, ...args);
}

const handlePromise = (btcValue) => {
    log.info(__name__, `btcMethod is a <\x1b[32mPromise\x1b[0m>`);
    btcValue.then( (result) => {
        log.debug(__name__, debugMe( result ) );
    }).catch( (reason) => {
        log.warn(__name__, `BitcoinAdapter.${METHOD} failed: ${reason}`);
        log.error(__name__, reason.stack);
    });
};

const handleAsGen = (btcValue) => {
    return async () => {
        for await ( const txid of btcValue ) {
            log.warn(__name__, `YIELD transaction! ${txid}`);
            return txid;
        }
    }
};

const postConfig = (config) => {
    const btcValue = invoke(config, process.argv.slice(2))
    if ( btcValue instanceof Promise ) {
        handlePromise(btcValue);
    // Very pythonic: Does it quack like a Duck?
    } else if ( typeof btcValue.next !== 'undefined'
      && typeof btcValue.return !== 'undefined'
      && typeof btcValue.throw !== 'undefined'
    ) {
        log.info(__name__, `btcMethod is an <\x1b[32mAsyncGenerator\x1b[0m>`);
        handleAsGen(btcValue)();
    } else {
        log.error('Unknown instanceof btcValue.');
        return -1;
    }
};

let config;
(async function(config) {
  postConfig( config = await getConfig() );
})(config = exports.config || ( exports.config = {} ))

