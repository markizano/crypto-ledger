
import { load as loadYaml } from 'js-yaml';
import { readFile } from 'fs/promises';

import { getEnv } from 'cryptoview/utils';
import { MongoDbConfig } from 'cryptoview/adapter/mongo';
import { BitcoinRpcClientConfig } from 'cryptoview/adapter/btc';
import { RavencoinRpcClientConfig } from 'cryptoview/adapter/rvn';
import { LitecoinRpcClientConfig } from 'cryptoview/adapter/ltc';
import { DogecoinRpcClientConfig } from 'cryptoview/adapter/doge';
import { EthRpcConfig } from 'cryptoview/adapter/eth';

const __name__ = 'cryptoview.config';

class CryptoViewBlockchainConfig {
    bitcoin = {} as BitcoinRpcClientConfig;
    litecoin = {} as LitecoinRpcClientConfig;
    dogecoin = {} as DogecoinRpcClientConfig;
    ravencoin = {} as RavencoinRpcClientConfig;
}

export class CryptoViewConfig {
    static readonly configfile = getEnv('CONFIGFILE', './config/config.yml') as string;
    private static config = undefined as unknown as CryptoViewConfig;
    readonly blockchains = {} as CryptoViewBlockchainConfig;
    readonly mongodb = {} as MongoDbConfig;
    readonly ethereum = {} as EthRpcConfig;

    constructor(cfg: any) {
        if ( Object.prototype.hasOwnProperty.call(cfg, "blockchains") && cfg.blockchains ) {
        Object.keys(cfg.blockchains).forEach( (bc: string) => {
            const blockchainCfg = cfg.blockchains[bc];
            switch (blockchainCfg.currency) {
            case "RVN":
                this.blockchains.ravencoin = new RavencoinRpcClientConfig(blockchainCfg);
                break;
            case "LTC":
                this.blockchains.litecoin = new LitecoinRpcClientConfig(blockchainCfg);
                break;
            case "DOGE":
                this.blockchains.dogecoin = new DogecoinRpcClientConfig(blockchainCfg);
                break;
            case "BTC":
            default:
                this.blockchains.bitcoin = new BitcoinRpcClientConfig(blockchainCfg);
                break;
            }
        });
        }
        if (Object.prototype.hasOwnProperty.call(cfg, "mongodb") && cfg.mongodb) {
            this.mongodb = new MongoDbConfig(cfg.mongodb);
        }
        if (Object.prototype.hasOwnProperty.call(cfg, "etherem") && cfg.ethereum) {
            this.ethereum = new EthRpcConfig(cfg.ethereum);
        }
    }

    /**
     * Load any config file up into an object we can use later.
     * @param configfile {string} The config file to load as YAML.
     * @returns {Promise<CryptoViewConfig>} The config object to use later in the program.
     */
    async loadConfig(configfile: string): Promise<CryptoViewConfig> {
        const ymlConfig = await readFile(configfile, "utf8") as string;
        const config = new CryptoViewConfig(loadYaml(ymlConfig));
        return config;
    }

    /**
     * Static member to return us a default configuration each time.
     * Also acts like a singleton.
     * @returns {Promise<CryptoViewConfig>}
     */
    static async getConfig(): Promise<CryptoViewConfig> {
        if ( typeof CryptoViewConfig.config === "undefined" ) {
            const ymlConfig = await readFile(CryptoViewConfig.configfile, "utf8") as string;
            CryptoViewConfig.config = new CryptoViewConfig(loadYaml(ymlConfig));
        }
        return CryptoViewConfig.config;
    }
}

export const getConfig = CryptoViewConfig.getConfig as Function;
