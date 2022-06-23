
import { Bitcoin } from 'cryptoview/adapter/btc';
import { log } from "cryptoview/logger";
const __name__ = 'cryptoview.adapter.rvn';

export namespace Ravencoin {

  export class RpcClientConfig extends Bitcoin.RpcClientConfig {}

  export class WalletAddress extends Bitcoin.WalletAddress {
      constructor(cfg: any) {
          super(cfg);
          this.logPrefix = `${__name__}.RavencoinWalletAddress(${this.currency})`;
      }

      async txid2txn(client: any): Promise<Txn[]> {
          log.info(this.logPrefix, 'Collecting transactions related to the wallet.')
          const result = [] as Txn[];
          for ( var t in this.txids ) {
              var txid = this.txids[t];
              log.debug(this.logPrefix, `client.getTransaction(${txid})`)
              const txn = await client.getTransaction(txid);
              log.trace(this.logPrefix, 'client.getTransaction().result = ' + JSON.stringify(txn, null, 2));
              result.push(new Txn({
              ...txn,
              currency: this.currency
              }));
          }
          return result;
      }
  }

  class AssetDetail {
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

  export class Txn extends Bitcoin.Txn {
    readonly asset_details = [] as AssetDetail[];

    constructor(txn: any) {
      super(txn);
      if ( txn.hasOwnProperty('asset_details') && txn.asset_details instanceof Array ) {
        for ( var d in txn.asset_details ) {
          var detail = txn.asset_details[d] as AssetDetail;
          this.asset_details.push( new AssetDetail(detail) );
        }
      }
    }
  }

  export class Adapter extends Bitcoin.Adapter {
    constructor(cfg: any) {
        super(cfg);
        this.logPrefix = `${__name__}.RavencoinAdapter(${cfg.currency})`;
    }

    async getMyWallets(): Promise<WalletAddress[]> {
      log.verbose(this.logPrefix, 'getMyWallets()')
      const result = [] as WalletAddress[];
      // We want receiving addresses that have at least 1 confirmation, but not empty (e.g. wallets we've only sent tokens to)
      //  or watchOnly wallets since they aren't "my" wallets.
      const receivingAddresses = await this.client.listReceivedByAddress(1, false, false);
      log.trace(this.logPrefix, 'getMyWallets.listReceivedByAddress().result = ' + JSON.stringify(receivingAddresses));
      receivingAddresses.forEach( (address: any) => {
        var walletAddress = new WalletAddress({
          ...address,
          currency: this.getCurrency()
        });
        result.push(walletAddress);
      });
      return result;
    }
    

    async getMyTransactions(): Promise<Txn[]> {
      log.verbose(this.logPrefix,'getMyTransactions()');
      const result = [] as Txn[];
      const wallets = await this.getMyWallets();
      for ( var w in wallets ) {
        var wallet = wallets[w];
        var txns = await wallet.txid2txn(this.client);
        result.push(...txns)
      }
      log.info(this.logPrefix, `Found ${result.length} transactions.`)
      return result;
    }
  }
}
