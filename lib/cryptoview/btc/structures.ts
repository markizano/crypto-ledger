
const __name__ = 'cryptoview.btc.structs';

export enum BitcoinCategory {
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

export class BitcoinTxBlock {
    readonly bits = '' as string;
    readonly chainwork = '' as string;
    readonly confirmations = 0 as number;
    readonly difficulty = 0 as number;
    readonly hash = '' as string;
    readonly height = 0 as number;
    readonly mediantime = 0 as number;
    readonly merkleroot = '' as string;
    readonly nTx = 0 as number;
    readonly nextblockhash = '' as string;
    readonly nonce = 0 as number;
    readonly previousblockhash = '' as string;
    readonly size = 0 as number;
    readonly strippedsize = 0 as number;
    readonly time = 0 as number;
    readonly tx = [] as string[];
    readonly version = 0 as number;
    readonly versionHex = '' as string;
    readonly weight = 0 as number;
  
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
      this.nextblockhash = txn.hasOwnProperty('nextblockhash') ? txn.nextblockhash: '';
      this.nonce = txn.hasOwnProperty('nonce') ? txn.nonce: '';
      this.previousblockhash = txn.hasOwnProperty('previousblockhash') ? txn.previousblockhash: '';
      this.size = txn.hasOwnProperty('size') ? txn.size: '';
      this.strippedsize = txn.hasOwnProperty('strippedsize') ? txn.strippedsize: '';
      this.time = txn.hasOwnProperty('time') ? txn.time: '';
      this.tx = txn.hasOwnProperty('tx') ? txn.tx: '';
      this.version = txn.hasOwnProperty('version') ? txn.version: '';
      this.versionHex = txn.hasOwnProperty('versionHex') ? txn.versionHex: '';
      this.weight = txn.hasOwnProperty('weight') ? txn.weight: '';
    }
  }
  
  export class BitcoinTransactionDetailsStruct {
    readonly address = '' as string;
    readonly category = BitcoinCategory.undefined as BitcoinCategory;
    readonly amount = 0 as number;
    readonly label = '' as string;
    readonly vout = 0 as number;
  
    constructor(address: string, category: BitcoinCategory, amount: number, label: string, vout: number) {
      this.address = address;
      this.category = category;
      this.amount = amount;
      this.label = label;
      this.vout = vout;
    }
  }
  
  export class BitcoinTransactionDetail {
    readonly amount = 0 as number;
    readonly currency = '' as string;
    confirmations = 0 as number;
    readonly blockhash = '' as string;
    readonly blockheight = 0 as number;
    readonly blockindex = 0 as number;
    readonly blocktime = 0 as number;
    readonly txid = '' as string;
    readonly details = [] as BitcoinTransactionDetailsStruct[];
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
          var detail = txn.details[d] as BitcoinTransactionDetailsStruct;
          this.details.push( new BitcoinTransactionDetailsStruct(
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
  
    getCategory(): BitcoinCategory {
      if ( !this.details.length ) {
        return BitcoinCategory.undefined;
      }
      return this.details[0].category;
    }
  }
  
  /**
   * WalletAddress: Helper class to class BitcoinAdapter.
   * This will provide some structure to the results that come from Bitcoin.listReceivedByAddress().
   */
  export class BitcoinWalletAddress {
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
  