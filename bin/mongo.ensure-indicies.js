#!/usr/bin/mongo --nodb

var db = connect(_getEnv('MONGO_URL'));
var wallets = db.getCollection('wallets');
var transactions = db.getCollection('transactions');

var index = null;

print('\x1b[34mwallets.address\x1b[0m');
index = wallets.createIndex(
  { address: 1 },
  {
    background: 1,
    unique: true,
    name: 'wallets__address'
  }
);
printjson(index);

print('\x1b[34mtransactions.txid::transactions.currency\x1b[0m');
index = transactions.createIndex(
  { txid: 1, currency: 1 },
  {
    background: 1,
    unique: true,
    name: 'transactions__txid_currency'
  }
);
printjson(index);

print('\x1b[34mtransactions.blocktime\x1b[0m');
index = transactions.createIndex(
  { blocktime: 1 },
  {
    background: 1,
    name: 'transactions__blocktime'
  }
);
printjson(index);
