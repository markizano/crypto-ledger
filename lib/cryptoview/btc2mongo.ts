
import { MongoClient } from 'mongodb';
import * as Bitcoin from 'bitcoin-core';
import { BTC_Transaction } from './transactions';
import { debugPass, debugFail } from './utils';

async function btc2mongo() {
  
}
  
// Python equivalent of if __name__ == "__main__":
if ( typeof require !== "undefined" && require.main == module ) {
  btc2mongo().then(debugPass).catch(debugFail).finally(() => {
    console.log('Complete!');
  });
}
  
