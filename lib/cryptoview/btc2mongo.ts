
import { log } from 'cryptoview/logger';
import { getEnv, loadConfig } from 'cryptoview/utils';
import { BitcoinAdapter, BitcoinTransactionDetail, BitcoinWalletAddress } from 'cryptoview/adapter/btc';
import { MongoModel } from 'cryptoview/adapter/mongo';
const __name__ = 'cryptoview.btc2mongo';

let mdb = undefined as unknown as MongoModel;

async function syncWallets(btc: BitcoinAdapter): Promise<Array<BitcoinWalletAddress>> {
  const logPrefix = `${__name__}.syncTransactions(${btc.getCurrency()})` as string;
  log.debug(logPrefix);
  const dbWalletAddrs = await mdb.fetchWalletIds();
  const toInsertRecords = [] as BitcoinWalletAddress[];
  const btcWallets = await btc.getMyWallets() as BitcoinWalletAddress[];

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

async function syncTransactions(btc: BitcoinAdapter): Promise<Array<BitcoinTransactionDetail>> {
  const logPrefix = `${__name__}.syncTransactions(${btc.getCurrency()})` as string;
  log.debug(logPrefix);
  const dbTransactionIds = await mdb.fetchTransactionIds() as string[];
  const toInsertRecords = [] as BitcoinTransactionDetail[];
  const btcTransactions = await btc.getMyTransactions() as BitcoinTransactionDetail[];

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
  const wallets = [] as Promise<BitcoinWalletAddress[]>[];
  const transactions = [] as Promise<BitcoinTransactionDetail[]>[];
  const blockchains = Object.keys(config.blockchains) as string[];
  mdb = new MongoModel(config.mongodb);

  const result = {
    status: 200 as number,
    response: 'OK' as string,
    actions: [] as any,
  } as any;

  await mdb.connect();

  log.verbose(__name__, `Iterating over ${blockchains.length} blockchains...`);
  blockchains.forEach( (bc: string) => {
    var blockchain = config.blockchains[bc];
    if ( blockchain.type == 'bitcoin' ) {
      log.verbose(__name__, `Bitcoin-type blockchain found for ${blockchain.currency}.`);
      const btc = new BitcoinAdapter(blockchain);
      wallets.push( syncWallets(btc) );
      transactions.push( syncTransactions(btc) );
    } else {
      log.warn(__name__, `Skipping non-bitcoin blockchain ${bc}.`);
      log.debug(__name__, blockchain);
    }
  });
  log.verbose(__name__, 'Done iterating blockchains!');
  log.verbose(__name__, 'Waiting on promises to come back.')
  result.actions.push( { wallets: await Promise.all(wallets) } );
  result.actions.push( { transactions: await Promise.all(transactions) } );
  log.verbose(__name__, 'Done waiting on promises.')

  return result;
}

export function tidyUp() {
  mdb.close();
  log.info(__name__, 'Complete!');
}
