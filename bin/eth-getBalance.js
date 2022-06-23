#!/usr/bin/node

const utils = require("cryptoview/utils");
async function main() {
    const eth = require('cryptoview/adapter/eth');
    const balance = await eth.main();
    console.log( balance );
    return balance;
}

main().then((balance) => { console.log(balance) }).catch(utils.debugFail);
