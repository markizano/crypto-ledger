#!/usr/bin/node

const utils = require("../lib/cryptoview/utils");
async function main() {
    const eth = require('../lib/cryptoview/adapter/eth');
    const balance = await eth.main();
    console.log( balance );
    return balance;
}

main().then((balance) => { console.log(balance) }).catch(utils.debugFail);
