
const BitcoinClient = require('bitcoin-core');
import { log } from '../logger';
const __name__ = 'cryptoview.adapter.btc';

enum Category {
  undefined = "undefined",
  SEND = "send",
  RECEIVE = "receive"
}

export class BitcoinRpcClientConfig {

  readonly username = '' as string;
  readonly password = '' as string;
  readonly host = '127.0.0.1' as string;
  readonly port = '8333' as string;
  readonly wallet = 'default' as string;
  readonly network = 'mainnet' as string;
  readonly ssl = false as boolean;
  readonly timeout = 30000 as number;
  readonly currency = 'BTC' as string;

  constructor(cfg: any) {
    this.username = cfg.hasOwnProperty('username')? cfg.username: '';
    this.password = cfg.hasOwnProperty('password')? cfg.password: '';
    this.port = cfg.hasOwnProperty('port')? cfg.port: '';
    this.host = cfg.hasOwnProperty('host')? cfg.host: '127.0.0.1';
    this.wallet = cfg.hasOwnProperty('wallet')? cfg.wallet: '';
    this.network = cfg.hasOwnProperty('network')? cfg.network: 'mainnet';
    this.ssl = cfg.hasOwnProperty('ssl')? cfg.ssl: false;
    this.timeout = cfg.hasOwnProperty('timeout')? cfg.timeout: 30000;
    this.currency = cfg.hasOwnProperty('currency') ? cfg.currency.toUpperCase() : 'BTC';
  }
}

class TransactionDetailsStruct {
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
  readonly details = [] as TransactionDetailsStruct[];
  //readonly hex = '' as string;
  //readonly decoded = {} as Object;

  constructor(txn: any) {
    this.amount = txn.hasOwnProperty('amount')? txn.amount: 0;
    this.currency = txn.hasOwnProperty('currency')? txn.currency.toUpperCase(): 'undef';
    this.confirmations = txn.hasOwnProperty('confirmations')? txn.confirmations: 0;
    this.blockhash = txn.hasOwnProperty('blockhash')? txn.blockhash: '';
    this.blockheight = txn.hasOwnProperty('blockheight')? txn.blockheight: 0;
    this.blockindex = txn.hasOwnProperty('blockindex')? txn.blockindex: 0;
    this.blocktime = txn.hasOwnProperty('blocktime')? txn.blocktime: 0;
    this.txid = txn.hasOwnProperty('txid')? txn.txid: '';
    if ( txn.hasOwnProperty('details') && txn.details instanceof Array ) {
      for ( var d in txn.details ) {
        var detail = txn.details[d] as TransactionDetailsStruct;
        this.details.push( new TransactionDetailsStruct(
          detail.address,
          detail.category,
          detail.amount,
          detail.label,
          detail.vout
        ) );
      }
    } else {
      this.details = [];
    }
    // this.hex = txn.hasOwnProperty('hex')? txn.hex: '';
    // this.decoded = txn.hasOwnProperty('decoded')? txn.decoded: {};
  }

  getAddress(): string {
    if ( !this.details.length ) {
      return '';
    }
    return this.details[0].address;
  }

  getCategory(): Category {
    if ( !this.details.length ) {
      return Category.undefined;
    }
    return this.details[0].category;
  }
}

/**
 * WalletAddress: Helper class to class BitcoinAdapter.
 * This will provide some structure to the results that come from Bitcoin.listReceivedByAddress().
 */
export class WalletAddress {
  readonly address = '' as string;
  readonly amount = 0 as number;
  readonly label = '' as string;
  currency = 'BTC' as string;
  readonly txids = [] as string[];
  private logPrefix = __name__ as string;

  constructor(cfg: any) {
    if ( cfg.address ) this.address = cfg.address;
    if ( cfg.amount ) this.amount = cfg.amount;
    if ( cfg.label ) this.label = cfg.label;
    if ( cfg.currency ) this.currency = cfg.currency;
    //  Coerce to a unique array of strings. Apparently Assets create a duplicate txid in the wallet list
    // on Ravencoin since you are both an output and input for the txn.
    if ( cfg.txids ) this.txids = [ ...new Set(cfg.txids) ] as string[];
    this.logPrefix = `${__name__}.WalletAddress(${this.currency})`;
  }

  /**
   * Transaction id 2 transaction. If you give me the Bitcoin client, I will fetch and attach
   * the full transaction object to this local list of transaction hashes.
   * @param {BitcoinClient} {client} The bitcoin-core RPC client to collect the details.
   * @returns {TransactionDetail[]} Array of Transactions
   */
  async txid2txn(client: InstanceType<typeof BitcoinClient>): Promise<Array<TransactionDetail>> {
    log.info(this.logPrefix, 'Collecting transactions related to the wallet.')
    const result = [] as TransactionDetail[];
    for ( var t in this.txids ) {
      var txid = this.txids[t];
      log.debug(this.logPrefix, `client.getTransaction(${txid})`)
      const txn = await client.getTransaction(txid);
      log.trace(this.logPrefix, 'client.getTransaction().result = ' + JSON.stringify(txn, null, 2));
      result.push(new TransactionDetail({
        ...txn,
        currency: this.currency
      }));
    }
    return result;
  }
}

/**
 * Adapter class to deal/interface with the bitcoin-core library.
 * In this way, if I want to cache results or do something before my program
 * interfaces with it, I can do that to avoid stressing the library too much.
 */
export class BitcoinAdapter {
  readonly config = undefined as unknown as BitcoinRpcClientConfig;
  client = undefined as unknown as InstanceType<typeof BitcoinClient>;
  private logPrefix = __name__ as string;

  constructor(cfg: BitcoinRpcClientConfig) {
    this.logPrefix = `${__name__}.BitcoinAdapter(${cfg.currency})`;
    this.config = new BitcoinRpcClientConfig(cfg);
    this.client = new BitcoinClient(this.config);
  }

  getCurrency(): string {
    if ( !this.config.currency ) {
      return '';
    }
    return this.config.currency;
  }

  /**
   * Get a list of Wallet Objects that contain detailed information about the list of wallets we are monitoring.
   * @returns Promise<Array<WalletAddress>> Get the list of wallets as address objects.
   */
  async getMyWallets(): Promise<Array<WalletAddress>> {
    log.verbose(this.logPrefix, 'getMyWallets()')
    const result = [] as WalletAddress[];
    // We want receiving addresses that have at least 1 confirmation, but not empty (e.g. wallets we've only sent tokens to)
    //  or watchOnly wallets since they aren't "my" wallets.
    const receivingAddresses = await this.client.listReceivedByAddress(1, false, false);
    log.trace(this.logPrefix, 'getMyWallets.listReceivedByAddress().result = ' + JSON.stringify(receivingAddresses));
    receivingAddresses.forEach( (address: any) => {
      var walletAddress = new WalletAddress({
        ...address,
        currency: this.getCurrency()
      });
      result.push(walletAddress);
    });
     return result;
  }

  async getMyTransactions(): Promise<Array<TransactionDetail>> {
    log.verbose(this.logPrefix,'getMyTransactions()');
    const result = [] as TransactionDetail[];
    const wallets = await this.getMyWallets();
    for ( var w in wallets ) {
      var wallet = wallets[w];
      var txns = await wallet.txid2txn(this.client);
      result.push(...txns)
    }
    log.info(this.logPrefix, `Found ${result.length} transactions.`)
    return result;
  }
}
