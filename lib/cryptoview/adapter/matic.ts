
import Web3 from 'web3';
import { getConfig } from 'cryptoview/config';
import { log } from 'cryptoview/logger';
const __name__ = 'cryptoview.adapter.matic';

export namespace Polygon {
    class InfuraStruct {
        public static MAINNET = 'https://polygon-rpc.com/' as string;

        private readonly projectId = '' as string;
        private readonly secret = '' as string;
        constructor(projectId: string, secret: string) {
            this.projectId = projectId;
            this.secret = secret;
        }

        getServiceUrl(): string {
            return `${InfuraStruct.MAINNET}`;
        }
    }

    export class RpcConfig {
        readonly address = '' as string;
        readonly infura = {} as InfuraStruct;
        constructor(cfg: any) {
            this.address = cfg.address;
            this.infura = new InfuraStruct(cfg.infura.projectId, cfg.infura.secret);
        }

        getServiceUrl(): string {
            return this.infura.getServiceUrl();
        }
    }
}

export async function main() {
    log.debug(__name__, 'main();');
    const config = await getConfig();
    const web3 = new Web3( config.blockchains.ethereum.getServiceUrl() );

    const balance = web3.utils.fromWei( await web3.eth.getBalance(config.blockchains.ethereum.address),  'ether' );
    log.info(__name__, `MATIC Balance: ${balance}`);
    return balance;
}
