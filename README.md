
# Crypto Ledger

## Purpose
I created this project because I am growing weary of keeping track of all my coins in all these
places. I want a simple interface to tell me how much of what is held where and I don't care if
you are an exchange, dApp, wallet address or which blockchain you are on.

I want a single pane of glass that lets me see my net worth in crypto.
I don't want to have to submit KYC in order to view this information either since it should be private
and local to me.

## Concept

### Operation
I select a blockchain/coin, I enter my address.
The interface will then populate with all of the transactions and the price of the transaction at
the timestamp it took place.

### View/Design
I can see my current wealth as well across all transactions.
I can see graphs of my portfolio and what is allocated where.

When I make trades or move crypto from wallet to wallet or exchange ERC20/BEP20/&gt;insert-blockchain-here&lt;
tokens, they are automatically detected and the interface updates with the latest info, polling every
few seconds/minutes to ensure records are kept up to date.

## Security
This interface will run local to the machine of the user that wants to keep track of this information.
Results can be exported to CSV for integrations into other tools.
Pricing, transaction information and such may be queried from other configurable sources via the user.

## Integrations
To Developers: You can integrate with exchanges and such to collect information from them. I just don't
want this interface being locked into a single entity for all information.

Ideally, with each integration, it's added into an averaging mechanism that averages/normalizes the
price among all the configurable exchanges (for price information) and summarize an average of said
data.

Example: I build an integration to Coinmarketcap. Someone else builds an integration to Coingecko.
Some else further creates an integration into Binance. We are now getting price information across
3 platforms. It would be a nice feature to be able to take the average of all their prices instead
of being locked into a single entity for pricing data.


# bitcoin-cli
Install [bitcoin-core](https://github.com/bitcoin/bitcoin/releases) to ensure you have the official
bitcoind and bitcoin-qt installed and able to run.

Here's a little detail on some of the required pieces that are bare dependencies you can find in any
guide:

- _bind_: This is the address bitcoind will listen/bind for other bitcoind instances to find this one.
  You can port-forward the Internet to this port to help support the Network as I understand it.
- _listen_: Set this to "1" to ensure listen mode is active.
- _server_: Set this to "1" in your wallet (bitcoin-qt) configuration to make it act like a server.
- _rpcbind_: Bind to this address for JSON-RPC commands. HINT: Install bitcoind on a server and rpcbind
  to your local network address (e.g. 192.168.1.3:8333).
- _rpcconnect_: In your client configuration, tell your `bitcoin-cli` where to connect by default without
  having to specify on each command.

Here's configuration tweaks I did in order to get this working:

### txindex
By default, `txindex` is set to false, which says don't index the entire blockchain. We do not want this
in this setup as we are scanning the blockchain for other transactions as well.
I have bitcoin running as a dedicated user. In `~btc/.bitcoin/bitcoin.conf`, make sure you have

    txindex=1

somewhere in the file to ensure we can find unrelated transactions. This lets `getrawtransaction` get
a value.

### rpcworkqueue / ulimit
I had to set `rpcworkqueue=5000` at least since I saw some blocks with >3000 transactions!<br />
I also had to set `ulimit -n 40960` to ensure bitcoind/bitcoin-qt had access to enough file descriptors
in `~/.bitcoin/blocks/`.

Setting these limits enabled me to run parallel queries against the bitcoind/bitcoin-qt for transactions
in large batches without halting the whole scripts.
(e.g. `await Promise.all(block.tx.forEach())` vs `for await (const block in this.getBlock())`)
