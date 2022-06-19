
import { WalletAddress } from 'cryptoview/adapter/btc';
import { MongoModel } from 'cryptoview/adapter/mongo';
import { log } from 'cryptoview/logger';
import { getEnv, loadConfig } from 'cryptoview/utils';
const __name__ = 'cryptoview.model.balance';

let mdb = undefined as unknown as MongoModel;

class WalletBalance {
  private readonly label = '' as string;
  private readonly address = '' as string;
  private readonly amount = 0 as number;
  private readonly currency = '' as string;

  constructor(label: string, address: string, balance: number, currency: string) {
    this.label = label;
    this.address = address;
    this.amount = balance;
    this.currency = currency;
  }
  toString(): string {
    return `${this.label} (${this.address}): ${this.amount} ${this.currency}`;
  }
}

export async function main() {
  log.debug(__name__, 'main();');
  const config = await loadConfig( getEnv('CONFIGFILE', './config/config.yml') );
  mdb = new MongoModel(config.mongodb);

  const result = {
    status: 200 as number,
    response: 'OK' as string,
    balances: {} as any,
  } as any;

  await mdb.connect();

  (await mdb.fetchWallets()).forEach( (wallet: WalletAddress) => {
    const walBal = new WalletBalance(wallet.label, wallet.address, wallet.amount, wallet.currency);
    log.info(__name__, walBal.toString());
    if (result.balances.hasOwnProperty(wallet.currency)) {
      result.balances[wallet.currency] += wallet.amount;
    } else {
      result.balances[wallet.currency] = wallet.amount;
    }
  });

  return result;
}

export function tidyUp() {
  mdb.close();
  log.info(__name__, 'Complete!');
}
