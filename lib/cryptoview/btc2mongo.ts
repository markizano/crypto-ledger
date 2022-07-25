
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { log } from 'cryptoview/logger';
import { debugFail } from 'cryptoview/utils';
import { CryptoView, getConfig } from 'cryptoview/config';
import { Bitcoin } from 'cryptoview/adapter/btc';
import { MongoModel } from 'cryptoview/adapter/mongo';
const __name__ = 'cryptoview.btc2mongo';

export class BTC2Mongo {
  private mdb = undefined as unknown as MongoModel;
  private readonly config = {} as CryptoView.Config;
  private readonly logPrefix = `${__name__}.BTC2Mongo` as string;
  readonly adapters = [] as Bitcoin.Adapter[];

  constructor(config: CryptoView.Config) {
    this.config = config;
    this.mdb = new MongoModel(this.config.mongodb);
  }

  async syncWallets(btc: Bitcoin.Adapter): Promise<Array<Bitcoin.WalletAddress>> {
    log.debug(this.logPrefix, `syncWallets(${btc.getCurrency()})`);
    const dbWalletAddrs = await this.mdb.fetchWalletIds();
    const toInsertRecords = [] as Bitcoin.WalletAddress[];
    const btcWallets = await btc.getMyWallets() as Bitcoin.WalletAddress[];
  
    for ( var w in btcWallets ) {
      var btcWallet = btcWallets[w];
      if ( dbWalletAddrs.includes( btcWallet.address ) ) {
        continue;
      }
      log.warn(this.logPrefix, `I just found a new wallet address: ${btcWallet.address} on blockchain for ${btcWallet.currency} with ${btcWallet.txids.length} transactions.`);
      toInsertRecords.push( btcWallet );
    }
    if ( toInsertRecords.length ) {
      await this.mdb.addWallets(toInsertRecords);
    }
    return toInsertRecords;
  }

  async alertTransaction(btcTxn: any) {
    const logPrefix = `${__name__}.alertTransaction(${btcTxn.currency})` as string;
    const message = `Address ${btcTxn.getAddress()} has ${btcTxn.getCategory()} ${btcTxn.amount} of ` +
      `${btcTxn.currency} on ${(new Date(btcTxn.blocktime * 1000)).toISOString().replace('T', ' ').replace('.000Z', '')}.`;
    const snsParams = {
      TopicArn: 'arn:aws:sns:us-east-1:488822841584:Info',
      Subject: `New Transaction for ${btcTxn.currency}`,
      Message: message
    }
    log.warn(logPrefix, '[ \x1b[1;31mHEY\x1b[0m ]: I would notify via email or SMS now:');
    log.info(logPrefix, '  ' + message);

    const snsClient = new SNSClient({ region: 'us-east-1' });
    const publish = await snsClient.send( new PublishCommand(snsParams) );
    log.info(logPrefix, `SNS Sent: ${publish.MessageId}`)
  }

  async syncTransactions(btc: Bitcoin.Adapter): Promise<Array<Bitcoin.Txn>> {
    const logPrefix = `${__name__}.syncTransactions(${btc.getCurrency()})` as string;
    log.debug(logPrefix);
    const dbTransactionIds = await this.mdb.fetchTransactionIds() as string[];
    const toInsertRecords = [] as Bitcoin.Txn[];
    const btcTransactions = await btc.getMyTransactions() as Bitcoin.Txn[];
  
    for ( var t in btcTransactions ) {
      var btcTxn = btcTransactions[t];
      if ( dbTransactionIds.includes( btcTxn.txid ) ) {
        continue;
      }
      this.alertTransaction(btcTxn);
      toInsertRecords.push(btcTxn);
    }
    if ( toInsertRecords.length ) {
      await this.mdb.addTransactions(toInsertRecords);
    }
    return toInsertRecords;
  }

  async btc2mongo() {
    log.debug(this.logPrefix, 'BTC2Mongo();');
    const wallets = [] as Promise<Bitcoin.WalletAddress[]>[];
    const transactions = [] as Promise<Bitcoin.Txn[]>[];
    const blockchains = Object.keys(this.config.blockchains) as string[];
    this.mdb = new MongoModel(this.config.mongodb);
  
    const result = {
      status: 200 as number,
      response: 'OK' as string,
      actions: [] as any,
    } as any;
  
    await this.mdb.connect();
  
    log.verbose(this.logPrefix, `Iterating over ${blockchains.length} blockchains...`);
    blockchains.forEach( (bc: string) => {
      var blockchain = this.config.blockchains.getBlockchain(bc);
      if ( blockchain.type == 'bitcoin' ) {
        log.verbose(this.logPrefix, `Bitcoin-type blockchain found for ${blockchain.currency}.`);
        const btc = new Bitcoin.Adapter(blockchain);
        wallets.push( this.syncWallets(btc) );
        transactions.push( this.syncTransactions(btc) );
      } else {
        log.warn(this.logPrefix, `Skipping non-bitcoin blockchain ${bc}.`);
        log.debug(this.logPrefix, blockchain);
      }
    });
    log.verbose(this.logPrefix, 'Done iterating blockchains!');
    log.verbose(this.logPrefix, 'Waiting on promises to come back.')
    result.actions.push( { wallets: await Promise.all(wallets) } );
    result.actions.push( { transactions: await Promise.all(transactions) } );
    log.verbose(this.logPrefix, 'Done waiting on promises.')
  
    return result;
  }

  tidyUp(): void {
    this.mdb.close();
    log.info(this.logPrefix, 'Complete!');
  }
}

export function main(): any {
  var result = undefined as any;
  log.debug(__name__, 'main();');
  return getConfig().then( (config: CryptoView.Config) => {
    result = new BTC2Mongo(config);
    return result.btc2mongo();
  }).catch(debugFail)
  .finally(() => {
    result.tidyUp();
  })
}
