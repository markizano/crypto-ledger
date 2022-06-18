
import { MongoClient, Document, Db, InsertManyResult } from "mongodb";
import { log } from "../logger";
import { WalletAddress, TransactionDetail } from './btc';
const __name__ = 'cryptoview.mongo';

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
    this.options = cfg.hasOwnProperty('options')? cfg.options: '';
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

export class MongoModel {
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

  async fetchWallets(addressOnly: boolean = false): Promise<Array<WalletAddress|string>> {
    log.verbose(__name__, 'fetchWallets();')
    const wallets = this.db.collection('wallets');
    const dbWallets = [] as WalletAddress[];
    (await wallets.find().project( addressOnly? {address: 1}: {} ).toArray()).forEach( (x: Document) => {
      if ( addressOnly ) {
        dbWallets.push(x.address);
      }
      dbWallets.push( new WalletAddress({...x}) );
    });
    log.info(__name__, `Found ${dbWallets.length} wallets today!`);
    return dbWallets;
  }

  async fetchDbTransactions(idsOnly: boolean = false): Promise<Array<TransactionDetail|string>> {
    log.verbose(__name__, 'fetchDbTransactions();')
    const transactions = this.db.collection('transactions');
    var dbTransactions = [] as TransactionDetail[];
    (await transactions.find().project(idsOnly? { txid: 1 }: {}).sort({blocktime: 1}).toArray()).forEach( (x: Document) => {
      if (!x.label) x.label = "undefined";
      if ( !x.currency ) x.currency = "BTC";
      x.usd = 0; // @TODO: Go fetch the price per the blocktime from some coinmarketcap/coingecko API endpoint.
      if ( idsOnly ) {
        dbTransactions.push( x.txid );
      } else {
        dbTransactions.push( new TransactionDetail({...x}) );
      }
    });
    log.info(__name__, `Got ${dbTransactions.length} transactions from the DB!`);
    return dbTransactions;
  }

  async addWallets(btcWallets: WalletAddress[]): Promise<InsertManyResult<Document>> {
    log.verbose(__name__, `addWallets(${btcWallets[0].currency}, ${btcWallets})`);
    return await this.db.collection('wallets').insertMany(btcWallets);
  }

  async addTransactions(btcTxns: TransactionDetail[]): Promise<InsertManyResult<Document>> {
    log.verbose(__name__, `addTransactions(${btcTxns[0].currency}, ${btcTxns})`);
    return await this.db.collection('transactions').insertMany(btcTxns);
  }
}


