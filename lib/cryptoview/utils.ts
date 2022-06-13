
const load = require('js-yaml').load;
const readFile = require('fs/promises').readFile;

export function debugPass(value: any): void {
  console.log('[ \x1b[32mPass\x1b[0m ]: ' + JSON.stringify( value ) );
}
  
export function debugFail(e: Error): void {
  console.log('[ \x1b[1;31mException\x1b[0m ]: ' + e );
}

class MongoDbConfig {
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

class BitcoinConfig {
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

export class CryptoViewConfig {
  readonly bitcoin = {} as BitcoinConfig;
  readonly mongodb = {} as MongoDbConfig;

  constructor(cfg: any) {
    if ( Object.prototype.hasOwnProperty.call(cfg, 'bitcoin') && cfg.bitcoin ) {
      this.bitcoin = new BitcoinConfig(cfg.bitcoin);
    }
    if ( Object.prototype.hasOwnProperty.call(cfg, 'mongodb') && cfg.mongodb ) {
      this.mongodb = new MongoDbConfig(cfg.mongodb);
    }
  }
}

export async function loadConfig(filename: string): Promise<CryptoViewConfig> {
    return new CryptoViewConfig( load(await readFile(filename, "utf8") ) );
}

module.exports = { debugPass, debugFail, loadConfig };
