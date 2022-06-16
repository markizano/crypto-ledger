
import { log } from './logger';
import { getEnv, loadConfig } from './utils';
import { BitcoinAdapter, TransactionDetail, WalletAddress } from './adapter/btc';
import { MongoModel } from './adapter/mongo';

let mdb = undefined as unknown as MongoModel;

async function syncTransactions(btc: BitcoinAdapter): Promise<Array<TransactionDetail>> {
  const dbTransactionIds = await mdb.fetchDbTransactions(true);
  const toInsertRecords = [] as TransactionDetail[];
  const btcTransactions = await btc.getMyTransactions() as TransactionDetail[];

  for ( var t in btcTransactions ) {
    var btcTxn = btcTransactions[t];
    if ( dbTransactionIds.includes( btcTxn.txid ) ) {
      continue;
    }
    log.warn(module.id, '[ \x1b[1;31mHEY\x1b[0m ]: I would notify via email or SMS now:');
    log.info(module.id, `  Address ${btcTxn.details[0].address} has ${btcTxn.details[0].category} ${btcTxn.amount} of ${btcTxn.currency} on ${btcTxn.blocktime}.`);
    toInsertRecords.push(btcTxn);
  }
  if ( toInsertRecords.length ) {
    await mdb.addTransactions(toInsertRecords);
  }
  return toInsertRecords;
}

async function syncWallets(btc: BitcoinAdapter): Promise<Array<WalletAddress>> {
  const dbWalletAddrs = await mdb.fetchWallets(true);
  const toInsertRecords = [] as WalletAddress[];
  const btcWallets = await btc.getMyWallets() as WalletAddress[];

  for ( var w in btcWallets ) {
    var btcWallet = btcWallets[w];
    if ( dbWalletAddrs.includes( btcWallet.address ) ) {
      continue;
    }
    log.warn(module.id, 'I just found a new wallet address!');
    toInsertRecords.push( btcWallet );
  }
  if ( toInsertRecords.length ) {
    await mdb.addWallets(toInsertRecords);
  }
  return toInsertRecords;
}

export async function main() {
  log.debug(module.id, 'main();');
  const config = await loadConfig( getEnv('CONFIGFILE', './config/config.yml') );
  const btc = new BitcoinAdapter(config.bitcoin);
  const result = {
    status: 200 as number,
    response: 'OK' as string,
    actions: [] as any,
  } as any;
  mdb = new MongoModel(config.mongodb);

  await mdb.connect();

  result.actions.push( await syncWallets(btc) );
  result.actions.push( await syncTransactions(btc) );

  return result;
}

export function tidyUp() {
  mdb.close();
  log.info(module.id, 'Complete!');
}
