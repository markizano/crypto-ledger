#!/usr/bin/node --experimental-repl-await

const repl = require('repl');
const utils = require('../lib/cryptoview/utils');

async function main() {
    const config = await utils.loadConfig('./config/config.yml');
    const BitcoinAdapter = require('../lib/cryptoview/adapter/btc').BitcoinAdapter;
    let btc = new BitcoinAdapter(config.bitcoin);
    const wallets = await btc.getMyWallets();
    const replServer = repl.start({
        prompt: 'node@localhost$ ',
        useGlobal: true,
        useColors: true
    });
    replServer.context.wallets = wallets;
    replServer.context.btc = btc;
}
main().then(utils.debugPass).catch(utils.debugFail);
