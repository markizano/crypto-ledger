#!/usr/bin/env node

const mongodb = require('mongodb');
const MONGO_URL = 'mongodb://jiren.home.asthralios.net:27017/crypto-ledger';
const MONGO_DBNAME = 'crypto-ledger';
const client = new mongodb.MongoClient(MONGO_URL);

async function ensureIndicies() {
  await client.connect();
  let db = client.db(MONGO_DBNAME);
  const result = [];

  let debugCollections = await db.listCollections().toArray();
  console.log('Collections: ' + JSON.stringify(debugCollections, null, 2));

  const wallets = db.collection('wallets');
  let walletIndex = await wallets.createIndex(
    { name: 1 },
    { background: true, name: 'wallets_name' }
  );
  console.log('db.wallets: ' + walletIndex);
  result.push('wallets.' + walletIndex);

  return result;
}

function debugPass(res, err) {
  if ( err ) {
    console.log('\x1b[31mError\x1b[0m: ' + err);
  }
  console.log('\x1b[34mIndexes\x1b[0m: ' + res );
}

function debugErr(e) {
  console.log('\x1b[1;31mException\x1b[0m: ' + e );
}

// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
  ensureIndicies().then(debugPass).catch(debugErr).finally(() => {
    client.close();
  });
}

