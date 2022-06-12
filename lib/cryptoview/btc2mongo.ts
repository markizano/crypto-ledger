
import { MongoClient } from 'mongodb';
const Bitcoin = require('bitcoin-core');
import { BTC_Transaction } from './transactions';
import { debugPass, debugFail, loadConfig } from './utils';

async function btc2mongo() {
  const config = await loadConfig('./config/config.yml');
  const btcClient = new Bitcoin(config.bitcoin);
  const balance = btcClient.getBalance('*', 1);
  const transactions = [];
  (await btcClient.listTransactions()).forEach( (txn: any) => {
      console.log(txn);
      transactions.push( new BTC_Transaction(
          txn.txid,
          txn.address,
          txn.category,
          txn.label || "undefined",
          txn.amount,
          "BTC",
          0,
          txn.blockhash,
          txn.blockheight,
          txn.blockindex,
          txn.blocktime
      ) );
  });;

}
  
// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
  btc2mongo().then(debugPass).catch(debugFail).finally(() => console.log('Complete!') );
}

