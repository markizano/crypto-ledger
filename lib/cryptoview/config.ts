
import { load as loadYaml } from 'js-yaml';
import { readFile } from 'fs/promises';

import { log } from 'cryptoview/logger';
import { getEnv } from 'cryptoview/utils';
import { MongoDbConfig } from 'cryptoview/adapter/mongo';
import { Bitcoin } from 'cryptoview/adapter/btc';
import { Ravencoin } from 'cryptoview/adapter/rvn';
import { LitecoinRpcClientConfig } from 'cryptoview/adapter/ltc';
import { DogecoinRpcClientConfig } from 'cryptoview/adapter/doge';
import { Ethereum } from 'cryptoview/adapter/eth';
import { BinanceSmartChain } from 'cryptoview/adapter/bnb';

const __name__ = 'cryptoview.config';

export namespace CryptoView {

    class BlockchainConfig {
        bitcoin = {} as Bitcoin.RpcClientConfig;
        litecoin = {} as LitecoinRpcClientConfig;
        dogecoin = {} as DogecoinRpcClientConfig;
        ravencoin = {} as Ravencoin.RpcClientConfig;
        ethereum = {} as Ethereum.RpcConfig;
        binance = {} as BinanceSmartChain.Config;

        getBlockchain(name: string): any {
            switch(name) {
                case 'bitcoin': return this.bitcoin;
                case 'litecoin': return this.litecoin;
                case 'dogecoin': return this.dogecoin;
                case 'ravencoin': return this.ravencoin;
                case 'ethereum': return this.ethereum;
                case 'binance': return this.binance;
                default:
                    log.warn(__name__, `getBlockchain(name=${name}): Unknown name.`)
                    return undefined;
            }
        }
    }

    export class Config {
        static readonly configfile = getEnv('CONFIGFILE', './config/config.yml') as string;
        private static config = undefined as unknown as Config;
        readonly blockchains = undefined as unknown as BlockchainConfig;
        readonly mongodb = {} as MongoDbConfig;

        constructor(cfg: any) {
            if ( Object.prototype.hasOwnProperty.call(cfg, "blockchains") && cfg.blockchains ) {
                this.blockchains = new BlockchainConfig();
                Object.keys(cfg.blockchains).forEach( (bc: string) => {
                    const blockchainCfg = cfg.blockchains[bc];
                    switch (blockchainCfg.currency) {
                        case "RVN":
                            this.blockchains.ravencoin = new Ravencoin.RpcClientConfig(blockchainCfg);
                            break;
                        case "LTC":
                            this.blockchains.litecoin = new LitecoinRpcClientConfig(blockchainCfg);
                            break;
                        case "DOGE":
                            this.blockchains.dogecoin = new DogecoinRpcClientConfig(blockchainCfg);
                            break;
                        case "BTC":
                            this.blockchains.bitcoin = new Bitcoin.RpcClientConfig(blockchainCfg);
                            break;
                        case "ETH":
                            this.blockchains.ethereum = new Ethereum.RpcConfig(blockchainCfg);
                            break;
                        case "BNB":
                            this.blockchains.binance = new BinanceSmartChain.Config(blockchainCfg);
                            break;
                        default:
                            //log.warn(__name__, `Unknown type "${blockchainCfg.type}" when parsing "${bc}" from ${Config.configfile}. Skipping...`);
                            //console.trace(blockchainCfg);
                            break;
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(cfg, "mongodb") && cfg.mongodb) {
                this.mongodb = new MongoDbConfig(cfg.mongodb);
            }
        }

        /**
         * Load any config file up into an object we can use later.
         * @param configfile {string} The config file to load as YAML.
         * @returns {Promise<Config>} The config object to use later in the program.
         */
        static async factory(configfile: string): Promise<Config> {
            const ymlConfig = await readFile(configfile, "utf8") as string;
            const config = new Config(loadYaml(ymlConfig));
            return config;
        }

        /**
         * Static member to return us a default configuration each time.
         * Also acts like a singleton.
         * @returns {Promise<Config>}
         */
        static async getConfig(): Promise<Config> {
            if ( typeof Config.config === "undefined" ) {
                const ymlConfig = await readFile(Config.configfile, "utf8") as string;
                Config.config = new Config(loadYaml(ymlConfig));
            }
            return Config.config;
        }
    }
}

export const getConfig = CryptoView.Config.getConfig as Function;
