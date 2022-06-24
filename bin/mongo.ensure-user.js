#!/usr/bin/mongo --nodb

var db = connect(_getENV('MONGO_URL'));
var admin = db.getSiblingDB('admin');

var user = null, role = null;
print('\x1b[34mRole\x1b[0m: ');
role = admin.createRole({
    role: 'cryptoLedger',
    privileges: [
        { resource: { cluster: true }, actions: [ 'listDatabases' ] }
    ],
    roles: [
        { db: 'crypto-ledger', role: 'dbAdmin' },
        { db: 'crypto-ledger', role: 'readWrite' }
    ]        
});
printjson(role);

print('\x1b[34mUser\x1b[0m: ');
user = admin.createUser({
    user: _getENV('MONGO_USER'),
    pwd: _getENV('MONGO_PASS'),
    roles: [ 'cryptoLedger' ]
});
printjson(user);
