#!/usr/bin/env node

const utils = require('../lib/cryptoview/utils');
const log = require('../lib/cryptoview/logger').log;

const mongodb = require('mongodb');
const MONGO_URL = 'mongodb://jiren.home.asthralios.net:27017/crypto-ledger';
const MONGO_DBNAME = 'crypto-ledger';
const client = new mongodb.MongoClient(MONGO_URL);

async function ensureIndicies() {
  await client.connect();
  let db = client.db(MONGO_DBNAME);
  const result = [];

  let debugCollections = await db.listCollections().toArray();
  log.info(module.path, 'Collections: ' + JSON.stringify(debugCollections, null, 2));

  {
    const wallets = db.collection('wallets');
    let walletIndex = await wallets.createIndex(
      { name: 1 },
      { background: true, name: 'wallets_name' }
    );
    console.log('db.wallets: ' + walletIndex);
    result.push('wallets.' + walletIndex);
  };

  {
    const transactions = db.collection('transactions');
    let txnIndex = await transactions.createIndex({
      blocktime: 1
    }, {
      background: 1,
      name: 'transactions_blocktime'
    });
    console.log('db.transactions: ' + txnIndex);
    result.push('transactions.' + txnIndex);
  };

  return result;
}

// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
  ensureIndicies().then(utils.debugPass).catch(utils.debugFail).finally(() => {
    client.close();
  });
}

