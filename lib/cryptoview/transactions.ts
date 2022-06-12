
interface Transaction {

  readonly datetime: Date;
  readonly label: string;
           amount: Number;
  readonly currency: string;
           usd: Number;
  readonly source: string;
  readonly destination: string;

  getDate(): Date,
  getLabel(): string;
  getAmount(): Number;
}

class BTC_Transaction implements Transaction {

  readonly datetime: Date;
  readonly label: string;
           amount: Number;
  readonly currency: string;
           usd: Number;
  readonly source: string;
  readonly destination: string;

  constructor(
    datetime: Date,
    label: string,
    amount: Number,
    currency: string,
    usd: Number,
    source: string,
    destination: string) {
        this.datetime = datetime;
        this.label = label;
        this.amount = amount;
        this.currency = currency;
        this.usd = usd;
        this.source = source;
        this.destination = destination;
  }

  getDate(): Date {
    return this.datetime;
  }

  getLabel(): string {
    return this.label;
  }

  getAmount(): Number {
    return this.amount;
  }
}

class ETH_Transaction implements Transaction {
  readonly datetime: Date;
  readonly label: string;
           amount: Number;
  readonly currency: string;
           usd: Number;
  readonly contract: string;
  readonly source: string;
  readonly destination: string;

  constructor(
    datetime: Date,
    label: string,
    amount: Number,
    currency: string,
    usd: Number,
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

  getAmount(): Number {
    return this.amount;
  }
}

module.exports = { BTC_Transaction, ETH_Transaction };
