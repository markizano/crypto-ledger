
const BitcoinClient = require('bitcoin-core');
import { log } from '../logger';

export class BitcoinConfig {
  readonly username = '' as string;
  readonly password = '' as string;
  readonly port = '8333' as string;
  readonly wallet = '' as string;

  constructor(cfg: any) {
    this.username = cfg.hasOwnProperty('username')? cfg.username: '';
    this.password = cfg.hasOwnProperty('password')? cfg.password: '';
    this.port = cfg.hasOwnProperty('port')? cfg.port: '';
    this.wallet = cfg.hasOwnProperty('wallet')? cfg.wallet: '';
  }
}
  
/**
 * WalletAddress: Helper class to class BitcoinAdapter.
 * This will provide some structure to the results that come from Bitcoin.listReceivedByAddress().
 */  
class WalletAddress {
  readonly address = '' as string;
  readonly amount = 0 as number;
  readonly label = '' as string;
  readonly txids = [] as string[];
  txns = [] as TransactionDetail[];

  constructor(cfg: any) {
    if ( cfg.address ) this.address = cfg.address;
    if ( cfg.amount ) this.amount = cfg.amount;
    if ( cfg.label ) this.label = cfg.label;
    if ( cfg.txids ) this.txids = cfg.txids;
  }

  /**
   * Transaction id 2 transaction. If you give me the Bitcoin client, I will fetch and attach
   * the full transaction object to this local list of transaction hashes.
   * @param client {Bitcoin} The bitcoin-core RPC client to collect the details.
   * @returns null
   */
  async txid2txn(client: InstanceType<typeof BitcoinClient>): Promise<void> {
    log.verbose(module.id, 'Collecting transactions related to the wallet.')
    if ( this.txns.length ) {
      this.txns = [];
    }
    for ( var t in this.txids ) {
      var txid = this.txids[t];
      log.debug(module.id, `client.getTransaction(${txid}, true, true)`)
      const txn = await client.getTransaction(txid, true, true);
      this.txns.push(txn);
    }
  }
}

enum Category {
  undefined = "undefined",
  SEND = "send",
  RECEIVE = "receive"
}

class _TransactionDetail_Details {
  readonly address = '' as string;
  readonly category = Category.undefined as Category;
  readonly amount = 0 as number;
  readonly label = '' as string;
  readonly vout = 0 as number;

  constructor(address: string, category: Category, amount: number, label: string, vout: number) {
    this.address = address;
    this.category = category;
    this.amount = amount;
    this.label = label;
    this.vout = vout;
  }
}

export class TransactionDetail {
  readonly amount = 0 as number;
  readonly currency = '' as string;
  confirmations = 0 as number;
  readonly blockhash = '' as string;
  readonly blockheight = 0 as number;
  readonly blockindex = 0 as number;
  readonly blocktime = 0 as number;
  readonly txid = '' as string;
  readonly details = [] as _TransactionDetail_Details[];
  readonly hex = '' as string;
  readonly decoded = {} as Object;

  constructor(txn: any) {
    this.amount = txn.hasOwnProperty('amount')? txn.amount: 0;
    this.currency = txn.hasOwnProperty('currency')? txn.currency.toUpperCase(): 'BTC';
    this.confirmations = txn.hasOwnProperty('confirmations')? txn.confirmations: 0;
    this.blockhash = txn.hasOwnProperty('blockhash')? txn.blockhash: '';
    this.blockheight = txn.hasOwnProperty('blockheight')? txn.blockheight: 0;
    this.blockindex = txn.hasOwnProperty('blockindex')? txn.blockindex: 0;
    this.blocktime = txn.hasOwnProperty('blocktime')? txn.blocktime: 0;
    this.txid = txn.hasOwnProperty('txid')? txn.txid: '';
    this.details = txn.hasOwnProperty('details')? txn.details: [];
    this.hex = txn.hasOwnProperty('hex')? txn.hex: '';
    this.decoded = txn.hasOwnProperty('decoded')? txn.decoded: {};
  }
}

/**
 * Adapter class to deal/interface with the bitcoin-core library.
 * In this way, if I want to cache results or do something before my program
 * interfaces with it, I can do that to avoid stressing the library too much.
 */
export class BitcoinAdapter {
  readonly config = undefined as unknown as BitcoinConfig;
  client = undefined as unknown as InstanceType<typeof BitcoinClient>;
  private results = {} as any;

  constructor(cfg: BitcoinConfig) {
    this.config = new BitcoinConfig(cfg);
    this.client = new BitcoinClient(this.config);
  }

  clearCache(): void {
    log.verbose(module.id, 'btc.BitcoinAdapter.clearCache()');
    this.results = {};
  }

  async getMyWallets(): Promise<Array<WalletAddress>> {
    if ( this.results.hasOwnProperty('myWallets') ) {
      log.verbose(module.id, 'cache-hit! Returning myWallets from previous run.');
      return this.results['myWallets'];
    }
    this.results['myWallets'] = [] as WalletAddress[];
    (await this.client.listReceivedByAddress(0, true, true)).forEach( (address: any) => {
      var walletAddress = new WalletAddress(address);
      // Performance warning: This might get expensive with big loads of data.
      walletAddress.txid2txn(this.client);
      this.results['myWallets'].push( walletAddress );
    });
    log.info(module.id, 'cache-miss! Returning myWallets from current execution.');
    return this.results['myWallets'];
  }
}
