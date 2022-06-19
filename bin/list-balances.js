#!/usr/bin/node

const balanceModel = require('cryptoview/models/balance');
const utils = require('cryptoview/utils');
balanceModel.main().then(utils.debugPass).catch(utils.debutFail).finally(balanceModel.tidyUp);
