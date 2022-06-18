
import { load } from 'js-yaml';
import { readFile } from 'fs/promises';
import { log } from 'cryptoview/logger';
import { BitcoinRpcClientConfig } from 'cryptoview/adapter/btc';
import { MongoDbConfig } from 'cryptoview/adapter/mongo';
import { EthRpcConfig } from 'cryptoview/adapter/eth';
const __name__ = 'cryptoview.utils';

export function getEnv(name: string, defaltam: string = ''): string {
  if ( process.env.hasOwnProperty(name) ) {
    return process.env[name] || '';
  } else {
    return defaltam || '';
  }
}

export function debugPass(value: any): void {
  log.verbose(__name__, '[ \x1b[32mPass\x1b[0m ]: ' + JSON.stringify( value, null, 2 ) );
}
  
export function debugFail(e: Error): void {
  log.error(__name__, '[ \x1b[1;31mException\x1b[0m ]: ' + e );
}

export class CryptoViewConfig {
  readonly blockchains = {
    bitcoin: {} as BitcoinRpcClientConfig,
    litecoin: {} as BitcoinRpcClientConfig,
    dogecoin: {} as BitcoinRpcClientConfig,
    ravencoin: {} as BitcoinRpcClientConfig,
  } as any;
  readonly mongodb = {} as MongoDbConfig;
  readonly ethereum = {} as any;

  constructor(cfg: any) {
    if ( Object.prototype.hasOwnProperty.call(cfg, 'blockchains') && cfg.blockchains ) {
      Object.keys(cfg.blockchains).forEach( (blockchain: string) => {
        this.blockchains[blockchain] = new BitcoinRpcClientConfig(cfg.blockchains[blockchain]);
      });
    }
    if ( Object.prototype.hasOwnProperty.call(cfg, 'mongodb') && cfg.mongodb ) {
      this.mongodb = new MongoDbConfig(cfg.mongodb);
    }
    if ( Object.prototype.hasOwnProperty.call(cfg, 'etherem') && cfg.ethereum ) {
      this.ethereum = new EthRpcConfig( cfg.ethereum );
    }
  }
}

export async function loadConfig(filename: string): Promise<CryptoViewConfig> {
    return new CryptoViewConfig( load(await readFile(filename, "utf8") ) );
}

module.exports = { getEnv, debugPass, debugFail, loadConfig };
