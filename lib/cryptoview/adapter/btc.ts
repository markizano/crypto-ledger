
const BitcoinClient = require('bitcoin-core');
import { log } from 'cryptoview/logger';

const __name__ = 'cryptoview.adapter.btc';

export namespace Bitcoin {
  export enum Category {
    undefined = "undefined",
    SEND = "send",
    RECEIVE = "receive"
  }
  
  export class RpcClientConfig {
    readonly username = '' as string;
    readonly password = '' as string;
    readonly host = '127.0.0.1' as string;
    readonly port = '8333' as string;
    readonly wallet = 'default' as string;
    readonly network = 'mainnet' as string;
    readonly ssl = false as boolean;
    readonly timeout = 30000 as number;
    readonly currency = 'BTC' as string;
    readonly type = '' as string;
  
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
        this.type = cfg.hasOwnProperty('type')? cfg.type: '';
    }
  }
  
  export class Block {
    readonly bits = '' as string;
    readonly chainwork = '' as string;
    readonly confirmations = 0 as number;
    readonly difficulty = 0 as number;
    readonly hash = '' as string;
    readonly height = 0 as number;
    readonly mediantime = 0 as number;
    readonly merkleroot = '' as string;
    readonly nTx = 0 as number;
    readonly nonce = 0 as number;
    readonly size = 0 as number;
    readonly strippedsize = 0 as number;
    readonly time = 0 as number;
    readonly tx = [] as string[];
    readonly version = 0 as number;
    readonly versionHex = '' as string;
    readonly weight = 0 as number;
    readonly previousblockhash = '' as string;
    readonly nextblockhash = '' as string;
  
    constructor(txn: any) {
      this.bits = txn.hasOwnProperty('bits') ? txn.bits: '';
      this.chainwork = txn.hasOwnProperty('chainwork') ? txn.chainwork: '';
      this.confirmations = txn.hasOwnProperty('confirmations') ? txn.confirmations: '';
      this.difficulty = txn.hasOwnProperty('difficulty') ? txn.difficulty: '';
      this.hash = txn.hasOwnProperty('hash') ? txn.hash: '';
      this.height = txn.hasOwnProperty('height') ? txn.height: '';
      this.mediantime = txn.hasOwnProperty('mediantime') ? txn.mediantime: '';
      this.merkleroot = txn.hasOwnProperty('merkleroot') ? txn.merkleroot: '';
      this.nTx = txn.hasOwnProperty('nTx') ? txn.nTx: '';
      this.nonce = txn.hasOwnProperty('nonce') ? txn.nonce: '';
      this.size = txn.hasOwnProperty('size') ? txn.size: '';
      this.strippedsize = txn.hasOwnProperty('strippedsize') ? txn.strippedsize: '';
      this.time = txn.hasOwnProperty('time') ? txn.time: '';
      this.tx = txn.hasOwnProperty('tx') ? txn.tx: '';
      this.version = txn.hasOwnProperty('version') ? txn.version: '';
      this.versionHex = txn.hasOwnProperty('versionHex') ? txn.versionHex: '';
      this.weight = txn.hasOwnProperty('weight') ? txn.weight: '';
      this.previousblockhash = txn.hasOwnProperty('previousblockhash') ? txn.previousblockhash: '';
      this.nextblockhash = txn.hasOwnProperty('nextblockhash') ? txn.nextblockhash: '';
    }
  
    hasNextBlock(): boolean {
      return !!this.nextblockhash;
    }
    hasPreviousBlock(): boolean {
      return !!this.previousblockhash;
    }
  }
  
  export class TxnDetails {
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

  export class Txn {
    readonly amount = 0 as number;
    readonly currency = '' as string;
    confirmations = 0 as number;
    readonly blockhash = '' as string;
    readonly blockheight = 0 as number;
    readonly blockindex = 0 as number;
    readonly blocktime = 0 as number;
    readonly txid = '' as string;
    readonly details = [] as TxnDetails[];
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
          var detail = txn.details[d] as TxnDetails;
          this.details.push( new TxnDetails(
            detail.address,
            detail.category,
            detail.amount,
            detail.label,
            detail.vout
          ) );
        }
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
  
  class RawTxn_scriptSig {
    readonly asm = '' as string;
    readonly hex = '' as string;
    constructor(ss: any) {
      this.asm = ss.asm;
      this.hex = ss.hex;
    }
  }
  
  class RawTxn_scriptPubKey {
    readonly asm = '' as string;
    readonly hex = '' as string;
    readonly type = '' as string;
    readonly address? = '' as string;
    constructor(tx: any) {
      this.asm = tx.asm;
      this.hex = tx.hex;
      this.type = tx.type;
      if (tx.address) {
        this.address = tx.address;
      }
    }
  }
  
  class RawTxn_vin {
    readonly sequence = 0 as number;
    readonly scriptSig? = {} as RawTxn_scriptSig;
    readonly txinwitness? = [] as string[];
    readonly coinbase? = '' as string;
    constructor(tx: any) {
      this.sequence = tx.sequence;
      if ( tx.txinwitness ) {
        this.txinwitness = tx.txinwitness;
      }
      if ( tx.coinbase ) {
        this.coinbase = tx.coinbase;
      }
      if ( tx.scriptSig ) {
        this.scriptSig = new RawTxn_scriptSig(tx.scriptSig);
      }
    }
  }
  
  class RawTxn_vout {
    readonly value = '' as string;
    readonly n = [] as string[];
    readonly scriptPubKey = {} as RawTxn_scriptPubKey;
    readonly sequence? = 0 as number;
  
    constructor(tx: any) {
      this.value = tx.value;
      this.n = tx.n;
      if ( tx.scriptPubKey ) {
        this.scriptPubKey = new RawTxn_scriptPubKey(tx.scriptPubKey);
      }
      if ( tx.sequence ) {
        this.sequence = tx.sequence;
      }
    }
  }
  
  class RawDecodedTxn {
    readonly hash = '' as string;
    readonly locktime = 0 as number;
    readonly size = 0 as number;
    readonly txid = '' as string;
    readonly version = 0 as number;
    readonly vin = [] as RawTxn_vin[];
    readonly vout = [] as RawTxn_vout[];
    readonly vsize = 0 as number;
    readonly weight = 0 as number;
    constructor(tx: any) {
      this.hash = tx.hash;
      this.locktime = tx.locktime;
      this.size = tx.size;
      this.txid = tx.txid;
      this.version = tx.verison;
      if ( tx.vin ) {
        for (var vin of tx.vin) {
          this.vin.push( new RawTxn_vin(vin) );
        }
      }
      if ( tx.vout ) {
        for (var vout of tx.vout) {
          this.vout.push( new RawTxn_vout(vout) );
        }
      }
      this.vsize = tx.vsize;
      this.weight = tx.weight;
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
    protected logPrefix = __name__ as string;
  
    constructor(cfg: any) {
      if ( cfg.address ) this.address = cfg.address;
      if ( cfg.amount ) this.amount = cfg.amount;
      if ( cfg.label ) this.label = cfg.label;
      if ( cfg.currency ) this.currency = cfg.currency;
      //  Coerce to a unique array of strings. Apparently Assets create a duplicate txid in the wallet list
      // on Ravencoin since you are both an output and input for the txn.
      if ( cfg.txids ) this.txids = [ ...new Set(cfg.txids) ] as string[];
      this.logPrefix = `${__name__}.BitcoinWalletAddress(${this.currency})`;
    }
  }
  
  /**
   * Adapter class to deal/interface with the bitcoin-core library.
   * In this way, if I want to cache results or do something before my program
   * interfaces with it, I can do that to avoid stressing the library too much.
   * .
   * Also where I tie all my logic together on the technical operators against
   * the blockchain.
   */
  export abstract class BaseAdapter {
    readonly config = undefined as unknown as RpcClientConfig;
    client = undefined as unknown as any;
    protected logPrefix = __name__ as string;
  
    constructor(cfg: RpcClientConfig) {
      this.logPrefix = `${__name__}.BitcoinAdapter(${cfg.currency})`;
      this.config = new RpcClientConfig(cfg);
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
    async getMyWallets(): Promise<WalletAddress[]> {
      log.verbose(this.logPrefix, 'getMyWallets()')
      const result = [] as WalletAddress[];
      // We want receiving addresses that have at least 1 confirmation, but not empty (e.g. wallets we've only sent tokens to)
      //  or watchOnly wallets since they aren't "my" wallets.
      const receivingAddresses = await this.client.listReceivedByAddress(1, false, false);
      // @TODO: Write up a component that let's us filter out just watch-only address if our wallet is configured as such.
      log.trace(this.logPrefix, 'getMyWallets.listReceivedByAddress().result = ' + JSON.stringify(receivingAddresses));
      for ( var address of receivingAddresses ) {
        address.currency = this.getCurrency();
        var walletAddress = new WalletAddress(address);
        result.push(walletAddress);
      }
      return result;
    }
  
    /**
     * Get the transaction details for all of the transactions related to this.getMyWallets().
     * @returns The list of Transactions as expanded objects.
     */
    async getMyTransactions(): Promise<Txn[]> {
      log.verbose(this.logPrefix,'getMyTransactions()');
      const result = [] as Txn[];
      const wallets = await this.getMyWallets();
      for ( var wallet of wallets ) {
        var txns = await this.txids2txn(wallet.txids);
        result.push(...txns)
      }
      log.info(this.logPrefix, `Found ${result.length} transactions.`)
      return result;
    }
  
    /**
     * Transaction id 2 transaction. BitcoinRpcClient adapter function to turn a list of
     * transaction ids as string to a list of BitcoinTransactionDetail's.
     * @param txids {string[]} The list of transactions to convert into transactions.
     * @returns {Promise<Txn[]>} Array of Transactions
     */
     protected async txids2txn(txids: string[]): Promise<Txn[]> {
      log.info(this.logPrefix, 'Collecting transactions related to the wallet.')
      const result = [] as Txn[];
      for ( var txid of txids ) {
        log.debug(this.logPrefix, `client.getTransaction(${txid})`)
        const txn = await this.client.getTransaction(txid);
        // Adapter add here to keep track of which txns belong to which blockchains.
        txn.currency = this.getCurrency();
        log.trace(this.logPrefix, 'client.getTransaction().result = ' + JSON.stringify(txn, null, 2));
        result.push( new Txn(txn) );
      }
      return result;
    }
  
    /**
     * Get the block associated with the blockhash you provide me.
     * @param blockhash {string} The block hash related to the transaction in question.
     * @returns The block of the hash-id.
     */
    async getBlock(blockhash: string): Promise<Block> {
      log.info(this.logPrefix, `getBlock(${blockhash})`);
      const blockResult = await this.client.getBlock(blockhash);
      return new Block(blockResult);
    }
  
    async getTransaction(txid: string): Promise<Txn> {
      log.info(this.logPrefix, `getTransaction(${txid})`);
      const transaction = await this.client.getTransaction(txid);
      return new Txn(transaction);
    }
  
    /**
     * Go fetches a raw transaction off the blockchain and decodes the HEX value that comes back.
     * @param txid {string} The transaction id to go fetch and translate off the public ledger.
     * @returns The transaction details pulled from the Blockchain.
     */
    async getDecodedRawTransaction(txid: string): Promise<RawDecodedTxn> {
      const rawTransaction = await this.client.getRawTransaction(txid);
      const decodedTransaction = await this.client.decodeRawTransaction(rawTransaction);
      return new RawDecodedTxn(decodedTransaction);
    }
  }
  
  export class Adapter extends BaseAdapter {
  
    //***** Compound Transactions ahead! *****//
    /**
     * Iterate over the transactions in this block and unpack them to find txns that contain
     * this ${address}.
     * @param blockhash {sting} The blockhash ID we want to search.
     * @param address {string} The address for which we want to filter.
     * @returns List of transactions that mention this address.
     */
     async getTransactionsByAddressFromBlock(blockhash: string, address: string): Promise<RawDecodedTxn[]> {
      const result = [] as RawDecodedTxn[];
      const block = await this.getBlock(blockhash);
      for ( var txid of block.tx ) {
        let txn = await this.getDecodedRawTransaction(txid);
        for ( var vout of txn.vout ) {
          if ( vout.scriptPubKey.address && vout.scriptPubKey.address == address ){
            log.info(`Found address on transaction(${txid}) on block ${blockhash}.`);
            result.push( new RawDecodedTxn(txn) );
          }
        }
      }
      return result;
    }
  
    /**
     * I wanted a generator rather than a Promise array to avoid filling up memory with the transaction
     * lists.
     * @param startingblockhash {string} If not the most recent block, start here.
     * @param direction {boolean} True to look forward (nextblockhash). False to look back (previousblockhash).
     */
    async *iterateBlocks(startingblockhash: string, direction: boolean = false): AsyncGenerator<Block> {
      if ( startingblockhash == '' ) {
        startingblockhash = (await this.client.getBlockchainInfo()).bestblockhash
      }
      let block = await this.getBlock(startingblockhash) as Block;
      do {
        yield block;
        let nextblock = direction? block.nextblockhash: block.previousblockhash;
        block = await this.getBlock(nextblock);
      } while( direction? block.hasNextBlock(): block.hasPreviousBlock() )
    }
  }
  
}
