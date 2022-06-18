
import Web3 from 'web3';
import { getEnv, loadConfig } from '../utils';
import { log } from '../logger';
const __name__ = 'cryptoview.adapter.eth';

class InfuraStruct {
    public static MAINNET = 'https://mainnet.infura.io/v3/' as string;

    private readonly projectId = '' as string;
    private readonly secret = '' as string;
    constructor(projectId: string, secret: string) {
        this.projectId = projectId;
        this.secret = secret;
    }

    getServiceUrl(): string {
        return `${InfuraStruct.MAINNET}${this.projectId}`;
    }
}

export class EthRpcConfig {
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

export async function main() {
    log.debug(__name__, 'main();');
    const config = await loadConfig( getEnv('CONFIGFILE', './config/config.yml') );
    const web3 = new Web3( config.ethereum.getServiceUrl() );

    const balance = web3.utils.fromWei( await web3.eth.getBalance(config.ethereum.address) );
    log.info(__name__, `ETH Balance: ${balance}`);
    return balance;
}
