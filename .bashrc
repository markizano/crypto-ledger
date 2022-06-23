# RC script meant to help make this easier when working on it.
export NODE_PATH=~/git/markizano/crypto-ledger/build

function getdecodedrawtransaction() {
  rpcclient=${rpcclient:-bitcoin-cli}
  txid="$1"
  rawtx=`$rpcclient getrawtransaction $txid`
  $rpcclient decoderawtransaction "$rawtx";
}
