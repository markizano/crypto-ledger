# RC script meant to help make this easier when working on it.
export NODE_PATH=~/git/markizano/crypto-ledger/build

export rpcclient=${rpcclient:-bitcoin-cli}
function getdecodedrawtransaction() {
  txid="$1"
  $rpcclient decoderawtransaction "`$rpcclient getrawtransaction $txid`";
}
function getbestblockhash() { $rpcclient getblockchaininfo | jq -r '.bestblockhash'; }
function getblock() { $rpcclient getblock "$1"; }
function gettransaction() { $rpcclient gettransaction "$1"; }
