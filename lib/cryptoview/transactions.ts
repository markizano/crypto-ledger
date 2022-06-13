
export interface Transaction {

  readonly blocktime: Date;
           amount: number;
  readonly currency: string;
           usd: number;

  getDate(): Date,
  getAmount(): number;
}


enum BTC_Category {
  undefined = "undefined",
  SEND = "send",
  RECEIVE = "receive"
}

export class BTC_Transaction implements Transaction {

  readonly txid: string;
  readonly address: string;
  readonly category: BTC_Category;
           label: string;
  readonly amount: number;
  readonly currency: string;
           usd: number;
  readonly blocktime: Date;
  readonly blockhash: string;
  readonly blockheight: number;
  readonly blockindex: number;

  constructor(btc: any) {
    this.txid = btc.hasOwnProperty('txid')? btc.txid: '';
    this.address = btc.hasOwnProperty('address')? btc.address: '';
    if ( btc.hasOwnProperty('category') ) {
      switch(btc.category) {
        case BTC_Category.SEND:
          this.category = BTC_Category.SEND;
          break;
        case BTC_Category.RECEIVE:
          this.category = BTC_Category.RECEIVE;
          break;
        default:
          this.category = BTC_Category.undefined;
      }
    } else {
      this.category = BTC_Category.undefined;
    }

    this.label = btc.hasOwnProperty('label')? btc.label: '';
    this.amount = btc.hasOwnProperty('amount')? btc.amount: 0;
    this.currency = btc.hasOwnProperty('currency')? btc.currency: '';
    this.usd = btc.hasOwnProperty('usd')? btc.usd: '';
    this.blocktime = btc.hasOwnProperty('blocktime')? new Date(btc.blocktime * 1000): new Date();
    this.blockhash = btc.hasOwnProperty('blockhash')? btc.blockhash: '';
    this.blockheight = btc.hasOwnProperty('blockheight')? btc.blockheight: 0;
    this.blockindex = btc.hasOwnProperty('blockindex')? btc.blockindex: 0;
  }

  getDate(): Date {
    return this.blocktime;
  }

  getAmount(): number {
    return this.amount;
  }
}

export class ETH_Transaction implements Transaction {
  readonly blocktime: Date;
  readonly label: string;
           amount: number;
  readonly currency: string;
           usd: number;
  readonly contract: string;
  readonly source: string;
  readonly destination: string;

  constructor(
    datetime: Date,
    label: string,
    amount: number,
    currency: string,
    usd: number,
    contract: string,
    source: string,
    destination: string) {
      this.blocktime = datetime;
      this.label = label;
      this.amount = amount;
      this.currency = currency;
      this.usd = usd;
      this.contract = contract;
      this.source = source;
      this.destination = destination;
}

  getDate(): Date {
    return this.blocktime;
  }

  getAmount(): number {
    return this.amount;
  }
}

module.exports = { BTC_Transaction, ETH_Transaction };
