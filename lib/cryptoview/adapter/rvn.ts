
import { BitcoinRpcClientConfig, BitcoinAdapter } from "cryptoview/adapter/btc";

class RavencoinAssetDetail {
    readonly asset_type = '' as string;
    readonly asset_name = '' as string;
    readonly amount = 0 as number;
    readonly message = '' as string;
    readonly destination = '' as string;
    readonly vout = 0 as number;
    readonly category = '' as string;
    readonly abandoned = false as boolean;
    constructor(cfg: any) {
        this.asset_type = cfg.asset_type;
        this.asset_name = cfg.asset_name;
        this.amount = cfg.amount;
        this.message = cfg.message;
        this.destination = cfg.destination;
        this.vout = cfg.vout;
        this.category = cfg.category;
        this.abandoned = cfg.abandoned;
    }
}

export class RavencoinRpcClientConfig extends BitcoinRpcClientConfig {
    readonly asset_details = [] as RavencoinAssetDetail[];
    constructor(cfg: any) {
        super(cfg);
        if ( cfg.hasOwnProperty('asset_details') ) {
            cfg.asset_details.forEach((asset_detail: any) => {
                this.asset_details.push( new RavencoinAssetDetail(asset_detail) );
            });
        }
    }
}
