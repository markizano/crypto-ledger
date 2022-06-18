
import { log } from './logger';
import { getEnv, loadConfig } from './utils';
import { BitcoinAdapter, TransactionDetail, WalletAddress } from './adapter/btc';
import { MongoModel } from './adapter/mongo';
const __name__ = 'cryptoview.btc2mongo';

let mdb = undefined as unknown as MongoModel;

async function syncWallets(btc: BitcoinAdapter): Promise<Array<WalletAddress>> {
  const logPrefix = `${__name__}.syncTransactions(${btc.getCurrency()})` as string;
  log.debug(logPrefix);
  const dbWalletAddrs = await mdb.fetchWallets(true);
  const toInsertRecords = [] as WalletAddress[];
  const btcWallets = await btc.getMyWallets() as WalletAddress[];

  for ( var w in btcWallets ) {
    var btcWallet = btcWallets[w];
    if ( dbWalletAddrs.includes( btcWallet.address ) ) {
      continue;
    }
    log.warn(logPrefix, `I just found a new wallet address: ${btcWallet.address} on blockchain for ${btcWallet.currency} with ${btcWallet.txids.length} transactions.`);
    toInsertRecords.push( btcWallet );
  }
  if ( toInsertRecords.length ) {
    await mdb.addWallets(toInsertRecords);
  }
  return toInsertRecords;
}

async function syncTransactions(btc: BitcoinAdapter): Promise<Array<TransactionDetail>> {
  const logPrefix = `${__name__}.syncTransactions(${btc.getCurrency()})` as string;
  log.debug(logPrefix);
  const dbTransactionIds = await mdb.fetchDbTransactions(true) as Array<string>;
  const toInsertRecords = [] as TransactionDetail[];
  const btcTransactions = await btc.getMyTransactions() as TransactionDetail[];

  for ( var t in btcTransactions ) {
    var btcTxn = btcTransactions[t];
    if ( dbTransactionIds.includes( btcTxn.txid ) ) {
      continue;
    }
    log.warn(logPrefix, '[ \x1b[1;31mHEY\x1b[0m ]: I would notify via email or SMS now:');
    log.info(logPrefix, `  Address ${btcTxn.getAddress()} has ${btcTxn.getCategory()} ${btcTxn.amount} of ${btcTxn.currency} on ${btcTxn.blocktime}.`);
    toInsertRecords.push(btcTxn);
  }
  if ( toInsertRecords.length ) {
    await mdb.addTransactions(toInsertRecords);
  }
  return toInsertRecords;
}

export async function main() {
  log.debug(__name__, 'main();');
  const config = await loadConfig( getEnv('CONFIGFILE', './config/config.yml') );
  const wallets = [] as Promise<Array<WalletAddress>>[];
  const transactions = [] as Promise<Array<TransactionDetail>>[];
  mdb = new MongoModel(config.mongodb);

  const result = {
    status: 200 as number,
    response: 'OK' as string,
    actions: [] as any,
  } as any;

  await mdb.connect();

  Object.keys(config.blockchains).forEach( (bc: string) => {
    var blockchain = config.blockchains[bc];
    const btc = new BitcoinAdapter(blockchain);
    wallets.push( syncWallets(btc) );
    transactions.push( syncTransactions(btc) );
  });
  result.actions.push( { wallets: await Promise.all(wallets) } );
  result.actions.push( { transactions: await Promise.all(transactions) } );

  return result;
}

export function tidyUp() {
  mdb.close();
  log.info(__name__, 'Complete!');
}
