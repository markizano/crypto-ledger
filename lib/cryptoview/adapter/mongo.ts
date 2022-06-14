
import { MongoClient, Document, WithId, Db, InsertManyResult } from "mongodb";
import { log } from "../logger";
import { TransactionDetail } from './btc';

export class MongoDbConfig {
  readonly username = '' as string;
  readonly password = '' as string;
  readonly host = 'localhost' as string;
  readonly port = 27017 as number;
  readonly dbname = 'test' as string;
  readonly options = '' as string;

  constructor(cfg: any) {
    this.username = cfg.hasOwnProperty('username')? cfg.username: '';
    this.password = cfg.hasOwnProperty('password')? cfg.password: '';
    this.host = cfg.hasOwnProperty('host')? cfg.host: '';
    this.port = cfg.hasOwnProperty('port')? cfg.port: '';
    this.dbname = cfg.hasOwnProperty('dbname')? cfg.dbname: '';
    this.options = cfg.hasOwnProperty('arguments')? cfg.options: '';
  }

  getUrl() {
    var result = 'mongodb://';
    if ( this.username && this.password ) {
      result += `${this.username}:${this.password}@`;
    }
    result += `${this.host}:${this.port}/${this.dbname}`;
    if ( this.options ) {
      result += `?${this.options}`;
    }
    return result;
  }
}

export class MongoAdapter {
  private mongo = undefined as unknown as MongoClient;
  private config = undefined as unknown as MongoDbConfig;
  private db = undefined as unknown as Db;

  constructor(config: any) {
    this.config = new MongoDbConfig(config);
    this.mongo = new MongoClient( this.config.getUrl() );
  }

  async connect(): Promise<MongoClient> {
    const result = await this.mongo.connect() as MongoClient;
    this.db = this.mongo.db(this.config.dbname);
    return result;
  }

  close() {
    this.mongo.close();
  }

  // This feels wrong. Not an adapter thing - this is a model function.
  // I should not be calling BTC stuff here.
  // @TODO: Fix this via putting in a model somewhere.
  async fetchDbTransactions(): Promise<Array<TransactionDetail>> {
    log.verbose(module.id,'fetchDbTransactions();')
    const transactions = this.db.collection('transactions');
    var dbTransactions = [] as TransactionDetail[];
    (await transactions.find({}, {}).sort({blocktime: 1}).toArray()).forEach( (x: WithId<Document>) => {
      if (!x.label) x.label = "undefined";
      x.currency = "BTC";
      x.usd = 0; // @TODO: Go fetch the price per the blocktime from some coinmarketcap/coingecko API endpoint.
      dbTransactions.push( new TransactionDetail({...x}) );
    });
    return dbTransactions;
  }

  async addTransactions(btcTxns: TransactionDetail[]): Promise<InsertManyResult<Document>> {
    log.verbose(`addTransactions(${btcTxns})`);
    return await this.db.collection('transaction').insertMany(btcTxns);
  }

}


