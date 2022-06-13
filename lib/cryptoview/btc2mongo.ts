
const Bitcoin = require('bitcoin-core');
import { Document, MongoClient } from 'mongodb';
import { BTC_Transaction } from './transactions';
import { loadConfig, CryptoViewConfig } from './utils';
import { log } from './logger';

var mongo = undefined as unknown as MongoClient;

async function getBTCTxns(config: any): Promise<Array<BTC_Transaction>> {
    const btcClient = new Bitcoin(config.bitcoin);
    const transactions = [] as BTC_Transaction[];
    log.debug(module.id, 'btc2mongo.getBTCTxns();');
    (await btcClient.listTransactions()).forEach( (txn: any) => {
      if (!txn.label) txn.label = "undefined";
      txn.currency = "BTC";
      txn.usd = 0; // @TODO: Go fetch the price per the blocktime from some coinmarketcap/coingecko API endpoint.
      transactions.push( new BTC_Transaction({...txn}) );
    });
    return transactions;
}

async function getMongoConnection(config: CryptoViewConfig) {
  mongo = new MongoClient( config.mongodb.getUrl() );
  return await mongo.connect();
}

export async function main() {
  log.debug(module.id, 'main();');
  const config = await loadConfig('./config/config.yml');
  const btcTxns = await getBTCTxns(config);
  await getMongoConnection(config);

  const db = mongo.db(config.mongodb.dbname);
  const transactions = db.collection('transactions');

  const txnCount = await transactions.countDocuments();
  var dbTransactions = [] as BTC_Transaction[];
  if ( txnCount ) {
      (await transactions.find({}, {}).sort({blocktime: 1}).toArray()).forEach( (x: Document) => {
        if (!x.label) x.label = "undefined";
        x.currency = "BTC";
        x.usd = 0; // @TODO: Go fetch the price per the blocktime from some coinmarketcap/coingecko API endpoint.
        let btcTxn = new BTC_Transaction({...x});
        dbTransactions.push( btcTxn );
      });
  }

  if ( txnCount != btcTxns.length ) {
    log.warn(module.id, `[ \x1b[1;33mALERT\x1b[0m ]: DB lacking txns from Blockchain! Blockchain has ${btcTxns.length}, DB has ${txnCount}`);
    for ( var i in btcTxns ) {
      var txn = btcTxns[i];
      let hasTransaction = dbTransactions.filter((x: BTC_Transaction) => x.txid == txn.txid);
      if ( !hasTransaction.length ) {
          await db.collection('transactions').insertOne(txn);
          console.log('[ \x1b[1;31mHEY\x1b[0m ]: I would notify via email or SMS now:');
          console.log(`  Address ${txn.address} has ${txn.category} ${txn.amount} of ${txn.currency} on ${txn.blocktime}.`);
      }
    }
    return {
      status: 200,
      response: 'OK',
      message: 'attempted insert();'
    }
  }
  return {
    status: 200,
    response: 'OK',
    message: 'allGud();'
  }
}

export function tidyUp() {
  mongo.close();
  log.info(module.id, 'Complete!');
}

module.exports = { main, tidyUp };
