
import { load } from 'js-yaml';
import { readFile } from 'fs/promises';
import { log } from './logger';
import { BitcoinConfig } from './adapter/btc';
import { MongoDbConfig } from './adapter/mongo';

export function getEnv(name: string, defaltam: string = ''): string {
  if ( process.env.hasOwnProperty(name) ) {
    return process.env[name] || '';
  } else {
    return defaltam || '';
  }
}

export function debugPass(value: any): void {
  log.debug(module.id, '[ \x1b[32mPass\x1b[0m ]: ' + JSON.stringify( value ) );
}
  
export function debugFail(e: Error): void {
  log.error(module.id, '[ \x1b[1;31mException\x1b[0m ]: ' + e );
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

module.exports = { getEnv, debugPass, debugFail, loadConfig };
