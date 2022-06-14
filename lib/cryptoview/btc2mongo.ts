
import { log } from './logger';
import { getEnv, loadConfig } from './utils';
import { BitcoinAdapter, TransactionDetail } from './adapter/btc';
import { MongoAdapter } from './adapter/mongo';

let mdb = undefined as unknown as MongoAdapter;

export async function main() {
  log.debug(module.id, 'main();');
  const config = await loadConfig( getEnv('CONFIGFILE', './config/config.yml') );
  const btc = new BitcoinAdapter(config.bitcoin);
  const result = {
    status: 200 as number,
    response: 'OK' as string,
    actions: [] as any,
  } as any;
  mdb = new MongoAdapter(config.mongodb);

  await mdb.connect();

  const dbTransactions = await mdb.fetchDbTransactions();
  const btcWallets = await btc.getMyWallets();
  const dbtxids = [] as string[];
  const toInsertRecords = [] as TransactionDetail[];
  dbTransactions.forEach( (txn) => {
    dbtxids.push( txn.txid );
  });
  for ( var w in btcWallets ) {
    var btcWallet = btcWallets[w];
    for ( var t in btcWallet.txns ) {
      var btcTxn = btcWallet.txids[t] as unknown as TransactionDetail;
      if ( dbtxids.includes( btcTxn.txid ) ) {
        continue;
      }
      log.warn(module.id, '[ \x1b[1;31mHEY\x1b[0m ]: I would notify via email or SMS now:');
      log.info(module.id, `  Address ${btcTxn.details[0].address} has ${btcTxn.details[0].category} ${btcTxn.amount} of ${btcTxn.currency} on ${btcTxn.blocktime}.`);
      toInsertRecords.push(btcTxn);
    }
  }
  if ( toInsertRecords.length ) {
    result.actions.push( await mdb.addTransactions(toInsertRecords) );
  }
  return result;
}

export function tidyUp() {
  mdb.close();
  log.info(module.id, 'Complete!');
}
