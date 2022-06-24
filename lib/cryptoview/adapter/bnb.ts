
import { BncClient } from "@binance-chain/javascript-sdk";

export namespace BinanceSmartChain {

    class ConfigAccount {
        address = '' as string;
        privateKey? = '' as string;
        constructor(cfg: any) {
            this.address = cfg.address;
            if ( cfg.privateKey ) {
                this.privateKey = cfg.privateKey;
            }
        }
        hasPrivateKey(): boolean {
            return !!this.privateKey;
        }
    }

    export class Config {
        readonly api = '' as string;
        readonly account = {} as ConfigAccount;

        constructor(cfg: any) {
            this.account = new ConfigAccount(cfg);
            this.api = cfg.api;
        }
        hasPrivateKey(): boolean {
            return this.account.hasPrivateKey();
        }
        getPrivateKey(): string {
            return this.account.privateKey || '';
        }
        getServer(): string {
            return this.api || '';
        }
    }

    export class Adapter {

        protected readonly config = undefined as unknown as Config;
        protected readonly client = undefined as unknown as BncClient;

        constructor(cfg: any) {
            this.config = new Config(cfg);
            this.client = new BncClient(this.config.getServer());
            this.client.getBalance(this.config.account.address);
            if ( this.config.hasPrivateKey() ) {
                this.client.recoverAccountFromPrivateKey(this.config.getPrivateKey());
            }
        }

    }
}
