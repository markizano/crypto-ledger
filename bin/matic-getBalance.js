#!/usr/bin/node

const utils = require("cryptoview/utils");
async function main() {
    const matic = require('cryptoview/adapter/matic');
    const balance = await matic.main();
    return balance;
}

main().then((balance) => { console.log('Complete!') }).catch(utils.debugFail);
