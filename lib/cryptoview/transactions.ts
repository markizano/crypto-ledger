
interface Transaction {

  readonly datetime: Date;
           amount: number;
  readonly currency: string;
           usd: number;

  getDate(): Date,
  getAmount(): number;
}


enum BTC_Category {
  SEND = "send",
  RECEIVE = "receive"
}

export class BTC_Transaction implements Transaction {

  readonly txid: string;
  readonly datetime: Date;
  readonly address: string;
  readonly category: BTC_Category;
           label: string;
  readonly amount: number;
  readonly currency: string;
           usd: number;
  readonly blockhash: string;
  readonly blockheight: number;
  readonly blockindex: number;

  constructor(
    txid: string,
    address: string,
    category: BTC_Category,
    label: string,
    amount: number,
    currency: string,
    usd: number,
    blockhash: string,
    blockheight: number,
    blockindex: number,
    blocktime: number
  ) {
        this.txid = txid;
        this.datetime = new Date(blocktime);
        this.address = address;
        this.category = category;
        this.label = label;
        this.amount = amount;
        this.currency = currency;
        this.usd = usd;
        this.blockhash = blockhash;
        this.blockheight = blockheight;
        this.blockindex = blockindex;
  }

  getDate(): Date {
    return this.datetime;
  }

  getAmount(): number {
    return this.amount;
  }
}

export class ETH_Transaction implements Transaction {
  readonly datetime: Date;
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
      this.datetime = datetime;
      this.label = label;
      this.amount = amount;
      this.currency = currency;
      this.usd = usd;
      this.contract = contract;
      this.source = source;
      this.destination = destination;
}

  getDate(): Date {
    return this.datetime;
  }

  getLabel(): string {
    return this.label;
  }

  getAmount(): number {
    return this.amount;
  }
}

module.exports = { BTC_Transaction, ETH_Transaction };
