
const Bitcoin = require('bitcoin-core');
import { Document, MongoClient } from 'mongodb';
import { BTC_Transaction } from './transactions';
import { loadConfig, CryptoViewConfig } from './utils';

var mongo = undefined as unknown as MongoClient;

async function getBTCTxns(config: any): Promise<Array<BTC_Transaction>> {
    const btcClient = new Bitcoin(config.bitcoin);
    const transactions = [] as BTC_Transaction[];
    (await btcClient.listTransactions()).forEach( (txn: any) => {
        //console.log('Transaction: ', txn)
        transactions.push( new BTC_Transaction(
            txn.txid,
            txn.address,
            txn.category,
            txn.label || "undefined",
            txn.amount,
            "BTC",
            0, // @TODO: Go fetch the price per the blocktime from some coinmarketcap/coingecko API endpoint.
            txn.blockhash,
            txn.blockheight,
            txn.blockindex,
            txn.blocktime
        ) );
    });
    //console.log(JSON.stringify(transactions, null, 2));
    return transactions;
}

async function getMongoConnection(config: CryptoViewConfig) {
  const MONGO_URL = `mongodb://${config.mongodb.host}/${config.mongodb.dbname}`;
  mongo = new MongoClient(MONGO_URL);
  return await mongo.connect();
}

export async function main() {
  const config = await loadConfig('./config/config.yml');
  const btcTxns = await getBTCTxns(config);
  await getMongoConnection(config);

  const db = mongo.db(config.mongodb.dbname);
  const transactions = db.collection('transactions');

  const txnCount = await transactions.countDocuments();
  var dbTransactions = [] as BTC_Transaction[];
  if ( txnCount ) {
      (await transactions.find({}, {}).sort({blocktime: 1}).toArray()).forEach( (x: Document) => {
          let btcTxn = new BTC_Transaction(
            x.txid,
            x.address,
            x.category,
            x.label || "undefined",
            x.amount,
            "BTC",
            0,
            x.blockhash,
            x.blockheight,
            x.blockindex,
            x.blocktime
          );
          dbTransactions.push( btcTxn );
      });
  }
  if ( txnCount != btcTxns.length ) {
    console.log(`[ \x1b[1;33mALERT\x1b[0m ]: DB lacking txns from Blockchain! Blockchain has ${btcTxns.length}, DB has ${txnCount}`);
    btcTxns.forEach( async (txn: BTC_Transaction) => {
        let hasTransaction = dbTransactions.filter((x: BTC_Transaction) => x.txid == txn.txid);
        console.log(`hasTransaction(${hasTransaction.length})=`, hasTransaction);
        if ( !hasTransaction.length ) {
            console.log('[ \x1b[36mDEBUG\x1b[0m ]: Adding txn: ' + JSON.stringify(txn, null, 2));
            await transactions.insertOne(txn).then((res) => {
                console.log('Inserted: ' + res);
            }).catch((err) => console.log('[\x1b[31mERROR\x1b[0m]: insert() failed: ' + err));
        }
      });
    return {
      status: 200,
      response: 'OK',
      message: 'btc2mongo();'
    }
  }

}

export function tidyUp() {
  mongo.close();
  console.log('Complete!');
}

module.exports = { main, tidyUp };
