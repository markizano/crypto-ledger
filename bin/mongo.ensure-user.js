#!/usr/bin/env node

const utils = require('../lib/cryptoview/utils');
const mongodb = require('mongodb');
const client = new mongodb.MongoClient(process.env.MONGO_URL);

async function main() {
    await client.connect();
    const admin = client.db('admin');
    const result = [];

    // @TODO: Check if user is present before trying to add.
    result.push( await admin.createRole({
        role: 'cryptoLedger',
        privileges: [
            { resource: { cluster: true }, actions: [ 'listDatabases' ] }
        ],
        roles: [
            { db: 'crypto-ledger', role: 'dbAdmin' },
            { db: 'crypto-ledger', role: 'readWrite' }
        ]        
    }));
    result.push( await admin.createUser({
        user: 'ledger',
        pwd: '!_CryptoLedger_!',
        roles: [ 'cryptoLedger' ]
    }) );
    return result;
}

// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
    main().then(utils.debugPass).catch(utils.debugFail).finally(() => {
      client.close();
    });
}
  
